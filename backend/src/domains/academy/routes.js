export const registerAcademyRoutes = (app, { Course, Enrollment, Action, Certificate, Recording, authenticate, serializeEnrollment }) => {
  app.get("/api/academy/courses/:courseId", authenticate, async (req, res) => {
    const courseId = Number(req.params.courseId);
    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    const course = await Course.findOne({ id: courseId }).lean();
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json({ course });
  });

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
      progress: { totalLessons: 10, lessonsCompleted: 0, videoWatched: 0, quizScore: 0, progressPercentage: 0 },
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

  app.post("/api/academy/enrollments/:enrollmentId/progress", authenticate, async (req, res) => {
    const { lessonsCompleted, videoWatched, quizScore, totalLessons } = req.body;

    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (enrollment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const progressPercentage = totalLessons ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;

    enrollment.progress = {
      lessonsCompleted: lessonsCompleted ?? enrollment.progress.lessonsCompleted,
      videoWatched: videoWatched ?? enrollment.progress.videoWatched,
      quizScore: quizScore ?? enrollment.progress.quizScore,
      totalLessons: totalLessons ?? enrollment.progress.totalLessons,
      progressPercentage,
      completedAt: progressPercentage === 100 ? new Date() : null,
    };

    await enrollment.save();

    await Action.create({
      kind: "academy.progress.update",
      payload: { courseId: enrollment.courseId, progressPercentage },
      actorEmail: req.user.email,
      actorName: req.user.name,
    });

    return res.json({
      ok: true,
      enrollment: enrollment.toObject(),
    });
  });

  app.get("/api/academy/enrollments/me/progress", authenticate, async (req, res) => {
    const enrollments = await Enrollment.find({ userId: req.user._id }).lean();

    return res.json({
      enrollments: enrollments.map((e) => ({
        courseId: e.courseId,
        progress: e.progress,
      })),
    });
  });

  app.get("/api/academy/courses/:courseId/recordings", authenticate, async (req, res) => {
    const courseId = Number(req.params.courseId);
    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    const recordings = await Recording.find({ courseId }).sort({ recordedAt: -1 }).lean();

    return res.json({ recordings });
  });

  app.post("/api/academy/courses/:courseId/complete-course", authenticate, async (req, res) => {
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
      return res.status(403).json({ message: "Please enroll in the course first" });
    }

    if (enrollment.progress.progressPercentage < 100) {
      return res.status(400).json({ message: "Course completion requires 100% progress" });
    }

    const certificateNumber = `CERT-${Date.now()}-${req.user._id.toString().slice(-8).toUpperCase()}`;
    const certificate = await Certificate.create({
      userId: req.user._id,
      courseId,
      courseTitle: course.title,
      instructor: course.instructor,
      issuedAt: new Date(),
      certificateNumber,
      certificateUrl: `/certificates/${certificateNumber}.pdf`,
    });

    enrollment.certificateId = certificate._id;
    await enrollment.save();

    await Action.create({
      kind: "academy.course.complete",
      payload: { courseId, courseTitle: course.title, certificateNumber },
      actorEmail: req.user.email,
      actorName: req.user.name,
    });

    return res.status(201).json({
      ok: true,
      certificate: certificate.toObject(),
      enrollment: enrollment.toObject(),
    });
  });

  app.get("/api/academy/certificates/me", authenticate, async (req, res) => {
    const certificates = await Certificate.find({ userId: req.user._id }).sort({ issuedAt: -1 }).lean();

    return res.json({ certificates });
  });
};
