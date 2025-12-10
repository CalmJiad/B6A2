import { Request, Response } from "express";
import { CreateUserPayload } from "../../types/auth.types";
import { authServices } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.createUser(req.body as CreateUserPayload);
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      message: "User registered successfully",
      error: error.message,
    });
  }
};

export const authControllers = {
  createUser,
};
