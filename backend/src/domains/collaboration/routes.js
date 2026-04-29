export const registerCollaborationRoutes = (app, { Project, Action, authenticate }) => {
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
};
