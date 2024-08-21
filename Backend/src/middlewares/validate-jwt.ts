import { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";
import "dotenv";
import {
  ResponseHandler,
  CustomError,
  HttpStatus,
} from "../shared/http.response";
import UserModel from "../models/user-models/user.model";
import RoleModel from "../models/user-models/role.model";

export const validateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("eagle-token");
    if (!token)
      return ResponseHandler.handleError(
        res,
        new CustomError("User is not authenticated.", HttpStatus.UNAUTHORIZED)
      );

    const { uid, active, exp } = jsonwebtoken.verify(
      token!,
      process.env.JWT_SECRET as string
    ) as jsonwebtoken.JwtPayload;
    if (active === false)
      return ResponseHandler.handleError(
        res,
        new CustomError("User is not active.", HttpStatus.UNAUTHORIZED)
      );
    if (exp! < Date.now().valueOf() / 1000)
      return ResponseHandler.handleError(
        res,
        new CustomError("Token has expired.", HttpStatus.UNAUTHORIZED)
      );

    const user = await UserModel.findById(uid);
    if (!user)
      return ResponseHandler.handleError(
        res,
        new CustomError("The user does not exist.", HttpStatus.NOT_FOUND)
      );

    const roles = await RoleModel.find({ _id: { $in: user?.role } });
    if (roles.some((role) => role.name === "banned"))
      return ResponseHandler.handleError(
        res,
        new CustomError("User is banned.", HttpStatus.UNAUTHORIZED)
      );

    next();
  } catch (error: any) {
    return ResponseHandler.handleError(res, error);
  }
};

export const validateAdminJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("eagle-token");
    if (!token)
      return ResponseHandler.handleError(
        res,
        new CustomError("User is not authenticated.", HttpStatus.UNAUTHORIZED)
      );

    const { uid, active, exp } = jsonwebtoken.verify(
      token!,
      process.env.JWT_SECRET as string
    ) as jsonwebtoken.JwtPayload;
    if (active === false)
      return ResponseHandler.handleError(
        res,
        new CustomError("User is not active.", HttpStatus.UNAUTHORIZED)
      );
    if (exp! < Date.now().valueOf() / 1000)
      return ResponseHandler.handleError(
        res,
        new CustomError("Token has expired.", HttpStatus.UNAUTHORIZED)
      );

    const user = await UserModel.findById(uid);
    if (!user)
      return ResponseHandler.handleError(
        res,
        new CustomError("The user does not exist.", HttpStatus.NOT_FOUND)
      );

    const roles = await RoleModel.find({ _id: { $in: user?.role } });
    if (roles.some((role) => role.name === "banned"))
      return ResponseHandler.handleError(
        res,
        new CustomError("User is banned.", HttpStatus.UNAUTHORIZED)
      );

    if (roles.some((role) => role.name !== "admin"))
      return ResponseHandler.handleError(
        res,
        new CustomError(
          "You need admin authorization.",
          HttpStatus.UNAUTHORIZED
        )
      );

    next();
  } catch (error: any) {
    return ResponseHandler.handleError(res, error);
  }
};
