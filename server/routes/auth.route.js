import express from "express";
import { refreshToken, signIn, signUp, signOut } from "../controllers/auth.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", verifyToken, signOut);

export default router