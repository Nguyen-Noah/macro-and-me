import e from "express";
import { createUser, updateUserProfile, getUserProfile } from "../controllers/userController.js";

const router = e.Router();

router.post('/users', createUser);
router.put('/updateUserProfile', updateUserProfile)
router.get('/getUserProfile', getUserProfile);

export default router;