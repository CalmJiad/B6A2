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
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicle();
    if (!result)
      return res.status(500).json({
        success: false,
        message: "Vehicle data fetch failed",
      });
    if (result.length === 0)
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    return res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehicleById(req.params.vehicleId);
    if (!result)
      return res.status(500).json({
        success: false,
        message: "Vehicle data fetch failed",
      });
    if (result.length === 0)
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    return res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId;
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    if (
      !vehicle_name &&
      !type &&
      !registration_number &&
      !daily_rent_price &&
      !availability_status
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided to update",
      });
    }

    const result = await vehicleServices.updateVehicleById(vehicleId, req.body);
    console.log(result);

    if (!result)
      return res.status(500).json({
        success: false,
        message: "Error updating vehicle",
      });

    if (result.rows.length === 0)
      return res.status(404).json({
        success: false,
        message: "No vehicle found with the given ID",
      });

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId;

    const result = await vehicleServices.deleteVehicleById(vehicleId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if ((result as any).error) {
      return res.status(400).json({
        success: false,
        message: (result as any).error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicle,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};
