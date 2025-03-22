import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import Campaign from "./models/Campaign";
import path from "path";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));

app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/**
 * POST /api/campaigns
 * Expects payload: { topics: [ { vertical, subVertical, topicTitle, geo, platform } ] }
 * For each topic, we add initial feedbackStats: { likes: 0, dislikes: 0 }.
 * Uses bulkWrite with upsert to avoid duplicates.
 */
app.post(
  "/api/campaigns",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const topics = req.body.topics;
      if (!Array.isArray(topics)) {
        res.status(400).json({ error: "topics should be an array" });
        return;
      }
      // Add initial feedbackStats to each topic object if not provided
      const topicsWithFeedback = topics.map((topic: any) => ({
        ...topic,
        feedbackStats: { likes: 0, dislikes: 0 },
      }));
      const bulkOps = topicsWithFeedback.map((topic: any) => ({
        updateOne: {
          filter: {
            topicTitle: topic.topicTitle,
            geo: topic.geo,
            platform: topic.platform,
          },
          update: { $setOnInsert: topic },
          upsert: true,
        },
      }));
      const result = await Campaign.bulkWrite(bulkOps);
      res.json({ message: "Campaign topics stored", result });
    } catch (error) {
      console.error("Error storing campaigns:", error);
      res.status(500).json({ error: "Error storing campaigns" });
    }
  }
);

app.get(
  "/api/campaigns/aggregated",
  async (_: Request, res: Response): Promise<void> => {
    try {
      const aggregated = await Campaign.aggregate([
        { $match: { feedbackStats: { $exists: true } } },
        {
          $group: {
            _id: {
              vertical: "$vertical",
              subVertical: "$subVertical",
              topicTitle: "$topicTitle",
              geo: "$geo",
              platform: "$platform",
            },
            count: { $sum: 1 },
            totalLikes: { $sum: "$feedbackStats.likes" },
            totalDislikes: { $sum: "$feedbackStats.dislikes" },
          },
        },
        {
          $project: {
            vertical: "$_id.vertical",
            subVertical: "$_id.subVertical",
            topicTitle: "$_id.topicTitle",
            geo: "$_id.geo",
            platform: "$_id.platform",
            count: 1,
            feedbackStats: {
              likes: "$totalLikes",
              dislikes: "$totalDislikes",
            },
            _id: 0,
          },
        },
      ]);
      res.json(aggregated);
    } catch (error) {
      console.error("Error aggregating campaigns:", error);
      res.status(500).json({ error: "Error aggregating campaigns" });
    }
  }
);

/**
 * POST /api/campaigns/feedback
 * Expects payload: { topicTitle: string, geo: string, platform: string, feedback: "like" | "dislike" }
 * Increments the corresponding counter in feedbackStats.
 */
app.post(
  "/api/campaigns/feedback",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { topicTitle, geo, platform, feedback } = req.body;
      if (!topicTitle || !geo || !platform || !feedback) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      // Determine the field to increment based on feedback type.
      const updateField =
        feedback === "like" ? "feedbackStats.likes" : "feedbackStats.dislikes";
      const result = await Campaign.updateOne(
        { topicTitle, geo, platform },
        { $inc: { [updateField]: 1 } }
      );
      res.json({ message: "Feedback updated", result });
    } catch (error) {
      console.error("Error updating feedback stats:", error);
      res.status(500).json({ error: "Error updating feedback stats" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
