import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { enrollInCourse, getCourses, getMyEnrollments, joinLiveSession, type Course } from "../../services/api";
import { useAuth } from "../../store/auth";

export default function AcademyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getCourses(), user ? getMyEnrollments() : Promise.resolve([])])
      .then(([items, enrollments]) => {
        if (!isMounted) return;
        setCourses(items);
        setEnrolledCourseIds(enrollments.map((entry) => entry.courseId));
      })
      .catch(() => {
        if (!isMounted) return;
        setCourses([]);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleEnroll = async (courseId: number) => {
    if (!user) {
      setMessage("Please sign in to enroll in a course.");
      return;
    }

    setActiveCourseId(courseId);
    try {
      const response = await enrollInCourse(courseId);
      if (!response.alreadyEnrolled) {
        setCourses((prev) => prev.map((item) => (item.id === courseId ? { ...item, enrolled: response.course.enrolled } : item)));
      }
      setEnrolledCourseIds((prev) => (prev.includes(courseId) ? prev : [...prev, courseId]));
      setMessage(response.alreadyEnrolled ? "You are already enrolled in this course." : "Enrollment saved. You can now join live sessions.");
    } catch {
      setMessage("Enrollment could not be saved right now. Please try again.");
    } finally {
      setActiveCourseId(null);
    }
  };

  const handleJoinLive = async (courseId: number) => {
    if (!user) {
      setMessage("Please sign in to join live sessions.");
      return;
    }

    if (!enrolledCourseIds.includes(courseId)) {
      setMessage("Please enroll in this course before joining the live session.");
      return;
    }

    setActiveCourseId(courseId);
    try {
      await joinLiveSession(courseId);
      navigate(`/live-session?courseId=${courseId}`);
    } catch {
      setMessage("Live session join failed. Please try again.");
    } finally {
      setActiveCourseId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="font-display text-2xl">TUAN Academy</h2>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Choose trusted courses, join live sessions, and learn at your own pace with replay access.
        </p>
        <p className="mt-3 text-sm text-[var(--text-soft)]">
          Whether a class is hosted by TUAN or a partner, every session is recorded so students can revisit key lessons.
        </p>
        {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <article key={course.id} className="card card-hover">
            <p className="text-xs text-[var(--text-soft)]">{course.level}</p>
            <h3 className="mt-2 font-display text-xl">{course.title}</h3>
            <p className="mt-2 text-sm text-[var(--text-soft)]">Instructor: {course.instructor}</p>
            <p className="mt-1 text-sm text-[var(--text-soft)]">Duration: {course.duration}</p>
            <p className="mt-1 text-sm text-[var(--text-soft)]">Enrolled: {course.enrolled.toLocaleString()}</p>
            <p className="mt-1 text-sm text-[var(--text-soft)]">Recording: Saved on host broadcaster page</p>
            <div className="mt-4 flex gap-2">
              <button
                className="btn-primary text-xs disabled:opacity-60"
                onClick={() => handleEnroll(course.id)}
                disabled={activeCourseId === course.id || enrolledCourseIds.includes(course.id)}
              >
                {enrolledCourseIds.includes(course.id) ? "Enrolled" : activeCourseId === course.id ? "Processing..." : "Enroll"}
              </button>
              <button
                className="btn-ghost text-xs disabled:opacity-60"
                onClick={() => handleJoinLive(course.id)}
                disabled={activeCourseId === course.id || !enrolledCourseIds.includes(course.id)}
              >
                Join Live
              </button>
            </div>
            {!user && <p className="mt-2 text-xs text-[var(--text-soft)]">Sign in to enroll and join live sessions.</p>}
            {user && !enrolledCourseIds.includes(course.id) && <p className="mt-2 text-xs text-[var(--text-soft)]">Enroll first to unlock live session access.</p>}
            {user && enrolledCourseIds.includes(course.id) && (
              <p className="mt-2 text-xs text-emerald-300">
                Enrollment active. <Link className="underline" to={`/live-session?courseId=${course.id}`}>Open room</Link>
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
