import { Router } from "express";
import { authMiddlewares } from "../../middlewares/auth.middleware";
import { vehicleMiddlewares } from "../../middlewares/vehicles.middleware";
import { vehicleControllers } from "./vehicles.controller";

const router = Router();

router.post(
  "/vehicles",
  authMiddlewares.tokenAuthorizer("admin"),
  vehicleMiddlewares.createVehicleValidator,
  vehicleControllers.createVehicle
);

export const vehicleRoutes = router;
