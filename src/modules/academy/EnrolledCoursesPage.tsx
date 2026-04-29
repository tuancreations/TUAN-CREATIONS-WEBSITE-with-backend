import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Video, Award } from "lucide-react";
import { getMyEnrollments, getMyProgress, getCourseRecordings, type AcademyEnrollment, type Recording } from "../../services/api";
import { useAuth } from "../../store/auth";
import ProgressTracker from "./ProgressTracker";
import RecordingPlayer from "./RecordingPlayer";

type EnrollmentWithData = AcademyEnrollment & {
  recordings?: Recording[];
};

export default function EnrolledCoursesPage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentWithData[]>([]);
  const [recordingsMap, setRecordingsMap] = useState<Record<number, Recording[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"courses" | "progress" | "certificates">("courses");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const enrollmentsData = await getMyEnrollments();

        if (!isMounted) return;

        // Load progress data
        const progressData = await getMyProgress();
        const progressMap = new Map(progressData.map((p) => [p.courseId, p.progress]));

        // Load recordings for each course
        const recordingsData: Record<number, Recording[]> = {};
        for (const enrollment of enrollmentsData) {
          const recordings = await getCourseRecordings(enrollment.courseId);
          recordingsData[enrollment.courseId] = recordings;
        }

        if (!isMounted) return;

        setEnrollments(
          enrollmentsData.map((e) => ({
            ...e,
            progress: progressMap.get(e.courseId) || e.progress,
            recordings: recordingsData[e.courseId] || [],
          }))
        );

        setRecordingsMap(recordingsData);
      } catch {
        if (isMounted) {
          setEnrollments([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="card">
        <p className="text-sm text-[var(--text-soft)]">Please sign in to view your enrolled courses.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="card">Loading your enrollments...</div>
      </div>
    );
  }

  const enrolledCourses = enrollments.filter((e) => e);
  const hasProgress = enrolledCourses.some((e) => e.progress && e.progress.progressPercentage > 0);
  const completedCourses = enrolledCourses.filter((e) => e.progress && e.progress.progressPercentage === 100);

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="font-display text-2xl">My Learning Journey</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Track your progress, access recordings, and earn certificates
        </p>

        <div className="mt-4 flex gap-2 border-b border-gray-800">
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "courses"
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : "text-[var(--text-soft)] hover:text-[var(--text)]"
            }`}
          >
            <BookOpen className="mr-2 inline h-4 w-4" />
            Courses ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "progress"
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : "text-[var(--text-soft)] hover:text-[var(--text)]"
            }`}
          >
            <Video className="mr-2 inline h-4 w-4" />
            Progress
          </button>
          <button
            onClick={() => setActiveTab("certificates")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "certificates"
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : "text-[var(--text-soft)] hover:text-[var(--text)]"
            }`}
          >
            <Award className="mr-2 inline h-4 w-4" />
            Certificates ({completedCourses.length})
          </button>
        </div>
      </div>

      {/* Courses Tab */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          {enrolledCourses.length === 0 ? (
            <div className="card text-center py-12">
              <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
              <h3 className="font-semibold">No enrolled courses yet</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Enroll in courses from the Academy to get started</p>
              <Link to="/academy" className="btn-primary mt-4 inline-block">
                Browse Academy
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {enrolledCourses.map((enrollment) => (
                <div key={enrollment.courseId} className="card space-y-3">
                  <h3 className="font-display text-lg">{enrollment.courseTitle}</h3>
                  <p className="text-xs text-[var(--text-soft)]">{enrollment.courseTitle}</p>

                  {enrollment.progress && (
                    <div className="mt-3">
                      <div className="text-xs font-medium mb-1">{enrollment.progress.progressPercentage}% Complete</div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                        <div
                          className="h-full bg-[var(--accent)]"
                          style={{ width: `${enrollment.progress.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {recordingsMap[enrollment.courseId] && recordingsMap[enrollment.courseId].length > 0 && (
                    <div className="text-xs text-[var(--text-soft)]">
                      📹 {recordingsMap[enrollment.courseId].length} recording{recordingsMap[enrollment.courseId].length === 1 ? "" : "s"}
                    </div>
                  )}

                  <Link
                    to={`/course/${enrollment.courseId}`}
                    className="btn-ghost text-xs inline-block"
                  >
                    View Course →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === "progress" && (
        <div className="space-y-4">
          {!hasProgress ? (
            <div className="card text-center py-12">
              <Video size={48} className="mx-auto mb-4 opacity-20" />
              <h3 className="font-semibold">No progress yet</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Start learning to track your progress</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {enrolledCourses
                .filter((e) => e.progress && e.progress.progressPercentage > 0)
                .map((enrollment) => (
                  <ProgressTracker
                    key={enrollment.courseId}
                    progress={enrollment.progress}
                    courseTitle={enrollment.courseTitle}
                  />
                ))}
            </div>
          )}
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === "certificates" && (
        <div className="space-y-4">
          {completedCourses.length === 0 ? (
            <div className="card text-center py-12">
              <Award size={48} className="mx-auto mb-4 opacity-20" />
              <h3 className="font-semibold">No certificates earned yet</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Complete courses to earn certificates</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {completedCourses.map((enrollment) => (
                <div key={enrollment.courseId} className="card">
                  <div className="rounded-lg border border-yellow-400/30 bg-yellow-400/5 p-4 text-center">
                    <Award size={32} className="mx-auto mb-2 text-yellow-400" />
                    <h3 className="font-display text-lg">{enrollment.courseTitle}</h3>
                    <p className="mt-1 text-xs text-[var(--text-soft)]">Completed on {new Date(enrollment.progress?.completedAt || new Date()).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recordings Section */}
      {enrolledCourses.length > 0 && Object.values(recordingsMap).some((r) => r.length > 0) && (
        <div className="card">
          <h2 className="font-display text-lg mb-4">Course Recordings</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {enrolledCourses.map((enrollment) =>
              recordingsMap[enrollment.courseId]?.map((recording) => (
                <RecordingPlayer key={recording._id} recording={recording} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
