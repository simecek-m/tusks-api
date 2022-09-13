// imports
import { HttpError } from "error/HttpError";
import { Router } from "express";
const router = Router();

// unknown /api/ endpoints middleware
router.use("/api/:path?", (req, _, next) => {
  next(new HttpError(404, `API endpoint ${req.originalUrl} doesn't exist`));
});

// rest unknown /* endpoints middleware
router.use("/", (req, _, next) => {
  next(
    new HttpError(
      404,
      `${req.originalUrl} is not valid API endpoint. Missing /api/ prefix!`
    )
  );
});

export default router;
