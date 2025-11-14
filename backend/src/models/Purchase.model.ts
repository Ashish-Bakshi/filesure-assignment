import mongoose, { Schema } from "mongoose";
import { PurchaseTypes } from "../types";

const PurchaseSchema = new Schema<PurchaseTypes>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    productId: String,
  },
  { timestamps: true }
);

PurchaseSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<PurchaseTypes>("Purchase", PurchaseSchema);
