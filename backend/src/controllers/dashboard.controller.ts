import { Request, Response } from "express";
import User from "../models/user.model";
import Referral from "../models/referral.model";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "unauthenticated" });

    // fetch user for credits & referralCode
    const user = await User.findById(userId).select("credits referralCode");
    if (!user) return res.status(404).json({ error: "user not found" });

    const totalReferred = await User.countDocuments({ referredBy: userId });
    const convertedCount = await Referral.countDocuments({
      referrerId: userId,
      status: "converted",
    });
    const pendingCount = await Referral.countDocuments({
      referrerId: userId,
      status: "pending",
    });

    // small list of referred users with conversion flag (limit 20)
    const referredUsersRaw = await User.find({ referredBy: userId })
      .select("name email credits firstPurchaseCompleted referralCode")
      .lean()
      .limit(50);

    // join with Referral docs for quick status mapping
    const referrals = await Referral.find({ referrerId: userId })
      .select("referredId status convertedAt createdAt")
      .lean();

    const referralMap = new Map<string, any>();
    referrals.forEach((r) => referralMap.set(String(r.referredId), r));

    const referredUsers = referredUsersRaw.map((ru) => {
      const r = referralMap.get(String(ru._id)) || null;
      return {
        id: ru._id,
        name: ru.name,
        email: ru.email,
        credits: ru.credits,
        referralCode: ru.referralCode,
        firstPurchaseCompleted: !!ru.firstPurchaseCompleted,
        referralStatus: r ? r.status : "unknown",
        referredAt: r ? r.createdAt : null,
        convertedAt: r ? r.convertedAt : null,
      };
    });

    return res.json({
      ok: true,
      data: {
        totalReferred,
        convertedCount,
        pendingCount,
        totalCredits: user.credits || 0,
        referralCode: user.referralCode,
        referralLink: `${process.env.CLIENT_ORIGIN || "http://localhost:3000"}/register?referrerCode=${user.referralCode}`,
        referredUsers,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ error: "server error" });
  }
};
