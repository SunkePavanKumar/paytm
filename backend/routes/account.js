import express from "express";
import { balance, transfer } from "../controllers/account.controller.js";
import authMiddleware from "../middlewares/autth.middleware.js";
const router = express.Router();

router.get("/balance", authMiddleware, balance);
router.post("/transfer", authMiddleware, transfer);

export default router;
