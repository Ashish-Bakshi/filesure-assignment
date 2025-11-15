// src/routes/dashboard.ts
import express from "express";
import { getDashboard } from "../controllers/dashboard.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authenticateToken, getDashboard);

export default router;
