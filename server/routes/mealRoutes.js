import e from "express";
import { createMeal, getMealByType, removeFood } from "../controllers/mealController.js";

const router = e.Router();

router.post('/log_meal', createMeal);
router.post('/get_meal', getMealByType);
router.delete('/remove_food', removeFood);

export default router;