import { Router } from "express";
import { authMiddlewares } from "../../middlewares/auth.middleware";
import { userControllers } from "./user.controller";

const router = Router();

router.get(
  "/users",
  authMiddlewares.tokenAuthorizer("admin"),
  userControllers.getAllUsers
);

router.put(
  "/users/:userId",
  authMiddlewares.tokenAuthorizer("admin", "customer"),
  userControllers.updateUsers
);

router.delete(
  "/users/:userId",
  authMiddlewares.tokenAuthorizer("admin"),
  userControllers.deleteUserById
);

export const userRoutes = router;
