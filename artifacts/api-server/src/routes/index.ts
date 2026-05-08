import { Router, type IRouter } from "express";
import healthRouter from "./health";
import claudeAnalysisRouter from "./claude-analysis";
import geminiCleanPreviewRouter from "./gemini-clean-preview";

const router: IRouter = Router();

router.use(healthRouter);
router.use(claudeAnalysisRouter);
router.use(geminiCleanPreviewRouter);

export default router;
