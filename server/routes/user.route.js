import express from "express";
import { getUser } from "../controllers/user.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import { refreshToken } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/get-user", verifyToken, getUser);
router.get("/refresh-token", refreshToken, verifyToken,getUser);

export default router