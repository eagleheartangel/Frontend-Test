import { Request, Response } from "express";
import UserModel from "../../models/user-models/user.model";

import {
  ResponseHandler,
  CustomError,
  HttpStatus,
} from "../../shared/http.response";
import { PaginationService } from "../../services/pagination";

export class UserController {
  private paginationService = new PaginationService();

  getUsers = async (req: Request, res: Response) => {
    try {
      const users = await UserModel.find().sort([["createdAt", "descending"]]);
      return ResponseHandler.Ok(res, users);
    } catch (error: any) {
      return ResponseHandler.handleError(res, error);
    }
  };

  getPaginatedUsers = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.paginationService.getUsers(page, limit);
      return ResponseHandler.Ok(res, result);
    } catch (error: any) {
      return ResponseHandler.handleError(res, error);
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id).populate("role", "status");
      if (!user)
        return ResponseHandler.handleError(
          res,
          new CustomError("User not found", HttpStatus.NOT_FOUND)
        );
      return ResponseHandler.Ok(res, user);
    } catch (error: any) {
      return ResponseHandler.handleError(res, error);
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      return ResponseHandler.Ok(res, user);
    } catch (error: any) {
      return ResponseHandler.handleError(res, error);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findByIdAndDelete(id);
      if (!user)
        return ResponseHandler.handleError(
          res,
          new CustomError("User not found", HttpStatus.NOT_FOUND)
        );
      return ResponseHandler.Ok(res, user);
    } catch (error: any) {
      return ResponseHandler.handleError(res, error);
    }
  };

  getUsersByStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.params;

      if (!status) {
        return ResponseHandler.handleError(
          res,
          new CustomError("Status is required.", HttpStatus.CONFLICT)
        );
      }

      const users = await UserModel.find()
        .populate({
          path: "status",
          match: { status },
          select: "status",
        })
        .exec();

      const filteredUsers = users.filter((user) => user.status);

      return res.status(200).json(filteredUsers);
    } catch (error: any) {
      return ResponseHandler.handleError(res, error);
    }
  };
}
