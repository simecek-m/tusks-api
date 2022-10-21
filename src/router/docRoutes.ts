// imports
import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "doc/api.json";
const router = Router();

// API documentation
router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocument));

export default router;
