# Socket.IO Real-Time Integration Guide

## Overview

TUAN Creations Academy now includes a **WebSocket-based real-time layer** powered by Socket.IO for live course sessions, participant tracking, and instant chat messaging.

## Architecture

### Backend (Node.js + Express + Socket.IO)

**File**: `backend/src/server.js`

- **HTTP Server**: Upgraded from `app.listen()` to `createServer()` + Socket.IO
- **Port**: 4000 (configurable via `PORT` env var)
- **Authentication**: 
  - **Production**: Requires JWT token in socket handshake auth
  - **Development** (NODE_ENV=development): Allows guest connections for testing
- **Room-Based Architecture**: Course-scoped rooms (e.g., `course-1`, `course-2`)
- **State Management**: In-memory room state with real-time broadcasts

**Event Handlers**:
- `live:join` - User joins a course room
- `live:chat-message` - Send/broadcast chat messages
- `live:user-typing` - Typing indicator (auto-clears after 3 seconds)
- `live:participant-joined` - Broadcast when user joins room
- `live:participant-left` - Broadcast when user leaves room
- `disconnect` - Handle graceful disconnects

**Features**:
- Full error logging with `[Socket]` prefix
- Automatic room cleanup on user leave
- Message history limited to last 100 messages per room
- Enrollment verification before allowing room access

### Frontend (React + Socket.IO Client)

**File**: `src/pages/LiveSessionPage.tsx`

- **Client Library**: `socket.io-client` (installed in package.json)
- **Connection Strategy**: 
  - Derives socket endpoint from API base URL (same origin)
  - Passes JWT token in auth handshake if available
  - Implements exponential backoff reconnection strategy
- **Authentication Guard**: Disables real-time features if no JWT token
- **Typing Indicators**: Shows "User is typing..." with auto-clear timeout

**Features**:
- Auto-reconnection with max 5 attempts (1-5 second delays)
- Deduplication of chat messages (prevents duplicates)
- Real-time participant list sync
- Typing indicator broadcast on input
- Connection status indicator ("Realtime connected/offline")
- Error toasts for connection failures and auth issues

## Deployment

### Prerequisites

```bash
npm install socket.io socket.io-client
```

Both packages are already in `package.json` and `backend/package.json`.

### Environment Variables

**Backend** (`.env`):
```env
PORT=4000
NODE_ENV=production  # Set to 'production' for auth-only mode
CLIENT_ORIGIN=https://yourdomain.com  # CORS origin for Socket.IO
MONGODB_URI=...
JWT_SECRET=...
```

**Frontend** (`.env`):
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Docker / Production Deployment

**Important**: Ensure your deployment sets `NODE_ENV=production` to enforce JWT authentication.

**Nginx Proxy Configuration** (if using reverse proxy):
```nginx
location /socket.io {
    proxy_pass http://backend:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

**Docker Compose Example**:
```yaml
services:
  backend:
    image: tuancreations:backend
    ports:
      - "4000:4000"
    environment:
      NODE_ENV: production
      PORT: 4000
      CLIENT_ORIGIN: https://yourdomain.com
      MONGODB_URI: ...
      JWT_SECRET: ...
```

### Database Considerations

- **In-Memory State**: Live session room state is **NOT persisted** (ephemeral)
- **Chat Messages**: Only stored in-memory during active session (last 100 messages)
- **Scalability**: For multi-server deployments, use Redis adapter:

```javascript
// backend/src/server.js (after Socket.IO creation)
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const pubClient = createClient({ host: "redis", port: 6379 });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

## Usage

### For Students (Frontend)

1. **Enroll in a course** from Academy
2. **Join live session** - Navigate to `/live-session?courseId=X`
3. **Chat in real-time** - Type messages and see instant delivery
4. **See typing indicators** - Know when others are typing
5. **View participants** - Real-time participant list with online status

### For Instructors (API)

**Start a live session**:
```bash
POST /api/academy/live-sessions
{
  "courseId": 1,
  "instructorId": "user-123"
}
```

**Broadcast to all connected users in a room**:
- Handled automatically by Socket.IO handlers

**Monitor active rooms** (logs):
```bash
# Check backend logs for [Socket] prefixed messages
# Shows: joins, leaves, messages, errors
```

## Testing

### Development Mode

Start backend with development mode:
```bash
NODE_ENV=development npm start
```

This allows **guest connections** for testing without JWT tokens.

### Multi-Client Testing

1. Open two browser tabs to same live session page
2. Type message in Tab 1 → appears instantly in Tab 2
3. Close Tab 1 → Tab 2 shows "participant left" in real-time
4. See typing indicators as you type in chat input

### Load Testing

```bash
# Install artillery
npm install -g artillery

# Run load test (100 concurrent users, 10 messages/sec)
artillery quick --count 100 --num 10 ws://localhost:4000/socket.io
```

## Troubleshooting

### Issue: "No auth token available - socket features disabled"

**Cause**: User not authenticated or no JWT token stored  
**Solution**: 
- Ensure user is logged in (`/auth` page)
- Check browser LocalStorage for `tuanSession` key with token
- In production, JWT is required; in dev mode (NODE_ENV=development), guests are allowed

### Issue: "Connection lost. Reconnecting..."

**Cause**: Backend unreachable or server restarted  
**Solution**:
- Check backend is running on port 4000
- Verify CORS origin matches in backend config
- Check firewall/proxy rules allow WebSocket connections

### Issue: Messages not syncing between tabs

**Cause**: Socket connection failed silently  
**Solution**:
- Open browser DevTools → Network → WS tab
- Look for `socket.io` WebSocket connection
- Check console for connection errors
- Verify backend socket logs: `[Socket]` prefix

### Issue: "Please enroll in the course before joining"

**Cause**: User not enrolled in the course  
**Solution**:
- Enroll user in course via Academy enrollment API
- Verify courseId matches enrolled course ID

## Event Reference

### Client → Server

| Event | Payload | Response |
|-------|---------|----------|
| `live:join` | `{ courseId: number }` | `live:room-state` |
| `live:chat-message` | `{ courseId, text: string }` | Broadcast `live:chat-message` |
| `live:user-typing` | `{ courseId, isTyping: boolean }` | Broadcast `live:user-typing` |

### Server → All Clients (in room)

| Event | Payload |
|-------|---------|
| `live:room-state` | Full SessionMeta object |
| `live:chat-message` | ChatMessage object |
| `live:participants` | User[] array |
| `live:participant-joined` | User object |
| `live:participant-left` | `{ userId: string }` |
| `live:user-typing` | `{ userId, userName, isTyping }` |
| `live:error` | `{ message: string }` |

## Security Considerations

1. **Authentication**: All production sockets require valid JWT
2. **Enrollment Check**: Users cannot join sessions they're not enrolled in
3. **Rate Limiting**: Consider adding rate limiting for message/typing events
4. **CORS**: Socket.IO CORS is restricted to `CLIENT_ORIGIN` env var
5. **Token Validation**: JWT tokens are verified on every connection

## Performance Tuning

### Message Retention

Default: Last 100 messages per room  
To change, edit `backend/src/server.js`:

```javascript
room.chatMessages = [...room.chatMessages, message].slice(-50); // Keep 50 instead
```

### Typing Indicator Timeout

Default: 3 seconds  
To change, edit `src/pages/LiveSessionPage.tsx`:

```javascript
const timeout = setTimeout(() => {
  // Clear typing
}, 5000); // 5 seconds instead
```

### Reconnection Strategy

Edit `src/pages/LiveSessionPage.tsx`:

```javascript
const socket = io(getApiOrigin(), {
  reconnection: true,
  reconnectionDelay: 500,       // Start at 500ms
  reconnectionDelayMax: 10000,   // Max 10s between retries
  reconnectionAttempts: 10,      // Try 10 times
});
```

## Logging

### Backend Logs

Prefix: `[Socket]`

Examples:
```
[Socket] New connection: qkE5...YVA (guest)
[Socket] Guest user connecting (dev mode): qkE5...YVA
[Socket] Authenticated user connected: user@example.com
[Socket] User John Doe joined course 1
[Socket] Message from Jane: "Hello everyone!"
[Socket] User John Doe left course 1
[Socket] Error in live:join: Course not found
```

### Frontend Logs

Console messages show connection lifecycle:
```
[Socket] Connected with ID: 8gj...3Ka
[Socket] No auth token available - socket features disabled
[Socket] Connection error: Authentication required
[Socket] Disconnected
```

## Future Enhancements

1. **Persistence**: Store chat history in MongoDB
2. **Presence**: Show "User is away" after 30 seconds of inactivity
3. **File Sharing**: Support file upload/download during sessions
4. **Recording**: Broadcast record/stop events for server-side recording
5. **Analytics**: Track session metrics (duration, participants, engagement)
6. **Notifications**: Send push notifications for room invites/updates

## Support

For issues or questions:
- Check backend logs: `[Socket]` prefix
- Check browser console for client-side errors
- Review EventHandlers in `LiveSessionPage.tsx`
- Verify environment variables are set correctly
