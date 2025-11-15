import { Request, Response } from "express";
import User from "../models/user.model";

export const meHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "unauthenticated" });

    const user = await User.findById(userId).select("name email referralCode credits");
    if (!user) return res.status(404).json({ error: "user not found" });

    return res.json({ ok: true, data: user });
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
};
