import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/index";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    referralCode: { type: String, required: true, unique: true },
    credits: { type: Number, default: 0 },
    firstPurchaseCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);