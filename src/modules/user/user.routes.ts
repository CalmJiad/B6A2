import { Router } from "express";
import { authMiddlewares } from "../../middlewares/auth.middleware";
import { userControllers } from "./user.controller";

const router = Router();

router.get(
  "/users",
  authMiddlewares.tokenAuthorizer("admin"),
  userControllers.getAllUsers
);

export const userRoutes = router;
