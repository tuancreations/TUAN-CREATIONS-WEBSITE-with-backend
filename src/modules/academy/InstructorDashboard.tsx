import { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";
import { Course, StudentProgress, SessionRecord, getInstructorCourses, getInstructorStudents, getInstructorSessions } from "../../services/api";
import { Link } from "react-router-dom";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"courses" | "students" | "sessions">("courses");

  useEffect(() => {
    if (user?.role !== "instructor" && user?.role !== "admin") {
      return;
    }

    let isMounted = true;

    const loadData = async () => {
      try {
        const [coursesData, studentsData, sessionsData] = await Promise.all([
          getInstructorCourses(),
          getInstructorStudents(),
          getInstructorSessions(),
        ]);

        if (isMounted) {
          setCourses(coursesData || []);
          setStudents(studentsData || []);
          setSessions(sessionsData || []);
        }
      } catch (error) {
        console.error("Failed to load instructor data:", error);
        if (isMounted) {
          setCourses([]);
          setStudents([]);
          setSessions([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (user?.role !== "instructor" && user?.role !== "admin") {
    return (
      <div className="card">
        <p className="text-sm text-[var(--text-soft)]">
          Instructor access required to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="font-display text-2xl">Instructor Dashboard</h2>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Manage your courses, track student progress, and view session history
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-[var(--bg-tertiary)]">
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-3 font-medium text-sm transition-colors ${
            activeTab === "courses"
              ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
              : "text-[var(--text-soft)] hover:text-[var(--text-primary)]"
          }`}
        >
          My Courses ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-3 font-medium text-sm transition-colors ${
            activeTab === "students"
              ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
              : "text-[var(--text-soft)] hover:text-[var(--text-primary)]"
          }`}
        >
          My Students ({students.length})
        </button>
        <button
          onClick={() => setActiveTab("sessions")}
          className={`px-4 py-3 font-medium text-sm transition-colors ${
            activeTab === "sessions"
              ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
              : "text-[var(--text-soft)] hover:text-[var(--text-primary)]"
          }`}
        >
          Sessions ({sessions.length})
        </button>
      </div>

      {isLoading ? (
        <div className="card text-center">
          <p className="text-sm text-[var(--text-soft)]">Loading data...</p>
        </div>
      ) : (
        <>
          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-[var(--text-soft)]">
                  You are teaching {courses.length} course{courses.length !== 1 ? "s" : ""}
                </p>
                <Link to="/academy/create-course" className="btn-primary text-sm">
                  Create Course +
                </Link>
              </div>

              {courses.length === 0 ? (
                <div className="card text-center">
                  <p className="text-sm text-[var(--text-soft)]">
                    You are not teaching any courses yet. Create your first course!
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {courses.map((course) => (
                    <div key={course.id} className="card card-hover">
                      <p className="text-xs text-[var(--text-soft)]">{course.level}</p>
                      <h3 className="mt-2 font-display text-lg">{course.title}</h3>
                      <p className="mt-2 text-sm text-[var(--text-soft)]">
                        Duration: {course.duration}
                      </p>
                      <p className="mt-1 text-sm text-[var(--text-soft)]">
                        Enrolled: {course.enrolled}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Link
                          to={`/course/${course.id}`}
                          className="btn-primary text-xs flex-1"
                        >
                          View Course
                        </Link>
                        <Link
                          to={`/academy/edit-course/${course.id}`}
                          className="btn-ghost text-xs flex-1"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-soft)]">
                Total students: {students.length}
              </p>

              {students.length === 0 ? (
                <div className="card text-center">
                  <p className="text-sm text-[var(--text-soft)]">
                    No students enrolled yet
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--bg-tertiary)]">
                        <th className="text-left py-3 px-4 font-semibold">
                          Student Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Course
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Progress
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Enrolled Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b border-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)]">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{student.studentName}</p>
                              <p className="text-xs text-[var(--text-soft)]">
                                {student.studentEmail}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">{student.courseTitle}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-[var(--bg-tertiary)] rounded-full h-2">
                                <div
                                  className="bg-emerald-500 h-2 rounded-full"
                                  style={{
                                    width: `${student.progress?.progressPercentage || 0}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs">
                                {student.progress?.progressPercentage || 0}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-xs text-[var(--text-soft)]">
                            {new Date(student.enrolledAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === "sessions" && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-soft)]">
                Total sessions: {sessions.length}
              </p>

              {sessions.length === 0 ? (
                <div className="card text-center">
                  <p className="text-sm text-[var(--text-soft)]">
                    No session history yet
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {sessions.map((session) => (
                    <div key={session._id} className="card">
                      <h3 className="font-semibold">{session.title}</h3>
                      <p className="mt-2 text-sm text-[var(--text-soft)]">
                        Topic: {session.topic}
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-[var(--text-soft)] mb-1">
                            Started
                          </p>
                          <p className="font-medium">
                            {new Date(session.startedAt).toLocaleDateString()}{" "}
                            {new Date(session.startedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--text-soft)] mb-1">
                            Attendees
                          </p>
                          <p className="font-medium">{session.totalAttendees} students</p>
                        </div>
                      </div>
                      {session.recordingUrl && (
                        <div className="mt-3">
                          <a
                            href={session.recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-ghost text-xs"
                          >
                            View Recording →
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
