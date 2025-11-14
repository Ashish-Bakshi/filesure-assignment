import { Request, Response,NextFunction  } from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;

if (!ACCESS_SECRET) {
  console.warn("Warning: JWT_ACCESS_SECRET not set. Auth will fail in production.");
} // optional check for development environment

export const authenticateToken = (req: Request, res:Response, next:NextFunction) => {
    try {
        const cookieToken = req.cookies.accessToken;
        const header = req.headers.authorization;
        const bearerToken = header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;
        const token = cookieToken || bearerToken;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const payload = jwt.verify(cookieToken, ACCESS_SECRET) as any;
        console.log("Token payload:", payload);
        req.user = { id: payload.userId, email: payload.email };
        console.log("Authenticated user:", req.user);
        next(); 
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}