import e from "express";
import { getUserDailyLogs } from "../controllers/logController.js";

const router = e.Router();

router.get('/daily-logs/:userId', getUserDailyLogs);

export default router;