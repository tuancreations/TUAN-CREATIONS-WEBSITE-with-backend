import express from "express";
import { SiteConfig } from "../../models.js";

const router = express.Router();

// Get all config values
router.get("/", async (req, res) => {
  try {
    const configs = await SiteConfig.find({});
    const configMap = {};
    configs.forEach((cfg) => {
      configMap[cfg.key] = cfg.value;
    });
    res.json(configMap);
  } catch (error) {
    console.error("Error fetching site config:", error);
    res.status(500).json({ error: "Failed to fetch site config" });
  }
});

// Get specific config value
router.get("/:key", async (req, res) => {
  try {
    const config = await SiteConfig.findOne({ key: req.params.key });
    if (!config) {
      return res.status(404).json({ error: "Config not found" });
    }
    res.json({ [config.key]: config.value });
  } catch (error) {
    console.error("Error fetching config:", error);
    res.status(500).json({ error: "Failed to fetch config" });
  }
});

// Update config value (admin only)
router.post("/:key", async (req, res) => {
  // In a real app, check admin role here
  try {
    const { value, description } = req.body;
    const config = await SiteConfig.findOneAndUpdate(
      { key: req.params.key },
      { key: req.params.key, value, description },
      { upsert: true, new: true }
    );
    res.json(config);
  } catch (error) {
    console.error("Error updating config:", error);
    res.status(500).json({ error: "Failed to update config" });
  }
});

// Bulk update configs (admin only)
router.post("/", async (req, res) => {
  try {
    const updates = req.body; // { key: value, ... }
    const results = [];
    for (const [key, value] of Object.entries(updates)) {
      const config = await SiteConfig.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      );
      results.push(config);
    }
    res.json(results);
  } catch (error) {
    console.error("Error bulk updating config:", error);
    res.status(500).json({ error: "Failed to bulk update config" });
  }
});

export default router;
