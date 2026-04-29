export const registerCatalogRoutes = (app, { Metric, Course, Listing, LiveSession }) => {
  app.get("/api/dashboard/metrics", async (_req, res) => {
    const metrics = await Metric.find().sort({ order: 1 }).lean();
    return res.json({ metrics });
  });

  app.get("/api/courses", async (_req, res) => {
    const items = await Course.find().sort({ id: 1 }).lean();
    return res.json({ courses: items });
  });

  app.get("/api/courses/:id", async (req, res) => {
    const courseId = Number(req.params.id);
    const course = await Course.findOne({ id: courseId }).lean();

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json({ course });
  });

  app.get("/api/listings", async (_req, res) => {
    const items = await Listing.find().sort({ id: 1 }).lean();
    return res.json({ listings: items });
  });

  app.get("/api/live-sessions/:courseId", async (req, res) => {
    const courseId = Number(req.params.courseId);
    const session = await LiveSession.findOne({ courseId }).lean();

    if (session) {
      return res.json({ session });
    }

    const course = await Course.findOne({ id: courseId }).lean();
    if (!course) {
      return res.status(404).json({ message: "Live session not found" });
    }

    return res.json({
      session: {
        courseId: course.id,
        title: course.title,
        instructor: course.instructor,
        topic: "Live learning session",
        startTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        durationMinutes: 90,
        status: "scheduled",
        recordingUrl: null,
        resources: [],
        previousSessions: [],
        participants: [],
        chatMessages: [],
      },
    });
  });
};
