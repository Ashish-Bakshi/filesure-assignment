import mongoose, { Schema } from "mongoose";
import { ReferralTypes } from "../types";

const ReferralSchema = new Schema<ReferralTypes>(
  {
    referrerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    referredId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "converted"],
      default: "pending",
    },
    convertedAt: Date,
  },
  { timestamps: true }
);

// useful indexes for queries
ReferralSchema.index({ referrerId: 1, referredId: 1 }, { unique: true });

export default mongoose.model<ReferralTypes>('Referral', ReferralSchema)