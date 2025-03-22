import { Schema, model, Document } from "mongoose";

export interface ICampaign extends Document {
  vertical: string;
  subVertical: string;
  topicTitle: string;
  geo: string;
  platform: string;
  feedback?: "like" | "dislike" | null;
  feedbackStats: {
    likes: number;
    dislikes: number;
  };
  createdAt: Date;
}

const CampaignSchema = new Schema<ICampaign>({
  vertical: { type: String, required: true },
  subVertical: { type: String, required: true },
  topicTitle: { type: String, required: true },
  geo: { type: String, required: true },
  platform: { type: String, required: true },
  feedback: { type: String, enum: ["like", "dislike"], default: null },
  feedbackStats: {
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

CampaignSchema.index({ topicTitle: 1, geo: 1, platform: 1 }, { unique: true });

export default model<ICampaign>("Campaigns", CampaignSchema);
