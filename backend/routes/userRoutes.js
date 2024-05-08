import express from "express";
import { authUser, getUserProfile, getUsers, logoutUser, registerUser } from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/auth", authUser);
router.get('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile);

export default router;
