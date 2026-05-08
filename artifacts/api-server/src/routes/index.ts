import { Router, type IRouter } from "express";
import healthRouter from "./health";
import claudeAnalysisRouter from "./claude-analysis";

const router: IRouter = Router();

router.use(healthRouter);
router.use(claudeAnalysisRouter);

export default router;
