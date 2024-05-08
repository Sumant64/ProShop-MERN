import express from "express";
import { authUser, getUsers, logoutUser, registerUser } from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/auth", authUser);
router.post('/logout', logoutUser);

export default router;
