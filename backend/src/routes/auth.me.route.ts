import express from "express";
import { meHandler } from "../controllers/auth.me.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authenticateToken, meHandler);

export default router;
