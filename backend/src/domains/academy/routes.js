export const registerAcademyRoutes = (app, { Course, Enrollment, Action, Certificate, Recording, Quiz, QuizResult, ForumThread, ForumReply, StudyGroup, MentorshipPairing, User, authenticate, serializeEnrollment }) => {
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

  // ===== TIER 3: QUIZZES =====
  app.get("/api/academy/courses/:courseId/quizzes", authenticate, async (req, res) => {
    const courseId = Number(req.params.courseId);
    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    const quizzes = await Quiz.find({ courseId }).sort({ createdAt: -1 }).lean();
    return res.json({ quizzes });
  });

  app.get("/api/academy/quizzes/:quizId", authenticate, async (req, res) => {
    const quiz = await Quiz.findById(req.params.quizId).lean();
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.json({ quiz });
  });

  app.post("/api/academy/quizzes/:quizId/submit", authenticate, async (req, res) => {
    const { answers, timeSpent } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers must be an array" });
    }

    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;
    answers.forEach((answer) => {
      const question = quiz.questions.find((q) => q._id.toString() === answer.questionId);
      if (question && question.correctAnswer === answer.selectedAnswer) {
        score += 1;
      }
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);
    const passed = percentage >= (quiz.passingScore || 70);

    const result = await QuizResult.create({
      quizId: quiz._id,
      userId: req.user._id,
      score,
      totalQuestions: quiz.questions.length,
      percentage,
      passed,
      answers,
      timeSpent: timeSpent || 0,
      submittedAt: new Date(),
    });

    await Action.create({
      kind: "academy.quiz.submit",
      payload: { quizId: quiz._id, courseId: quiz.courseId, score, passed },
      actorEmail: req.user.email,
      actorName: req.user.name,
    });

    return res.status(201).json({
      ok: true,
      result: result.toObject(),
      passed,
    });
  });

  app.get("/api/academy/quizzes/:quizId/results", authenticate, async (req, res) => {
    const results = await QuizResult.find({ quizId: req.params.quizId }).sort({ submittedAt: -1 }).lean();
    return res.json({ results });
  });

  // ===== TIER 3: FORUMS =====
  app.get("/api/academy/courses/:courseId/forums/threads", authenticate, async (req, res) => {
    const courseId = Number(req.params.courseId);
    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    const threads = await ForumThread.find({ courseId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ threads });
  });

  app.post("/api/academy/forums/threads", authenticate, async (req, res) => {
    const { courseId, title, content } = req.body;
    if (!courseId || !title || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const course = await Course.findOne({ id: Number(courseId) });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const thread = await ForumThread.create({
      courseId: Number(courseId),
      userId: req.user._id,
      title,
      content,
      replies: [],
      createdAt: new Date(),
    });

    await Action.create({
      kind: "academy.forum.thread.create",
      payload: { courseId, threadId: thread._id, title },
      actorEmail: req.user.email,
      actorName: req.user.name,
    });

    return res.status(201).json({ thread: thread.toObject() });
  });

  app.get("/api/academy/forums/:threadId/replies", authenticate, async (req, res) => {
    const thread = await ForumThread.findById(req.params.threadId)
      .populate("userId", "name email")
      .populate("replies.userId", "name email")
      .lean();

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    return res.json({ thread });
  });

  app.post("/api/academy/forums/:threadId/replies", authenticate, async (req, res) => {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Reply content required" });
    }

    const thread = await ForumThread.findById(req.params.threadId);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const reply = {
      userId: req.user._id,
      content,
      createdAt: new Date(),
    };

    thread.replies.push(reply);
    await thread.save();

    await Action.create({
      kind: "academy.forum.reply.create",
      payload: { threadId: thread._id, courseId: thread.courseId },
      actorEmail: req.user.email,
      actorName: req.user.name,
    });

    return res.status(201).json({ reply });
  });

  // ===== TIER 3: STUDY GROUPS =====
  app.get("/api/academy/courses/:courseId/study-groups", authenticate, async (req, res) => {
    const courseId = Number(req.params.courseId);
    if (Number.isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    const groups = await StudyGroup.find({ courseId })
      .populate("leaderId", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ groups });
  });

  app.post("/api/academy/study-groups", authenticate, async (req, res) => {
    const { courseId, name, description, topic, maxMembers } = req.body;
    if (!courseId || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const course = await Course.findOne({ id: Number(courseId) });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const group = await StudyGroup.create({
      courseId: Number(courseId),
      leaderId: req.user._id,
      name,
      description: description || "",
      topic: topic || "",
      members: [req.user._id],
      maxMembers: maxMembers || 10,
      createdAt: new Date(),
    });

    await Action.create({
      kind: "academy.study-group.create",
      payload: { courseId, groupId: group._id, groupName: name },
      actorEmail: req.user.email,
      actorName: req.user.name,
    });

    return res.status(201).json({ group: group.toObject() });
  });

  app.post("/api/academy/study-groups/:groupId/join", authenticate, async (req, res) => {
    const group = await StudyGroup.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Study group not found" });
    }

    if (group.members.includes(req.user._id)) {
      return res.json({ ok: true, message: "Already a member" });
    }

    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ message: "Group is full" });
    }

    group.members.push(req.user._id);
    await group.save();

    await Action.create({
      kind: "academy.study-group.join",
      payload: { groupId: group._id, courseId: group.courseId },
      actorEmail: req.user.email,
      actorName: req.user.name,
    });

    return res.json({ ok: true, group: group.toObject() });
  });

  // ===== TIER 3: MENTORSHIP =====
  app.get("/api/academy/mentorship/partners", authenticate, async (req, res) => {
    const { courseId } = req.query;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID required" });
    }

    const enrollments = await Enrollment.find({
      courseId: Number(courseId),
      userId: { $ne: req.user._id },
    })
      .populate("userId", "name email")
      .lean();

    const partners = enrollments.map((e) => ({
      id: e.userId._id,
      name: e.userId.name,
      email: e.userId.email,
      progress: e.progress.progressPercentage,
    }));

    return res.json({ partners });
  });

  // ===== TIER 3: ANALYTICS =====
  app.get("/api/admin/academy/analytics", authenticate, async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const totalCertificates = await Certificate.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });

    const courseAnalytics = await Enrollment.aggregate([
      {
        $group: {
          _id: "$courseId",
          enrollmentCount: { $sum: 1 },
          completionCount: { $sum: { $cond: [{ $eq: ["$progress.progressPercentage", 100] }, 1, 0] } },
          avgProgress: { $avg: "$progress.progressPercentage" },
        },
      },
      { $sort: { enrollmentCount: -1 } },
      { $limit: 10 },
    ]);

    const enrollmentTrend = await Enrollment.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$enrolledAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    const completionRate = totalEnrollments > 0 ? Math.round((totalCertificates / totalEnrollments) * 100) : 0;

    return res.json({
      summary: {
        totalCourses,
        totalEnrollments,
        totalCertificates,
        totalStudents,
        completionRate,
      },
      courseAnalytics,
      enrollmentTrend,
    });
  });
};
