import { Request, Response } from "express";
import Purchase from "../models/purchase.model";

export const createPurchase = async (req: Request, res: Response) => {
  try {
    const { userId, amount, productId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const purchase = await Purchase.create({
      userId,
      amount: amount || 10,
      productId,
    });

    res.status(201).json({
      status: "success",
      code: 201,
      message: "Purchase created successfully",
      data: purchase,
    });

  } catch (error) {
    console.log("Error creating purchase:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
