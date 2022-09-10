// imports
import { Router } from "express";
const router = Router();

// unknown /api/ endpoints middleware
router.use("/api/:path?", (req, _, next) => {
  next({
    status: 404,
    message: `API endpoint ${req.originalUrl} doesn't exist`,
  });
});

// rest unknown /* endpoints middleware
router.use("/", (req, _, next) => {
  next({
    status: 404,
    message: `${req.originalUrl} is not valid API endpoint. Missing /api/ prefix!`,
  });
});

export default router;
