import { Router } from "express";
import { authMiddlewares } from "../../middlewares/auth.middleware";
import { authControllers } from "./auth.controller";

const router = Router();

router.post(
  "/signup",
  authMiddlewares.signupValidator,
  authControllers.createUser
);

router.post(
  "/signin",
  authMiddlewares.loginValidator,
  authControllers.loginUser
);

export const authRoutes = router;
