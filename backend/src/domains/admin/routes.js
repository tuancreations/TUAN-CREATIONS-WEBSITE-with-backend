export const registerAdminRoutes = (
  app,
  { User, Action, Metric, Course, Listing, LiveSession, Enrollment, authenticate, requireAdmin, serializeUser, serializeEnrollment }
) => {
  app.get("/api/admin/overview", authenticate, requireAdmin, async (_req, res) => {
    const [users, actions, metrics, courses, listings, liveSessions, enrollments, enrollmentJoinTotals] = await Promise.all([
      User.find().sort({ createdAt: -1 }).lean(),
      Action.find().sort({ createdAt: -1 }).limit(10).lean(),
      Metric.countDocuments(),
      Course.countDocuments(),
      Listing.countDocuments(),
      LiveSession.countDocuments(),
      Enrollment.countDocuments(),
      Enrollment.aggregate([{ $group: { _id: null, total: { $sum: "$liveJoinCount" } } }]),
    ]);

    const roleCounts = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return res.json({
      stats: {
        users: users.length,
        actions: await Action.countDocuments(),
        metrics,
        courses,
        listings,
        liveSessions,
        enrollments,
        liveJoins: enrollmentJoinTotals[0]?.total ?? 0,
      },
      roleCounts,
      recentUsers: users.slice(0, 8).map(serializeUser),
      recentActions: actions.map((action) => ({
        id: action._id.toString(),
        kind: action.kind,
        actorName: action.actorName,
        actorEmail: action.actorEmail,
        createdAt: action.createdAt,
      })),
    });
  });

  app.get("/api/admin/academy/enrollments", authenticate, requireAdmin, async (_req, res) => {
    const enrollments = await Enrollment.find().sort({ enrolledAt: -1 }).limit(200).lean();
    const userIds = [...new Set(enrollments.map((item) => String(item.userId)))];
    const courseIds = [...new Set(enrollments.map((item) => item.courseId))];

    const [users, courses] = await Promise.all([
      User.find({ _id: { $in: userIds } }).lean(),
      Course.find({ id: { $in: courseIds } }).lean(),
    ]);

    const userMap = new Map(users.map((item) => [item._id.toString(), item]));
    const courseMap = new Map(courses.map((item) => [item.id, item]));

    return res.json({
      enrollments: enrollments.map((item) => serializeEnrollment(item, userMap.get(String(item.userId)), courseMap.get(item.courseId))),
    });
  });

  app.get("/api/admin/users", authenticate, requireAdmin, async (_req, res) => {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    return res.json({ users: users.map(serializeUser) });
  });

  app.get("/api/admin/actions", authenticate, requireAdmin, async (_req, res) => {
    const actions = await Action.find().sort({ createdAt: -1 }).limit(50).lean();
    return res.json({
      actions: actions.map((action) => ({
        id: action._id.toString(),
        kind: action.kind,
        payload: action.payload,
        actorName: action.actorName,
        actorEmail: action.actorEmail,
        createdAt: action.createdAt,
      })),
    });
  });
};
