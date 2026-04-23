import bcrypt from "bcryptjs";
import { config } from "./config.js";
import { Action, Channel, Course, InnovationProgram, Listing, LiveSession, Metric, Project, User } from "./models.js";
import { collaborationProjects, courses, dashboardMetrics, innovationPrograms, listings, mediaChannels, sessionSeeds } from "./data.js";

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