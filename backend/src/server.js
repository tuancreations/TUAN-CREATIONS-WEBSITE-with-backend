import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { config } from "./config.js";
import { Action, Channel, Course, Enrollment, InnovationProgram, Listing, LiveSession, Metric, Project, User } from "./models.js";
import { seedDatabase } from "./seed.js";
import { createAuth } from "./shared/auth.js";
import { registerPlatformRoutes } from "./domains/platform/routes.js";
import { registerAuthRoutes } from "./domains/auth/routes.js";
import { registerCatalogRoutes } from "./domains/catalog/routes.js";
import { registerMediaRoutes } from "./domains/media/routes.js";
import { registerCollaborationRoutes } from "./domains/collaboration/routes.js";
import { registerIotRoutes } from "./domains/iot/routes.js";
import { registerAcademyRoutes } from "./domains/academy/routes.js";
import { registerAdminRoutes } from "./domains/admin/routes.js";

const app = express();

app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

const { authenticate, requireAdmin, signToken, serializeUser, resolveActorFromRequest } = createAuth({
  User,
  jwtSecret: config.jwtSecret,
});

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

registerPlatformRoutes(app, {
  Action,
  resolveActorFromRequest,
});

registerAuthRoutes(app, {
  User,
  authenticate,
  signToken,
  serializeUser,
});

registerCatalogRoutes(app, {
  Metric,
  Course,
  Listing,
  LiveSession,
  Project,
});

registerMediaRoutes(app, {
  Channel,
  Action,
  authenticate,
});

registerCollaborationRoutes(app, {
  Project,
  Action,
  authenticate,
});

registerIotRoutes(app, {
  InnovationProgram,
  Action,
  authenticate,
});

registerAcademyRoutes(app, {
  Course,
  Enrollment,
  Action,
  authenticate,
  serializeEnrollment,
});

registerAdminRoutes(app, {
  User,
  Action,
  Metric,
  Course,
  Listing,
  LiveSession,
  Enrollment,
  authenticate,
  requireAdmin,
  serializeUser,
  serializeEnrollment,
});

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

async function start() {
  if (!config.adminEmail || !config.adminPassword) {
    console.warn("Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env");
  }

  const localMongoUri = "mongodb://127.0.0.1:27017/tuan_creations";
  try {
    await mongoose.connect(config.mongoUri);
  } catch (primaryError) {
    const canFallbackToLocal = config.mongoUri !== localMongoUri;
    if (!canFallbackToLocal) {
      throw primaryError;
    }

    console.warn("Primary Mongo connection failed. Falling back to local MongoDB at 127.0.0.1:27017.");
    await mongoose.connect(localMongoUri);
  }

  await seedDatabase();

  app.listen(config.port, () => {
    console.log(`TUAN backend running on http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start TUAN backend", error);
  process.exit(1);
});
