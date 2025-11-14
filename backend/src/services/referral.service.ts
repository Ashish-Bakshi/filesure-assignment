import mongoose from "mongoose";
import User from "../models/user.model";
import Referral from "../models/referral.model";

export const awardReferralCredits = async (userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    // If already purchased before then stop
    if (user.firstPurchaseCompleted) {
      await session.commitTransaction();
      session.endSession();
      return { message: "Already purchased before. No credits awarded." };
    }

    // Find referral entry
    const referral = await Referral.findOne({ referredId: userId }).session(session);

    if (!referral) {
      // No referrer, only mark user as completed
      user.firstPurchaseCompleted = true;
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();
      return { message: "No referral found. First purchase recorded." };
    }

    // Load referrer
    const referrer = await User.findById(referral.referrerId).session(session);
    if (!referrer) throw new Error("Referrer not found");

    // Award credits
    user.credits += 2;
    referrer.credits += 2;

    // Mark referral as converted
    referral.status = "converted";

    // Mark user first purchase complete
    user.firstPurchaseCompleted = true;

    await user.save({ session });
    await referrer.save({ session });
    await referral.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Referral converted. Credits awarded.",
      referrer: referrer._id,
      user: user._id,
    };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Referral credit error:", error);
    throw error;
  }
};
