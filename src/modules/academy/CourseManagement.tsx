import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { Course, getCourseFull, createCourse, updateCourse } from "../../services/api";

export default function CourseManagement() {
  const { user } = useAuth();
  const { courseId } = useParams<{ courseId?: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(courseId ? true : false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    level: "Intermediate",
    duration: "8 weeks",
    description: "",
    syllabus: "",
    prerequisites: "",
    learningObjectives: "",
  });

  // Load existing course data if editing
  useEffect(() => {
    if (!courseId) return;

    let isMounted = true;

    const loadCourse = async () => {
      try {
        const course = await getCourseFull(parseInt(courseId));
        if (isMounted && course) {
          setFormData({
            title: course.title,
            level: course.level,
            duration: course.duration,
            description: course.content?.description || "",
            syllabus: course.content?.syllabus || "",
            prerequisites: (course.content?.prerequisites || []).join("\n"),
            learningObjectives: (course.content?.learningObjectives || []).join("\n"),
          });
        }
      } catch (err) {
        console.error("Failed to load course:", err);
        setError("Failed to load course data");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadCourse();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const courseData = {
        title: formData.title,
        level: formData.level,
        duration: formData.duration,
        description: formData.description,
        syllabus: formData.syllabus,
        prerequisites: formData.prerequisites.split("\n").filter((p) => p.trim()),
        learningObjectives: formData.learningObjectives.split("\n").filter((o) => o.trim()),
      };

      if (courseId) {
        const result = await updateCourse(parseInt(courseId), courseData);
        if (!result.ok) {
          throw new Error(result.error || "Failed to update course");
        }
      } else {
        const result = await createCourse(courseData);
        if (!result.ok) {
          throw new Error(result.error || "Failed to create course");
        }
      }

      navigate("/instructor-dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return (
      <div className="card">
        <p className="text-sm text-[var(--text-soft)]">
          Instructor access required to manage courses.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="card text-center">
        <p className="text-sm text-[var(--text-soft)]">Loading course...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="card">
        <h2 className="font-display text-2xl">
          {courseId ? "Edit Course" : "Create New Course"}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          {courseId
            ? "Update your course details and content"
            : "Create a new course for students to enroll in"}
        </p>
      </div>

      {error && (
        <div className="card bg-rose-500 bg-opacity-10 border-l-4 border-rose-500">
          <p className="text-sm text-rose-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-lg">Basic Information</h3>

          <div>
            <label className="block text-sm font-medium mb-2">Course Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., AI Product Design for African Markets"
              required
              className="w-full px-4 py-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Level *</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration *</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 8 weeks"
                required
                className="w-full px-4 py-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              />
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-lg">Course Content</h3>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief overview of the course..."
              rows={3}
              className="w-full px-4 py-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Syllabus</label>
            <textarea
              name="syllabus"
              value={formData.syllabus}
              onChange={handleChange}
              placeholder="Week 1: ...&#10;Week 2: ..."
              rows={4}
              className="w-full px-4 py-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Prerequisites (one per line)
            </label>
            <textarea
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleChange}
              placeholder="Basic understanding of...&#10;Familiarity with..."
              rows={3}
              className="w-full px-4 py-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Learning Objectives (one per line)
            </label>
            <textarea
              name="learningObjectives"
              value={formData.learningObjectives}
              onChange={handleChange}
              placeholder="Students will be able to...&#10;Understand..."
              rows={3}
              className="w-full px-4 py-2 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary disabled:opacity-60"
          >
            {isSaving
              ? "Saving..."
              : courseId
              ? "Update Course"
              : "Create Course"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/instructor-dashboard")}
            className="btn-ghost"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
