import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (
  res: Response,
  payload: object,
  type: "access" | "refresh"
) => {
  let secret;
  let expiresIn;
  let cookieName;

  if (type === "access") {
    secret = process.env.JWT_ACCESS_SECRET as string;
    expiresIn = "15m";
    cookieName = "accessToken";
  } else {
    secret = process.env.JWT_REFRESH_SECRET as string;
    expiresIn = "7d";
    cookieName = "refreshToken";
  }

  if (!secret) {
    throw new Error(`JWT secret for ${type} token is missing`);
  }

  const token = jwt.sign(payload, secret, { expiresIn });

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: type === "access"
      ? 15 * 60 * 1000           // 15 minutes
      : 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
