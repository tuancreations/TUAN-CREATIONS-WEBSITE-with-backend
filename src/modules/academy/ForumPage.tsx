import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { ForumThread, ForumReply, getForumThreads, createForumThread, getForumThread, addForumReply } from "../../services/api";

export default function ForumPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [newThreadData, setNewThreadData] = useState({ title: "", content: "" });
  const [newReplyData, setNewReplyData] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const courseIdNum = courseId ? parseInt(courseId) : 0;

  // Load forum threads
  useEffect(() => {
    let isMounted = true;

    const loadThreads = async () => {
      if (!courseIdNum) return;
      try {
        const data = await getForumThreads(courseIdNum);
        if (isMounted) {
          setThreads(data || []);
        }
      } catch {
        if (isMounted) {
          setThreads([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadThreads();

    return () => {
      isMounted = false;
    };
  }, [courseIdNum]);

  // Load selected thread details
  useEffect(() => {
    if (!selectedThread?._id) return;

    let isMounted = true;

    const loadThread = async () => {
      try {
        const { thread, replies: threadReplies } = await getForumThread(selectedThread._id!);
        if (isMounted && thread) {
          setSelectedThread(thread);
          setReplies(threadReplies || []);
        }
      } catch {
        if (isMounted) {
          setReplies([]);
        }
      }
    };

    loadThread();

    return () => {
      isMounted = false;
    };
  }, [selectedThread?._id]);

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadData.title || !newThreadData.content) return;

    setIsSaving(true);
    try {
      const result = await createForumThread(courseIdNum, newThreadData);
      if (result.ok && result.thread) {
        setThreads([result.thread, ...threads]);
        setNewThreadData({ title: "", content: "" });
        setShowNewThreadForm(false);
      }
    } catch (error) {
      console.error("Failed to create thread:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyData || !selectedThread?._id) return;

    setIsSaving(true);
    try {
      const result = await addForumReply(selectedThread._id, { content: newReplyData });
      if (result.ok && result.reply) {
        setReplies([...replies, result.reply]);
        setNewReplyData("");
      }
    } catch (error) {
      console.error("Failed to add reply:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="card text-center">
        <p className="text-sm text-[var(--text-soft)]">Loading forum...</p>
      </div>
    );
  }

  if (selectedThread) {
    return (
      <div className="space-y-6 max-w-3xl">
        <button
          onClick={() => {
            setSelectedThread(null);
            setReplies([]);
          }}
          className="btn-ghost text-sm"
        >
          ← Back to Forum
        </button>

        <div className="card">
          {selectedThread.isPinned && (
            <p className="text-xs text-amber-600 mb-2">📌 Pinned Discussion</p>
          )}
          <h2 className="font-display text-2xl">{selectedThread.title}</h2>
          <p className="mt-3 text-sm text-[var(--text-soft)]">
            By <span className="font-medium">{selectedThread.authorName}</span> •{" "}
            {new Date(selectedThread.createdAt || "").toLocaleDateString()}
          </p>
          <p className="mt-4 whitespace-pre-wrap text-sm">
            {selectedThread.content}
          </p>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">
            Replies ({replies.length})
          </h3>

          <div className="space-y-4">
            {replies.map((reply) => (
              <div key={reply._id} className="pb-4 border-b border-[var(--bg-tertiary)] last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{reply.authorName}</p>
                    <p className="text-xs text-[var(--text-soft)]">
                      {new Date(reply.createdAt || "").toLocaleDateString()}{" "}
                      {new Date(reply.createdAt || "").toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm whitespace-pre-wrap text-[var(--text-soft)]">
                  {reply.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {user && (
          <form onSubmit={handleAddReply} className="card space-y-3">
            <h3 className="font-semibold text-sm">Add Reply</h3>
            <textarea
              value={newReplyData}
              onChange={(e) => setNewReplyData(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              className="w-full px-4 py-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none"
            />
            <button
              type="submit"
              disabled={!newReplyData || isSaving}
              className="btn-primary text-sm disabled:opacity-60"
            >
              {isSaving ? "Posting..." : "Post Reply"}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl">Course Forum</h2>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Join discussions, ask questions, and share knowledge
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowNewThreadForm(!showNewThreadForm)}
              className="btn-primary text-sm"
            >
              New Discussion +
            </button>
          )}
        </div>

        {showNewThreadForm && (
          <form onSubmit={handleCreateThread} className="mt-4 space-y-3 p-4 bg-[var(--bg-secondary)] rounded">
            <input
              type="text"
              value={newThreadData.title}
              onChange={(e) =>
                setNewThreadData({ ...newThreadData, title: e.target.value })
              }
              placeholder="Discussion title..."
              className="w-full px-4 py-2 rounded bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder:text-[var(--text-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            />
            <textarea
              value={newThreadData.content}
              onChange={(e) =>
                setNewThreadData({ ...newThreadData, content: e.target.value })
              }
              placeholder="What's on your mind?"
              rows={4}
              className="w-full px-4 py-2 rounded bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder:text-[var(--text-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!newThreadData.title || !newThreadData.content || isSaving}
                className="btn-primary text-xs disabled:opacity-60"
              >
                {isSaving ? "Creating..." : "Create Discussion"}
              </button>
              <button
                type="button"
                onClick={() => setShowNewThreadForm(false)}
                className="btn-ghost text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {threads.length === 0 ? (
        <div className="card text-center">
          <p className="text-sm text-[var(--text-soft)]">
            No discussions yet. Be the first to start one!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <div
              key={thread._id}
              onClick={() => setSelectedThread(thread)}
              className="card card-hover cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {thread.isPinned && (
                    <p className="text-xs text-amber-600 mb-1">📌 Pinned</p>
                  )}
                  <h3 className="font-semibold">{thread.title}</h3>
                  <p className="mt-2 text-sm text-[var(--text-soft)] line-clamp-2">
                    {thread.content}
                  </p>
                  <div className="mt-3 flex gap-4 text-xs text-[var(--text-soft)]">
                    <span>By {thread.authorName}</span>
                    <span>{thread.replies} replies</span>
                    <span>{thread.views} views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
