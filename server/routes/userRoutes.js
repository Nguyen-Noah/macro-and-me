import e from "express";
import { createUser } from "../controllers/userController.js";

const router = e.Router();

router.post('/users', createUser);

export default router;