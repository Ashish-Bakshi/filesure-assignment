import { Request, Response } from "express";
import User from "../models/user.model";
import Referral from "../models/referral.model";
import { generateReferralCode } from "../utils/generateReferralCode";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";
import jwt from "jsonwebtoken";

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const referrerCode =
      req.body.referrerCode || req.query.referrerCode || null;

    if (!email || !password) {
      return res.status(400).send("email and password are required");
    }

    const existsingUser = await User.findOne({ email });

    if (existsingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newReferralCode = generateReferralCode();
    
    let referrer = null;

    if (referrerCode) {
      referrer = await User.findOne({ referralCode: referrerCode });
    }

    console.log("Referrer found:", referrer);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy: referrer || null,
    });

    if (!referrer) {
        console.log("❌ Invalid referral code:", referrerCode);
      } else {
        console.log("✅ Referral matched:", referrer._id);

        await Referral.create({
          referrerId: referrer._id,
          referredId: newUser._id,
          status: "pending",
        });
      }

      if (!newUser) {
      return res.status(500).json({
        message: "Failed to create user",
      });
    }

    res.status(201).json({
      status: "success",
      code: 201,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        referralCode: newUser.referralCode,
        referredBy: referrer ? referrer._id : null,
      },
    });
  } catch (error) {
    res.status(500).json({ "Server Error": error });
  }
};


export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    if (!user.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const payload = { userId: user._id, email: user.email };
    generateToken(res, payload, "access");
    generateToken(res, payload, "refresh");
    
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

const logoutHandler = async (req: Request, res: Response) => {
    res.cookie('accessToken', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

export const refreshAccessToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.status(401);
        throw new Error('Not authorized, no refresh token');
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as any;
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            res.status(401);
            throw new Error('User not found, authorization denied');
        }

        // --- FIX: Pass a plain object as the payload ---
        generateToken(res, { userId: user._id }, 'access');
        res.status(200).json({ message: 'Access token refreshed successfully' });

    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed or expired');
    }
};