import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getTechNews } from "../services/news.controllers.js";

const router = Router();

router.get("/news/technology", authMiddleware, getTechNews);

export default router;
