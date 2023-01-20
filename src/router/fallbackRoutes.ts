// imports
import { HttpError } from "error/HttpError";
import { Router } from "express";
import { HttpStatus } from "constant";
const router = Router();

// unknown /api/ endpoints middleware
router.use("/api/:path?", (req, _, next) => {
  next(
    new HttpError(
      HttpStatus.NOT_FOUND,
      `${req.method} ${req.originalUrl} endpoint doesn't exist`
    )
  );
});

export default router;
