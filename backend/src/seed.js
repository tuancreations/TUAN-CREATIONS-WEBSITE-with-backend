import bcrypt from "bcryptjs";
import { config } from "./config.js";
import { Action, Channel, Certificate, Course, Enrollment, ForumReply, ForumThread, InnovationProgram, Listing, LiveSession, Metric, MentorshipPairing, Notification, Project, Quiz, QuizResult, Recording, Session, StudyGroup, User } from "./models.js";
import { collaborationProjects, courses, dashboardMetrics, innovationPrograms, listings, mediaChannels, recordingSeeds, sessionSeeds, instructorSeeds, forumThreadSeeds, notificationSeeds, sessionSeeds_tier2, quizSeeds, quizResultSeeds, studyGroupSeeds, mentorshipPairingSeeds } from "./data.js";

const seedCollection = async (Model, documents, uniqueField) => {
  const count = await Model.countDocuments();
  if (count > 0) return;

  if (uniqueField) {
    await Model.insertMany(
      documents.map((document) => ({
        ...document,
        [uniqueField]: document[uniqueField],
      }))
    );
    return;
  }

  await Model.insertMany(documents);
};

export async function seedDatabase() {
  await seedCollection(Metric, dashboardMetrics);
  await seedCollection(Course, courses, "id");
  await seedCollection(Listing, listings, "id");
  await seedCollection(Channel, mediaChannels, "id");
  await seedCollection(Project, collaborationProjects, "id");
  await seedCollection(InnovationProgram, innovationPrograms, "id");
  await seedCollection(LiveSession, sessionSeeds, "courseId");
  await seedCollection(Recording, recordingSeeds);

  // Seed instructors
  const existingInstructors = await User.countDocuments({ isInstructor: true });
  if (existingInstructors === 0 && instructorSeeds.length > 0) {
    const hashedInstructors = await Promise.all(
      instructorSeeds.map(async (instructor) => ({
        ...instructor,
        passwordHash: await bcrypt.hash("InstructorPass123!", 12),
      }))
    );
    await User.insertMany(hashedInstructors);
  }

  // Seed sessions with instructor references
  const existingSessions = await Session.countDocuments();
  if (existingSessions === 0 && sessionSeeds_tier2.length > 0) {
    const instructors = await User.find({ isInstructor: true });
    const instructorMap = {
      1: instructors.find(i => i.name === "Eng. Godwin Ofwono")?._id,
      2: instructors.find(i => i.name === "Eng. Behangana Keneth")?._id,
      3: instructors.find(i => i.name === "Eng. Butera Marcel")?._id,
    };

    const sessionsWithInstructors = sessionSeeds_tier2.map((session) => ({
      ...session,
      instructorId: instructorMap[session.courseId] || instructors[0]?._id,
    }));

    await Session.insertMany(sessionsWithInstructors);
  }

  // Seed forum threads
  const existingThreads = await ForumThread.countDocuments();
  if (existingThreads === 0 && forumThreadSeeds.length > 0) {
    const firstInstructor = await User.findOne({ isInstructor: true });
    const threadsWithAuthor = forumThreadSeeds.map((thread) => ({
      ...thread,
      authorId: firstInstructor?._id,
      authorName: firstInstructor?.name || "Anonymous",
    }));
    await ForumThread.insertMany(threadsWithAuthor);
  }

  // Seed quizzes
  const existingQuizzes = await Quiz.countDocuments();
  if (existingQuizzes === 0 && quizSeeds.length > 0) {
    // Attach a generated ObjectId and insert
    await Quiz.insertMany(quizSeeds.map(q => ({ ...q })));
  }

  // Seed study groups
  const existingGroups = await StudyGroup.countDocuments();
  if (existingGroups === 0 && studyGroupSeeds.length > 0) {
    const firstInstructor = await User.findOne({ isInstructor: true });
    const groups = studyGroupSeeds.map(g => ({ ...g, createdBy: firstInstructor?._id, members: [firstInstructor?._id] }));
    await StudyGroup.insertMany(groups);
  }

  // Seed mentorship pairings
  const existingPairings = await MentorshipPairing.countDocuments();
  if (existingPairings === 0 && mentorshipPairingSeeds.length > 0) {
    const mentor = await User.findOne({ email: mentorshipPairingSeeds[0].mentorEmail });
    const mentee = await User.findOne({ isInstructor: false, role: { $ne: 'admin' } });
    if (mentor && mentee) {
      await MentorshipPairing.create({
        courseId: mentorshipPairingSeeds[0].courseId,
        mentorId: mentor._id,
        menteeId: mentee._id,
        mentorName: mentor.name,
        menteeName: mentee.name,
        goals: mentorshipPairingSeeds[0].goals || "",
        status: mentorshipPairingSeeds[0].status || "pending",
      });
    }
  }

  // Seed quiz results (map to the first student account)
  const existingQuizResults = await QuizResult.countDocuments();
  if (existingQuizResults === 0 && quizResultSeeds.length > 0) {
    const quizzes = await Quiz.find().lean();
    const student = await User.findOne({ isInstructor: false, role: { $ne: 'admin' } });
    if (student && quizzes.length > 0) {
      const results = quizResultSeeds.map((r) => {
        const quiz = quizzes[r.quizIndex] || quizzes[0];
        return {
          userId: student._id,
          quizId: quiz._id,
          courseId: quiz.courseId,
          answers: r.answers || [],
          score: r.score || 0,
          percentageScore: r.percentageScore || 0,
          passed: r.passed || false,
          attemptNumber: r.attemptNumber || 1,
          timeSpent: r.timeSpent || 0,
        };
      });
      await QuizResult.insertMany(results);
    }
  }

  const actionCount = await Action.countDocuments();
  if (actionCount === 0) {
    await Action.create({
      kind: "system.bootstrap",
      payload: { message: "TUAN backend initialized" },
    });
  }

  if (config.adminEmail && config.adminPassword) {
    const passwordHash = await bcrypt.hash(config.adminPassword, 12);
    const existingAdmin = await User.findOne({ email: config.adminEmail }).select("+passwordHash");

    if (!existingAdmin) {
      await User.create({
        name: "Platform Admin",
        email: config.adminEmail,
        role: "admin",
        passwordHash,
      });
      return;
    }

    existingAdmin.role = "admin";
    existingAdmin.passwordHash = passwordHash;
    await existingAdmin.save();
  }
}