import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);
    if (!result)
      return res.status(500).json({
        success: false,
        message: "Vehicle Creation Failed",
      });
    return res.status(201).json({
      success: true,
      message: "Vehicle registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      error: error.message,
    });
  }
};
export const vehicleControllers = {
  createVehicle,
};
