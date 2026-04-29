import { Recording } from "../../services/api";
import { Play, Download } from "lucide-react";

type RecordingPlayerProps = {
  recording: Recording;
  onDownload?: (recording: Recording) => void;
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

export default function RecordingPlayer({ recording, onDownload }: RecordingPlayerProps) {
  return (
    <div className="card space-y-4">
      <div className="group relative overflow-hidden rounded-lg bg-black">
        <video
          src={recording.recordingUrl}
          className="w-full"
          controls
          poster={recording.thumbnailUrl || "/placeholder-video.jpg"}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Play size={48} className="text-white/80" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">{recording.sessionTopic}</h3>
        <p className="text-sm text-[var(--text-soft)]">
          {recording.courseTitle} • {recording.instructor}
        </p>
        <p className="text-xs text-[var(--text-soft)]">
          {new Date(recording.recordedAt).toLocaleDateString()} • {formatDuration(recording.duration)}
        </p>
      </div>

      {onDownload && (
        <button
          onClick={() => onDownload(recording)}
          className="btn-ghost flex items-center justify-center gap-2 text-sm"
        >
          <Download size={16} />
          Download
        </button>
      )}
    </div>
  );
}
