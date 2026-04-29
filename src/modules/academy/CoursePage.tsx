import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Target, AlertCircle, ClipboardList, Users } from "lucide-react";
import { getCourseFull, type Course } from "../../services/api";

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCourse = async () => {
      try {
        if (!courseId) {
          setError("Course not found");
          return;
        }

        const courseNum = Number(courseId);
        const courseData = await getCourseFull(courseNum);

        if (!isMounted) return;

        if (courseData) {
          setCourse(courseData);
          setError(null);
        } else {
          setError("Course not found");
        }
      } catch {
        if (!isMounted) return;
        setError("Failed to load course details");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCourse();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="card">Loading course details...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-[var(--text-soft)] hover:text-[var(--text)]">
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="card">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-red-400" />
            <p className="text-sm">{error || "Course not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-[var(--text-soft)] hover:text-[var(--text)]">
        <ArrowLeft size={16} />
        Back to Academy
      </button>

      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-[var(--text-soft)] uppercase">{course.level}</div>
            <h1 className="mt-2 font-display text-3xl">{course.title}</h1>
            <p className="mt-2 text-sm text-[var(--text-soft)]">Instructor: {course.instructor}</p>
            <p className="mt-1 text-sm text-[var(--text-soft)]">Duration: {course.duration}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-soft)]">Enrolled</p>
            <p className="mt-1 font-bold text-lg">{course.enrolled.toLocaleString()}</p>
          </div>
        </div>

        {course.content?.thumbnail && (
          <img src={course.content.thumbnail} alt={course.title} className="mt-4 w-full rounded-lg h-64 object-cover" />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {course.content?.description && (
          <div className="card">
            <h2 className="font-display text-lg">Overview</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">{course.content.description}</p>
          </div>
        )}

        {course.content?.prerequisites && course.content.prerequisites.length > 0 && (
          <div className="card">
            <h2 className="font-display text-lg">Prerequisites</h2>
            <ul className="mt-3 space-y-2">
              {course.content.prerequisites.map((prereq, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text-soft)]">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                  {prereq}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {course.content?.learningObjectives && course.content.learningObjectives.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2">
            <Target size={20} />
            <h2 className="font-display text-lg">Learning Objectives</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {course.content.learningObjectives.map((objective, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-[var(--text-soft)]">
                <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-emerald-300" />
                {objective}
              </li>
            ))}
          </ul>
        </div>
      )}

      {course.content?.syllabus && (
        <div className="card">
          <div className="flex items-center gap-2">
            <BookOpen size={20} />
            <h2 className="font-display text-lg">Course Syllabus</h2>
          </div>
          <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[var(--text-soft)]">{course.content.syllabus}</div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <button onClick={() => navigate(`/course/${course.id}/quizzes`)} className="btn-ghost flex items-center justify-center gap-2">
          <ClipboardList size={16} /> Quizzes
        </button>
        <button onClick={() => navigate(`/course/${course.id}/study-groups`)} className="btn-ghost flex items-center justify-center gap-2">
          <Users size={16} /> Study Groups
        </button>
      </div>

      <button onClick={() => navigate(-1)} className="btn-primary">
        Go to Academy
      </button>
    </div>
  );
}
