import e from "express";
import { editFood } from "../controllers/foodController.js";

const router = e.Router();

router.put('/food', editFood);

export default router;