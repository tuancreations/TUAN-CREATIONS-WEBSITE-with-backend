import { ProgressData } from "../../services/api";
import { CheckCircle, BookMarked } from "lucide-react";

type ProgressTrackerProps = {
  progress: ProgressData | null | undefined;
  courseTitle?: string;
};

export default function ProgressTracker({ progress, courseTitle }: ProgressTrackerProps) {
  if (!progress) {
    return (
      <div className="card">
        <p className="text-sm text-[var(--text-soft)]">No progress data available</p>
      </div>
    );
  }

  const progressPercent = progress.progressPercentage || 0;
  const isCompleted = progressPercent === 100;

  return (
    <div className="card space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{courseTitle ? `${courseTitle} - Progress` : "Course Progress"}</h3>
          <span className="text-xs font-bold text-emerald-300">{progressPercent}%</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className={`h-full transition-all duration-300 ${isCompleted ? "bg-emerald-400" : "bg-[var(--accent)]"}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        <div className="rounded-lg bg-gray-900/50 p-3">
          <p className="text-xs text-[var(--text-soft)]">Lessons</p>
          <p className="mt-1 font-bold">
            {progress.lessonsCompleted}/{progress.totalLessons}
          </p>
        </div>

        <div className="rounded-lg bg-gray-900/50 p-3">
          <p className="text-xs text-[var(--text-soft)]">Videos Watched</p>
          <p className="mt-1 font-bold">{progress.videoWatched}</p>
        </div>

        <div className="rounded-lg bg-gray-900/50 p-3">
          <p className="text-xs text-[var(--text-soft)]">Quiz Score</p>
          <p className="mt-1 font-bold">{progress.quizScore}%</p>
        </div>

        <div className="rounded-lg bg-gray-900/50 p-3">
          <p className="text-xs text-[var(--text-soft)]">Status</p>
          <p className="mt-1 flex items-center gap-1 font-bold">
            {isCompleted ? (
              <>
                <CheckCircle size={14} className="text-emerald-400" />
                Completed
              </>
            ) : (
              <>
                <BookMarked size={14} className="text-blue-400" />
                In Progress
              </>
            )}
          </p>
        </div>
      </div>

      {isCompleted && progress.completedAt && (
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/5 p-3">
          <p className="text-xs text-emerald-300">
            Completed on {new Date(progress.completedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
