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
      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: [],
      });
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUsers = async (req: Request, res: Response) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message:
        "Request body is missing or empty. Send JSON with Content-Type: application/json",
    });
  }

  const { name, email, phone, role } = req.body;

  const updates: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  } = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (phone !== undefined) updates.phone = phone;

  // Only admin is allowed to update role
  if (req.user?.role === "admin" && role !== undefined) {
    updates.role = role;
  }

  try {
    let result = null;

    if (
      req.user?.role === "customer" &&
      Number(req.params.userId) === Number(req.user?.id)
    ) {
      // Check if 'customer' has requested a role update
      if (role !== undefined) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update the 'role'",
        });
      }
      result = await userServices.updateUserByCustomer(
        req.params.userId,
        updates
      );
    } else if (req.user?.role === "admin") {
      result = await userServices.updateUserByAdmin(req.params.userId, updates);
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden || You are not allowed to update",
      });
    }

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found or no valid fields to update",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const result = await userServices.deleteUserById(userId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
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
      message: "User deleted successfully",
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
  updateUsers,
  deleteUserById,
};
