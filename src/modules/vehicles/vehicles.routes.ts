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

router.get("/vehicles", vehicleControllers.getAllVehicle);
router.get("/vehicles/:vehicleId", vehicleControllers.getVehicleById);
router.put(
  "/vehicles/:vehicleId",
  authMiddlewares.tokenAuthorizer("admin"),
  vehicleControllers.updateVehicleById
);

export const vehicleRoutes = router;
