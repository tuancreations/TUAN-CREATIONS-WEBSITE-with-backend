export const registerMediaRoutes = (app, { Channel, Action, authenticate }) => {
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
};
