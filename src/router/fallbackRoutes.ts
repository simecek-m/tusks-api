// imports
import { HttpError } from "error/HttpError";
import { Router } from "express";
const router = Router();

// unknown /api/ endpoints middleware
router.use("/api/:path?", (req, _, next) => {
  next(
    new HttpError(
      404,
      `${req.method} ${req.originalUrl} endpoint doesn't exist`
    )
  );
});

export default router;
