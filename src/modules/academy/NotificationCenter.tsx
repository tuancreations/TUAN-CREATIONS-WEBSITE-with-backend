import { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";
import { Notification, getNotifications, markNotificationAsRead } from "../../services/api";
import { Link } from "react-router-dom";

export default function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      try {
        const { notifications: data, unreadCount: count } = await getNotifications();
        if (isMounted) {
          setNotifications(data);
          setUnreadCount(count);
        }
      } catch {
        if (isMounted) {
          setNotifications([]);
          setUnreadCount(0);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (user) {
      loadNotifications();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleMarkAsRead = async (notificationId: string | undefined) => {
    if (!notificationId) return;

    try {
      await markNotificationAsRead(notificationId);
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  const notificationTypeColors: Record<Notification["type"], string> = {
    enrollment: "bg-blue-100 text-blue-800",
    session_reminder: "bg-amber-100 text-amber-800",
    recording_ready: "bg-purple-100 text-purple-800",
    completion: "bg-emerald-100 text-emerald-800",
    announcement: "bg-rose-100 text-rose-800",
  };

  const notificationTypeIcons: Record<Notification["type"], string> = {
    enrollment: "📚",
    session_reminder: "🔔",
    recording_ready: "🎬",
    completion: "✅",
    announcement: "📢",
  };

  if (!user) {
    return (
      <div className="card">
        <p className="text-sm text-[var(--text-soft)]">
          Sign in to view your notifications.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl">Notifications</h2>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Stay updated with your academy activities
            </p>
          </div>
          {unreadCount > 0 && (
            <div className="bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {unreadCount}
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-[var(--accent-color)] text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-soft)] hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              filter === "unread"
                ? "bg-[var(--accent-color)] text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-soft)] hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="card text-center">
          <p className="text-sm text-[var(--text-soft)]">Loading notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="card text-center">
          <p className="text-sm text-[var(--text-soft)]">
            {filter === "unread"
              ? "No unread notifications"
              : "No notifications yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`card ${
                notification.isRead ? "opacity-60" : "border-l-4 border-[var(--accent-color)]"
              }`}
            >
              <div className="flex gap-4">
                <div className="text-2xl flex-shrink-0">
                  {notificationTypeIcons[notification.type]}
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{notification.title}</h3>
                      <p className="mt-1 text-sm text-[var(--text-soft)]">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-[var(--text-soft)]">
                        {new Date(notification.createdAt || "").toLocaleDateString()}{" "}
                        {new Date(notification.createdAt || "").toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="ml-4 px-3 py-1 text-xs bg-[var(--accent-color)] text-white rounded hover:opacity-80 transition-opacity flex-shrink-0"
                      >
                        Mark read
                      </button>
                    )}
                  </div>

                  {notification.courseId && (
                    <div className="mt-3">
                      <Link
                        to={`/course/${notification.courseId}`}
                        className="btn-ghost text-xs"
                      >
                        View Course →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
