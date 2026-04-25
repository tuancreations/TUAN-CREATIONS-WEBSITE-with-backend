export const registerIotRoutes = (app, { InnovationProgram, Action, authenticate }) => {
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
};
