import jwt, { Secret } from "jsonwebtoken";
import { Response } from "express";

export const generateToken = async (
  res: Response,
  payload: object,
  type: "access" | "refresh"
) => {
  let secret: Secret =
    type === "access"
      ? (process.env.JWT_ACCESS_SECRET as Secret)
      : (process.env.JWT_REFRESH_SECRET as Secret);
  
  const expiresIn = type === "access" ? "15m" : "7d";
  const cookieName = type === "access" ? "accessToken" : "refreshToken";

  if (!secret) {
    throw new Error(`JWT secret for ${type} token is missing`);
  }

  const token = jwt.sign(payload, secret, { expiresIn });

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    domain: ".onrender.com",
    maxAge: type === "access"
      ? 15 * 60 * 1000           // 15 minutes
      : 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
