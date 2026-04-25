export const registerAcademyRoutes = (app, { Course, Enrollment, Action, authenticate, serializeEnrollment }) => {
  app.post("/api/academy/enroll/:courseId", authenticate, async (req, res) => {
    const courseId = Number(req.params.courseId);
    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    const course = await Course.findOne({ id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existing = await Enrollment.findOne({ userId: req.user._id, courseId });
    if (existing) {
      return res.json({
        enrollment: serializeEnrollment(existing.toObject(), req.user, course.toObject()),
        course,
        alreadyEnrolled: true,
      });
    }

    const enrollment = await Enrollment.create({
      userId: req.user._id,
      courseId,
      enrolledAt: new Date(),
    });

    course.enrolled += 1;
    await course.save();

    await Action.create({
      kind: "academy.enroll",
      payload: { courseId, courseTitle: course.title },
      actorEmail: req.user.email,
      actorName: req.user.name,
    });

    return res.status(201).json({
      enrollment: serializeEnrollment(enrollment.toObject(), req.user, course.toObject()),
      course,
      alreadyEnrolled: false,
    });
  });

  app.post("/api/academy/live/:courseId/join", authenticate, async (req, res) => {
    const courseId = Number(req.params.courseId);
    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    const course = await Course.findOne({ id: courseId }).lean();
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId });
    if (!enrollment) {
      return res.status(403).json({ message: "Please enroll in the course before joining live session" });
    }

    enrollment.liveJoinCount += 1;
    enrollment.lastJoinedLiveAt = new Date();
    await enrollment.save();

    await Action.create({
      kind: "academy.live.join",
      payload: { courseId, courseTitle: course.title, liveJoinCount: enrollment.liveJoinCount },
      actorEmail: req.user.email,
      actorName: req.user.name,
    });

    return res.json({
      ok: true,
      enrollment: serializeEnrollment(enrollment.toObject(), req.user, course),
    });
  });

  app.get("/api/academy/enrollments/me", authenticate, async (req, res) => {
    const enrollments = await Enrollment.find({ userId: req.user._id }).sort({ enrolledAt: -1 }).lean();
    const courseIds = [...new Set(enrollments.map((item) => item.courseId))];
    const courses = await Course.find({ id: { $in: courseIds } }).lean();
    const courseMap = new Map(courses.map((item) => [item.id, item]));

    return res.json({
      enrollments: enrollments.map((item) => serializeEnrollment(item, req.user, courseMap.get(item.courseId))),
    });
  });
};
