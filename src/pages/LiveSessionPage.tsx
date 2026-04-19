import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import countryList from "react-select-country-list";
import { Globe, X } from "lucide-react";
import { courses } from "../services/mockApi";

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

type SessionMeta = {
  id: string;
  title: string;
  instructor: string;
  topic?: string;
  startTime?: string | null;
  durationMinutes?: number;
  status: "scheduled" | "live" | "ended";
  recordingUrl?: string | null;
  resources?: { title: string; url: string }[];
  previousSessions?: { title: string; recordingUrl: string }[];
};

const nowFormatted = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function LiveSessionPage() {
  const [searchParams] = useSearchParams();
  const selectedCourseId = Number(searchParams.get("courseId"));
  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId),
    [selectedCourseId]
  );

  // ----- demo/local state -----
  const [currentUser, setCurrentUser] = useState<User>({
    id: "u-you",
    name: "You",
    role: "student",
    isOnline: true,
  });

  const [session, setSession] = useState<SessionMeta>({
    id: "s-1",
    title: selectedCourse?.title ?? "Advanced AI & Machine Learning",
    instructor: selectedCourse?.instructor ?? "Eng. Godwin Ofwono",
    topic: "Neural Networks and Deep Learning",
    startTime: new Date(Date.now() + 1000 * 60 * 2).toISOString(), // 2 min later
    durationMinutes: 120,
    status: "scheduled",
    recordingUrl: null,
    resources: [
      { title: "Lecture Slides", url: "/resources/slides.pdf" },
      { title: "Reference Paper", url: "/resources/paper.pdf" },
    ],
    previousSessions: [
      { title: "Intro to AI", recordingUrl: "/recordings/session1.mp4" },
      { title: "Machine Learning Basics", recordingUrl: "/recordings/session2.mp4" },
    ],
  });

  const [participants, setParticipants] = useState<User[]>([
    { id: "u-1", name: "Eng. Godwin", role: "instructor", isOnline: true, isSpeaking: true },
    { id: "u-2", name: "Eng. Cissyln", role: "co-instructor", isOnline: true },
    { id: "u-3", name: "Sarah Nakato", role: "student", isOnline: true },
    { id: "u-you", name: "You", role: "student", isOnline: true },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, senderName: "Eng. Godwin", text: "Welcome everyone!", time: nowFormatted(), isInstructor: true },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // ----- Notification subscription -----
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState<{ label: string; value: string } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subscribed, setSubscribed] = useState(false);
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
    console.log({ email, phone: `${countryCode.value}${phoneNumber}` });
    setSubscribed(true);
    showToast("success", "Subscribed for live notifications!");
    setShowSubscribeOverlay(false);
  }, [email, phoneNumber, countryCode, showToast]);

  // ----- Chat -----
  useEffect(() => {
    if (!selectedCourse) return;
    setSession((prev) => ({
      ...prev,
      title: selectedCourse.title,
      instructor: selectedCourse.instructor,
    }));
  }, [selectedCourse]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendChat = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const text = newMessage.trim();
      if (!text) return;
      const msg: ChatMessage = {
        id: Date.now(),
        senderId: currentUser.id,
        senderName: currentUser.name,
        text,
        time: nowFormatted(),
        isInstructor: currentUser.role === "instructor" || currentUser.role === "co-instructor",
      };
      setChatMessages((prev) => [...prev, msg]);
      setNewMessage("");
    },
    [newMessage, currentUser]
  );

  // ----- Toggle media -----
  const toggleMute = useCallback(() => setIsMuted((v) => !v), []);
  const toggleVideo = useCallback(() => setIsVideoOff((v) => !v), []);
  const toggleHand = useCallback(() => setIsHandRaised((v) => !v), []);

  // ----- Countdown -----
  const [countdown, setCountdown] = useState<number>(
    session.startTime ? Math.max(Math.floor((new Date(session.startTime).getTime() - Date.now()) / 1000), 0) : 0
  );

  useEffect(() => {
    if (countdown <= 0) {
      setShowSubscribeOverlay(false);
      setSession((s) => ({ ...s, status: "live" }));
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
                  <div className="text-sm text-gray-300">Recording: {isRecording ? "ON" : "OFF"}</div>
                  <button
                    onClick={() => setIsRecording((v) => !v)}
                    className="px-3 py-2 rounded bg-gray-800"
                  >
                    Toggle Recording
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
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none"
                />
                <button type="submit" className="px-3 py-2 rounded bg-teal-600">
                  Send
                </button>
              </form>
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
