import e from "express";
import { createMeal, getMealByType } from "../controllers/mealController.js";

const router = e.Router();

router.post('/log_meal', createMeal);
router.post('/get_meal', getMealByType);

export default router;