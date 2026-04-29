import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import countryList from "react-select-country-list";
import { Globe, X } from "lucide-react";
import { io, type Socket } from "socket.io-client";
import { getApiOrigin, getCourses, getLiveSession, getStoredToken, joinLiveSession, recordAction, startRecording, stopRecording, type Course, type SessionMeta } from "../services/api";
import { useAuth } from "../store/auth";

type Role = "instructor" | "co-instructor" | "student" | "admin";

type User = {
  id: string;
  name: string;
  role: Role;
  isOnline?: boolean;
  isSpeaking?: boolean;
};

type ChatMessage = {
  id: string | number;
  senderId?: string;
  senderName: string;
  text: string;
  time: string;
  isInstructor?: boolean;
};

const nowFormatted = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function LiveSessionPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedCourseId = Number(searchParams.get("courseId"));
  const [courseCatalog, setCourseCatalog] = useState<Course[]>([]);

  // ----- demo/local state -----
  const currentUser = useMemo<User>(
    () => ({
      id: user?.id ?? "u-you",
      name: user?.name ?? "Guest User",
      role: user?.role === "admin" ? "admin" : "student",
      isOnline: true,
    }),
    [user?.id, user?.name, user?.role]
  );

  const [session, setSession] = useState<SessionMeta | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const [participants, setParticipants] = useState<User[]>([]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingLoading, setIsRecordingLoading] = useState(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [usersTyping, setUsersTyping] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // ----- Notification subscription -----
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState<{ label: string; value: string } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showSubscribeOverlay, setShowSubscribeOverlay] = useState(true);

  const countries = useMemo(() => countryList().getData(), []);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const subscribeNotifications = useCallback(() => {
    if (!email || !phoneNumber || !countryCode) {
      showToast("error", "Please fill all fields");
      return;
    }
    recordAction("live.subscribe", {
      courseId: selectedCourseId,
      email,
      phone: `${countryCode.value}${phoneNumber}`,
    }).catch(() => null);
    showToast("success", "Subscribed for live notifications!");
    setShowSubscribeOverlay(false);
  }, [email, phoneNumber, countryCode, showToast, selectedCourseId]);

  // ----- Chat -----
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoadingSession(true);
      try {
        const normalizedCourseId = Number.isNaN(selectedCourseId) ? 1 : selectedCourseId;

        if (user) {
          await joinLiveSession(normalizedCourseId);
        }

        const [catalog, liveSession] = await Promise.all([
          getCourses(),
          getLiveSession(normalizedCourseId),
        ]);

        if (!isMounted) return;

        setCourseCatalog(catalog);
        setSession(liveSession);
        setParticipants(
          (liveSession.participants ?? []).map((participant) => ({
            id: participant.id,
            name: participant.name,
            role: participant.role as Role,
            isOnline: participant.isOnline,
            isSpeaking: participant.isSpeaking,
          }))
        );
        setChatMessages(
          (liveSession.chatMessages ?? []).map((message) => ({
            id: message.id,
            senderId: message.senderId,
            senderName: message.senderName,
            text: message.text,
            time: message.time,
            isInstructor: message.isInstructor,
          }))
        );
      } catch {
        if (!isMounted) return;
        showToast("error", user ? "Unable to join this live room. Enroll first from Academy." : "Sign in and enroll before joining live sessions.");
      }

      if (!isMounted) return;
      setIsLoadingSession(false);
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [selectedCourseId, showToast, user]);

  const selectedCourse = useMemo(() => {
    if (Number.isNaN(selectedCourseId)) {
      return courseCatalog[0];
    }

    return courseCatalog.find((course) => course.id === selectedCourseId) ?? courseCatalog[0];
  }, [courseCatalog, selectedCourseId]);

  useEffect(() => {
    if (!selectedCourse || session) return;
    setSession((prev) =>
      prev
        ? {
            ...prev,
            title: selectedCourse.title,
            instructor: selectedCourse.instructor,
          }
        : prev
    );
  }, [selectedCourse, session]);

  useEffect(() => {
    const token = getStoredToken();
    const courseId = Number.isNaN(selectedCourseId) ? selectedCourse?.id : selectedCourseId;

    if (!session || !courseId) {
      return;
    }

    // Socket.IO requires authentication in production
    if (!token) {
      console.warn("[Socket] No auth token available - socket features disabled");
      showToast("error", "Please sign in to use real-time chat features");
      return;
    }

    const socket = io(getApiOrigin(), {
      transports: ["websocket"],
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    const mergeRoomState = (nextSession: SessionMeta) => {
      setSession((current) => ({
        ...(current ?? nextSession),
        ...nextSession,
      }));
      setParticipants(nextSession.participants ?? []);
      setChatMessages(nextSession.chatMessages ?? []);
    };

    socket.on("connect", () => {
      console.log("[Socket] Connected with ID:", socket.id);
      setIsRealtimeConnected(true);
      socket.emit("live:join", { courseId });
    });

    socket.on("live:room-state", (nextSession: SessionMeta) => {
      mergeRoomState(nextSession);
    });

    socket.on("live:participant-joined", (participant: User) => {
      setParticipants((current) => {
        const next = current.filter((entry) => entry.id !== participant.id);
        return [...next, participant];
      });
    });

    socket.on("live:participant-left", ({ userId }: { userId: string }) => {
      setParticipants((current) => current.filter((entry) => entry.id !== userId));
    });

    socket.on("live:participants", (nextParticipants: User[]) => {
      setParticipants(nextParticipants);
    });

    socket.on("live:chat-message", (message: ChatMessage) => {
      setChatMessages((current) => {
        if (current.some((entry) => entry.id === message.id)) {
          return current;
        }
        return [...current, message];
      });
    });

    socket.on("live:user-typing", ({ userId, userName, isTyping }: { userId: string; userName: string; isTyping: boolean }) => {
      setUsersTyping((current) => {
        const next = new Set(current);
        if (isTyping) {
          next.add(userId);
        } else {
          next.delete(userId);
        }
        return next;
      });

      // Clear typing timeout
      const existingTimeout = typingTimeoutRef.current.get(userId);
      if (existingTimeout) clearTimeout(existingTimeout);

      // Auto-clear typing indicator after 3 seconds if not updated
      if (isTyping) {
        const timeout = setTimeout(() => {
          setUsersTyping((current) => {
            const next = new Set(current);
            next.delete(userId);
            return next;
          });
        }, 3000);
        typingTimeoutRef.current.set(userId, timeout);
      }
    });

    socket.on("disconnect", () => {
      setIsRealtimeConnected(false);
      console.warn("[Socket] Disconnected");
    });

    socket.on("connect_error", (error) => {
      setIsRealtimeConnected(false);
      console.error("[Socket] Connection error:", error);
      if (error.message === "Authentication required") {
        showToast("error", "Authentication required for real-time features");
      } else {
        showToast("error", "Connection error. Attempting to reconnect...");
      }
    });

    socket.on("live:error", ({ message }: { message: string }) => {
      console.error("[Socket] Server error:", message);
      showToast("error", message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsRealtimeConnected(false);
      typingTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
      typingTimeoutRef.current.clear();
    };
  }, [selectedCourse?.id, selectedCourseId, session, selectedCourse, showToast]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendChat = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const text = newMessage.trim();
      if (!text) return;
      const socket = socketRef.current;

      const courseId = Number.isNaN(selectedCourseId) ? selectedCourse?.id ?? 0 : selectedCourseId;

      if (socket?.connected) {
        socket.emit("live:chat-message", {
          courseId,
          text,
        });
        // Clear typing indicator on send
        socket.emit("live:user-typing", { courseId, isTyping: false });
      } else {
        console.warn("[Chat] Socket not connected, message not sent");
        showToast("error", "You are not connected to the live session. Please refresh and try again.");
      }
      setNewMessage("");
    },
    [currentUser, newMessage, selectedCourse?.id, selectedCourseId, showToast]
  );

  // Handle typing indicator
  const handleInputChange = useCallback(
    (value: string) => {
      setNewMessage(value);
      const socket = socketRef.current;
      if (socket?.connected) {
        const courseId = Number.isNaN(selectedCourseId) ? selectedCourse?.id ?? 0 : selectedCourseId;
        socket.emit("live:user-typing", {
          courseId,
          isTyping: value.length > 0,
        });
      }
    },
    [selectedCourse?.id, selectedCourseId]
  );

  // ----- Toggle media -----
  const toggleMute = useCallback(() => setIsMuted((v) => !v), []);
  const toggleVideo = useCallback(() => setIsVideoOff((v) => !v), []);
  const toggleHand = useCallback(() => setIsHandRaised((v) => !v), []);

  const toggleRecording = useCallback(async () => {
    const courseId = Number.isNaN(selectedCourseId) ? selectedCourse?.id ?? 0 : selectedCourseId;
    if (!courseId) {
      showToast("error", "Course not found");
      return;
    }

    if (user?.role !== "instructor" && user?.role !== "admin") {
      showToast("error", "Only instructors can record sessions");
      return;
    }

    setIsRecordingLoading(true);
    try {
      if (!isRecording) {
        // Start recording
        await startRecording(courseId);
        setIsRecording(true);
        showToast("success", "Recording started");
      } else {
        // Stop recording
        await stopRecording(courseId);
        setIsRecording(false);
        showToast("success", "Recording stopped and saved");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Recording operation failed";
      showToast("error", message);
      console.error("Recording error:", error);
    } finally {
      setIsRecordingLoading(false);
    }
  }, [isRecording, selectedCourse?.id, selectedCourseId, showToast, user?.role]);

  // ----- Countdown -----
  const [countdown, setCountdown] = useState<number>(
    session?.startTime ? Math.max(Math.floor((new Date(session.startTime).getTime() - Date.now()) / 1000), 0) : 0
  );

  useEffect(() => {
    if (!session?.startTime) return;

    const initialCountdown = Math.max(Math.floor((new Date(session.startTime).getTime() - Date.now()) / 1000), 0);
    setCountdown(initialCountdown);
  }, [session?.startTime]);

  useEffect(() => {
    if (countdown <= 0) {
      setShowSubscribeOverlay(false);
      setSession((s) => (s ? { ...s, status: "live" } : s));
      return;
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatCountdown = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const onlineCount = useMemo(() => participants.filter((p) => p.isOnline).length, [participants]);

  if (isLoadingSession || !session) {
    return <div className="min-h-screen bg-black p-6 text-white">Loading live session...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900/60 border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{session.title}</h1>
            <p className="text-sm text-gray-300">{session.instructor} • {session.topic}</p>
            {session.status !== "live" && session.startTime && (
              <p className="text-xs text-gray-400">Next session starts: {new Date(session.startTime).toLocaleString()}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {session.status === "live" && <span className="px-3 py-1 rounded-full text-sm bg-red-600">🔴 LIVE</span>}
            <div className={`text-xs px-2 py-1 rounded-full ${isRealtimeConnected ? "bg-green-600" : "bg-gray-700"}`}>
              {isRealtimeConnected ? "Realtime connected" : "Realtime offline"}
            </div>
            <div className="text-sm text-gray-300">{onlineCount} online</div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto p-2 lg:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-72px)]">
          {/* Video + Overlay */}
          <section className="lg:col-span-3 relative flex flex-col">
            <div className="flex-1 bg-black rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center text-gray-400">
              {session.status === "live" ? (
                <p>Live video stream (provider SDK goes here)</p>
              ) : (
                <div className="text-center">
                  <p className="mb-2">Session is not live yet.</p>
                  {countdown > 0 && <p className="text-xl font-bold">{formatCountdown(countdown)}</p>}
                </div>
              )}

              {/* Subscribe Overlay */}
              {showSubscribeOverlay && session.status !== "live" && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 rounded-lg">
                  <button
                    onClick={() => setShowSubscribeOverlay(false)}
                    className="absolute top-2 right-2 text-gray-300 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                  <h4 className="text-lg font-semibold mb-2">Subscribe for Live Notifications</h4>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full max-w-xs mb-2 px-3 py-2 rounded text-black"
                  />
                  <div className="flex gap-2 max-w-xs w-full">
                    <div className="flex-1">
                      <Select
                        options={countries}
                        value={countryCode}
                        onChange={(v) => setCountryCode(v)}
                        placeholder={<div className="flex items-center gap-1"><Globe size={14}/> Country</div>}
                        className="text-black"
                      />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 px-3 py-2 rounded text-black"
                    />
                  </div>
                  <button
                    onClick={subscribeNotifications}
                    className="mt-3 px-4 py-2 bg-teal-600 rounded"
                  >
                    Subscribe
                  </button>
                </div>
              )}
            </div>

            {/* Controls */}
            {session.status === "live" && (
              <div className="bg-gray-900 rounded-lg p-3 mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className={`px-3 py-2 rounded ${isMuted ? "bg-red-600" : "bg-gray-800"}`}
                  >
                    {isMuted ? "Unmute" : "Mute"}
                  </button>
                  <button
                    onClick={toggleVideo}
                    className={`px-3 py-2 rounded ${isVideoOff ? "bg-red-600" : "bg-gray-800"}`}
                  >
                    {isVideoOff ? "Start Video" : "Stop Video"}
                  </button>
                  <button
                    onClick={toggleHand}
                    className={`px-3 py-2 rounded ${isHandRaised ? "bg-yellow-600 text-black" : "bg-gray-800"}`}
                  >
                    {isHandRaised ? "Lower Hand" : "Raise Hand"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-sm font-semibold ${isRecording ? "text-red-400" : "text-gray-300"}`}>
                    Recording: {isRecording ? "ON" : "OFF"}
                  </div>
                  <button
                    onClick={toggleRecording}
                    disabled={isRecordingLoading}
                    className={`px-3 py-2 rounded font-medium transition ${
                      isRecording
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-800 hover:bg-gray-700"
                    } ${isRecordingLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isRecordingLoading ? "Loading..." : isRecording ? "Stop Recording" : "Start Recording"}
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto">
            {/* Participants */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Participants ({onlineCount})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded bg-gray-800">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${p.isOnline ? "bg-green-400" : "bg-gray-600"}`} />
                      <div className="text-sm">{p.name}</div>
                    </div>
                    <div
                      className={`text-xs px-2 py-0.5 rounded ${
                        p.role === "instructor" ? "bg-teal-600 text-black" : "bg-gray-700 text-gray-200"
                      }`}
                    >
                      {p.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="bg-gray-900 rounded-lg p-4 flex-1 flex flex-col">
              <h3 className="font-semibold mb-2">Chat</h3>
              <div className="flex-1 overflow-y-auto space-y-3 mb-3 max-h-64">
                {chatMessages.map((m) => (
                  <div key={m.id} className="text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${m.isInstructor ? "text-teal-300" : "text-gray-300"}`}>{m.senderName}</span>
                      <span className="text-xs text-gray-500">{m.time}</span>
                    </div>
                    <div className="pl-2 border-l-2 border-gray-700 text-gray-200">{m.text}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendChat} className="flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none"
                />
                <button type="submit" className="px-3 py-2 rounded bg-teal-600">
                  Send
                </button>
              </form>
              {usersTyping.size > 0 && (
                <div className="text-xs text-gray-400 italic mt-2">
                  {Array.from(usersTyping).join(", ")} {usersTyping.size === 1 ? "is" : "are"} typing...
                </div>
              )}
            </div>

            {/* Resources & Previous Recordings */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Resources</h3>
              {session.resources && session.resources.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {session.resources.map((res, idx) => (
                    <li key={idx}>
                      <a href={res.url} target="_blank" className="text-teal-400 hover:underline">{res.title}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No resources available</p>
              )}

              <h3 className="font-semibold mt-4 mb-2">Previous Sessions</h3>
              {session.previousSessions && session.previousSessions.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {session.previousSessions.map((rec, idx) => (
                    <li key={idx}>
                      <a href={rec.recordingUrl} target="_blank" className="text-teal-400 hover:underline">{rec.title}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No previous sessions available</p>
              )}
            </div>

            {/* Toast */}
            {toast && (
              <div
                className={`fixed bottom-4 right-4 px-4 py-2 rounded ${
                  toast.type === "success" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {toast.message}
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
