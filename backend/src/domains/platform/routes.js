export const registerPlatformRoutes = (app, { Action, resolveActorFromRequest }) => {
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

  app.post("/api/actions", async (req, res) => {
    const { kind, payload } = req.body ?? {};

    if (!kind) {
      return res.status(400).json({ message: "kind is required" });
    }

    const actor = await resolveActorFromRequest(req);

    const action = await Action.create({
      kind: String(kind),
      payload: payload ?? {},
      actorEmail: actor?.email ?? null,
      actorName: actor?.name ?? null,
    });

    return res.status(201).json({ action });
  });
};
