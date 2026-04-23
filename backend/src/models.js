import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    role: { type: String, required: true, enum: ["student", "partner", "client", "investor", "admin"] },
    passwordHash: { type: String, default: null, select: false },
  },
  { timestamps: true }
);

const metricSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    trend: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

const courseSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    level: { type: String, required: true },
    duration: { type: String, required: true },
    enrolled: { type: Number, required: true },
  },
  { timestamps: true }
);

const listingSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    provider: { type: String, required: true },
    verified: { type: Boolean, default: false },
    price: { type: String, required: true },
  },
  { timestamps: true }
);

const channelSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    audience: { type: String, required: true },
    status: { type: String, required: true },
    recordingUrl: { type: String, default: null },
    followers: { type: Number, default: 0 },
    featuredBroadcast: { type: String, required: true },
    recordingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const projectSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    team: { type: Number, required: true },
    status: { type: String, required: true },
    owner: { type: String, required: true },
    tasks: { type: Number, default: 0 },
    channel: { type: String, required: true },
  },
  { timestamps: true }
);

const innovationProgramSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    mode: { type: String, required: true },
    seats: { type: Number, required: true },
    enrolled: { type: Number, default: 0 },
    summary: { type: String, required: true },
  },
  { timestamps: true }
);

const participantSchema = new Schema(
  {
    id: String,
    name: String,
    role: String,
    isOnline: Boolean,
    isSpeaking: Boolean,
  },
  { _id: false }
);

const chatMessageSchema = new Schema(
  {
    id: Schema.Types.Mixed,
    senderId: String,
    senderName: String,
    text: String,
    time: String,
    isInstructor: Boolean,
  },
  { _id: false }
);

const resourceSchema = new Schema(
  {
    title: String,
    url: String,
  },
  { _id: false }
);

const previousSessionSchema = new Schema(
  {
    title: String,
    recordingUrl: String,
  },
  { _id: false }
);

const liveSessionSchema = new Schema(
  {
    courseId: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    topic: { type: String, required: true },
    startTime: { type: String, default: null },
    durationMinutes: { type: Number, default: 0 },
    status: { type: String, enum: ["scheduled", "live", "ended"], default: "scheduled" },
    recordingUrl: { type: String, default: null },
    resources: { type: [resourceSchema], default: [] },
    previousSessions: { type: [previousSessionSchema], default: [] },
    participants: { type: [participantSchema], default: [] },
    chatMessages: { type: [chatMessageSchema], default: [] },
  },
  { timestamps: true }
);

const actionSchema = new Schema(
  {
    kind: { type: String, required: true, index: true },
    payload: { type: Schema.Types.Mixed, default: {} },
    actorEmail: { type: String, default: null },
    actorName: { type: String, default: null },
  },
  { timestamps: true }
);

const enrollmentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: Number, required: true, index: true },
    enrolledAt: { type: Date, default: Date.now },
    liveJoinCount: { type: Number, default: 0 },
    lastJoinedLiveAt: { type: Date, default: null },
  },
  { timestamps: true }
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);
export const Metric = mongoose.model("Metric", metricSchema);
export const Course = mongoose.model("Course", courseSchema);
export const Listing = mongoose.model("Listing", listingSchema);
export const Channel = mongoose.model("Channel", channelSchema);
export const Project = mongoose.model("Project", projectSchema);
export const InnovationProgram = mongoose.model("InnovationProgram", innovationProgramSchema);
export const LiveSession = mongoose.model("LiveSession", liveSessionSchema);
export const Action = mongoose.model("Action", actionSchema);
export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);