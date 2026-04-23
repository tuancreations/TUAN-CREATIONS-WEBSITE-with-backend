import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "./config.js";
import { Action, Channel, Course, Enrollment, InnovationProgram, Listing, LiveSession, Metric, Project, User } from "./models.js";
import { seedDatabase } from "./seed.js";

const app = express();

app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

const serializeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

const signToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: "7d" }
  );

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing authorization token" });
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: "User session not found" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  return next();
};

const serializeEnrollment = (enrollment, user, course) => ({
  id: enrollment._id.toString(),
  userId: String(enrollment.userId),
  userName: user?.name ?? null,
  userEmail: user?.email ?? null,
  courseId: enrollment.courseId,
  courseTitle: course?.title ?? null,
  enrolledAt: enrollment.enrolledAt,
  liveJoinCount: enrollment.liveJoinCount,
  lastJoinedLiveAt: enrollment.lastJoinedLiveAt,
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "tuan-creations-backend" });
});

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "TUAN backend is running",
    health: "/api/health",
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { name, email, role, password } = req.body ?? {};

  if (!email || !role) {
    return res.status(400).json({ message: "email and role are required" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const trimmedName = String(name || "").trim();

  if (role === "admin") {
    if (!password) {
      return res.status(400).json({ message: "Admin password is required" });
    }

    const adminUser = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
    if (!adminUser || adminUser.role !== "admin" || !adminUser.passwordHash) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const isValidPassword = await bcrypt.compare(String(password), adminUser.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    if (trimmedName) {
      adminUser.name = trimmedName;
      await adminUser.save();
    }

    const token = signToken(adminUser);
    return res.json({ user: serializeUser(adminUser), token });
  }

  if (!trimmedName) {
    return res.status(400).json({ message: "name is required" });
  }

  let user = await User.findOne({ email: normalizedEmail });

  if (user?.role === "admin") {
    return res.status(403).json({ message: "This email is reserved for admin access" });
  }

  if (!user) {
    user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      role,
    });
  } else {
    if (user.role !== role) {
      return res.status(409).json({ message: `This account is registered as ${user.role}. Use that role to sign in.` });
    }

    user.name = trimmedName;
    await user.save();
  }

  const token = signToken(user);
  return res.json({ user: serializeUser(user), token });
});

app.get("/api/auth/me", authenticate, (req, res) => {
  return res.json({ user: serializeUser(req.user) });
});

app.post("/api/auth/logout", authenticate, (_req, res) => {
  return res.json({ ok: true });
});

app.get("/api/dashboard/metrics", async (_req, res) => {
  const metrics = await Metric.find().sort({ order: 1 }).lean();
  return res.json({ metrics });
});

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

app.get("/api/media/channels", async (_req, res) => {
  const channels = await Channel.find().sort({ id: 1 }).lean();
  return res.json({ channels });
});

app.post("/api/media/channels/:channelId/follow", authenticate, async (req, res) => {
  const channelId = Number(req.params.channelId);
  if (Number.isNaN(channelId)) {
    return res.status(400).json({ message: "Invalid channel id" });
  }

  const channel = await Channel.findOne({ id: channelId });
  if (!channel) {
    return res.status(404).json({ message: "Channel not found" });
  }

  channel.followers += 1;
  await channel.save();

  await Action.create({
    kind: "media.channel.follow",
    payload: { channelId, channelName: channel.name },
    actorEmail: req.user.email,
    actorName: req.user.name,
  });

  return res.json({ ok: true, channel: channel.toObject() });
});

app.get("/api/collaboration/projects", async (_req, res) => {
  const projects = await Project.find().sort({ id: 1 }).lean();
  return res.json({ projects });
});

app.post("/api/collaboration/projects", authenticate, async (req, res) => {
  const { name, team = 1, status = "Planning", owner = req.user.role ?? "Community Team", channel = "Shared Workspace" } = req.body ?? {};

  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }

  const nextProject = await Project.create({
    id: (await Project.countDocuments()) + 1,
    name: String(name),
    team: Number(team) || 1,
    status: String(status),
    owner: String(owner),
    tasks: 0,
    channel: String(channel),
  });

  await Action.create({
    kind: "collaboration.project.create",
    payload: { projectId: nextProject.id, projectName: nextProject.name },
    actorEmail: req.user.email,
    actorName: req.user.name,
  });

  return res.status(201).json({ project: nextProject.toObject() });
});

app.post("/api/collaboration/projects/:projectId/action", authenticate, async (req, res) => {
  const projectId = Number(req.params.projectId);
  const { kind } = req.body ?? {};

  if (Number.isNaN(projectId)) {
    return res.status(400).json({ message: "Invalid project id" });
  }

  const project = await Project.findOne({ id: projectId });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (kind === "collaboration.chat") {
    project.tasks += 1;
  }

  if (kind === "collaboration.tasks") {
    project.tasks += 2;
  }

  await project.save();

  await Action.create({
    kind: String(kind || "collaboration.action"),
    payload: { projectId, projectName: project.name },
    actorEmail: req.user.email,
    actorName: req.user.name,
  });

  return res.json({ ok: true, project: project.toObject() });
});

app.get("/api/iot/programs", async (_req, res) => {
  const programs = await InnovationProgram.find().sort({ id: 1 }).lean();
  return res.json({ programs });
});

app.post("/api/iot/programs/:programId/enroll", authenticate, async (req, res) => {
  const programId = Number(req.params.programId);
  if (Number.isNaN(programId)) {
    return res.status(400).json({ message: "Invalid program id" });
  }

  const program = await InnovationProgram.findOne({ id: programId });
  if (!program) {
    return res.status(404).json({ message: "Program not found" });
  }

  if (program.enrolled >= program.seats) {
    return res.status(409).json({ message: "No seats left in this program" });
  }

  program.enrolled += 1;
  await program.save();

  await Action.create({
    kind: "iot.program.enroll",
    payload: { programId, programTitle: program.title },
    actorEmail: req.user.email,
    actorName: req.user.name,
  });

  return res.json({ ok: true, program: program.toObject() });
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

app.post("/api/actions", async (req, res) => {
  const { kind, payload } = req.body ?? {};

  if (!kind) {
    return res.status(400).json({ message: "kind is required" });
  }

  const actor = req.headers.authorization?.startsWith("Bearer ")
    ? await (async () => {
        try {
          const token = req.headers.authorization.slice(7);
          const decoded = jwt.verify(token, config.jwtSecret);
          return decoded?.sub ? await User.findById(decoded.sub).lean() : null;
        } catch {
          return null;
        }
      })()
    : null;

  const action = await Action.create({
    kind: String(kind),
    payload: payload ?? {},
    actorEmail: actor?.email ?? null,
    actorName: actor?.name ?? null,
  });

  return res.status(201).json({ action });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

async function start() {
  if (!config.adminEmail || !config.adminPassword) {
    console.warn("Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env");
  }

  await mongoose.connect(config.mongoUri);
  await seedDatabase();

  app.listen(config.port, () => {
    console.log(`TUAN backend running on http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start TUAN backend", error);
  process.exit(1);
});