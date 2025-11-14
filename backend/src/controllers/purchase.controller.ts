import { Request, Response } from "express";
import Purchase from "../models/purchase.model";
import { awardReferralCredits } from "../services/referral.service";

export const createPurchase = async (req: Request, res: Response) => {
  try {
    const { amount, productId } = req.body;
    const userId = req.user?.id;
    console.log("Creating purchase for userId:", userId);
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const purchase = await Purchase.create({
      userId,
      amount: amount || 10,
      productId,
    });

    if (!purchase) {
      console.log("Purchase creation failed");
      return res.status(500).json({ message: "Failed to create purchase" });
    }
    
    console.log("Purchase created successfully:", purchase);

    const result = await awardReferralCredits(userId);

    res.status(201).json({
      status: "success",
      code: 201,
      message: "Purchase created successfully",
      data: {
        purchase,
        referralCreditsAwarded: result,
      },
    });

  } catch (error) {
    console.log("Error creating purchase:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
