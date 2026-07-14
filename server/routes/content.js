import { Router } from "express";
import Content from "../models/Content.js";
import requireAuth from "../middleware/auth.js";

const router = Router();

// GET /api/content -> public, powers the whole site
router.get("/", async (req, res) => {
  const content = await Content.findOne({ key: "portfolio" });
  if (!content) return res.status(404).json({ error: "Content not seeded yet. Run `npm run seed`." });
  res.json(content);
});

// PUT /api/content -> admin only, partial or full update
router.put("/", requireAuth, async (req, res) => {
  const updates = req.body || {};
  const content = await Content.findOneAndUpdate(
    { key: "portfolio" },
    { $set: updates },
    { new: true, upsert: true }
  );
  res.json(content);
});

export default router;
