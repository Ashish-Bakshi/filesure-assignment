import mongoose, { Schema } from "mongoose";
import { UserTypes } from "../types/index";

const UserSchema = new Schema<UserTypes>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    referralCode: { type: String, required: true, unique: true },
    referredBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    credits: { type: Number, default: 0 },
    firstPurchaseCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<UserTypes>("User", UserSchema);