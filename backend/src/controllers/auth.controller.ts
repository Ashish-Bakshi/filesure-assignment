import { Request, Response } from "express";
import User from "../models/User.model";
import Referral from "../models/Referral.model";
import { generateReferralCode } from "../utils/generateReferralCode";
import bcrypt from "bcryptjs";

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const { name, email, password, referralCode } = req.body;

    if (!email || !password) {
      return res.status(400).send("email and password are required");
    }

    const existsingUser = await User.findOne({ email });

    if (existsingUser) {
      return res.status(400).json(
        {
            message : "User already exists with this email"
        }
    );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newReferralCode = generateReferralCode();

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy: referralCode || null,
    });

    if (!newUser) {
      return res.status(500).json(
        { 
            message : "Failed to create user" 
        }
    );
    }

    if (referralCode) {
      const referrer = await User.findOne({ referralCode })
      if (referrer) {
        await Referral.create({
          referrerId: referrer._id,
          referredId: newUser._id,
          status: 'pending'
        })
      }
    }

    res.status(201).json({
      status: "success",
      code: 201,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        name : newUser.name,
        email : newUser.email,
        referralCode: newUser.referralCode,
      },
    });

  } catch (error) {
    res.status(500).json({"Server Error" : error});
  }
};


