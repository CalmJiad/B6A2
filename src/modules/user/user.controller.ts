import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();
    if (!result)
      return res.status(404).json({
        success: false,
        message: "Error fetching user data",
      });
    if (result.length === 0)
      return res.status(404).json({
        success: false,
        message: "No user data found",
      });
    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userControllers = {
  getAllUsers,
};
