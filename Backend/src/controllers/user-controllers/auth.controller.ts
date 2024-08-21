import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../../models/user-models/user.model";
import RoleModel from "../../models/user-models/role.model";
import StatusModel from "../../models/user-models/status.model";

import {
  ResponseHandler,
  CustomError,
  HttpStatus,
} from "../../shared/http.response";
import { JWT } from "../../services/jwt";
import { EmailsClass } from "../../services/nodemailer";
import { StatusInterface } from "../../interfaces/user.interface";

export class AuthController {
  constructor(
    private readonly jwt: JWT = new JWT(),
    private readonly emails: EmailsClass = new EmailsClass()
  ) {}

  signup = async (req: Request, res: Response) => {
    try {
      const { nickname, email, password } = req.body;

      const user = await UserModel.findOne({ email: email });
      const nicknameUser = await UserModel.findOne({ nickname: nickname });

      if (nicknameUser)
        return ResponseHandler.handleError(
          res,
          new CustomError(
            "Nickname already exists",

            HttpStatus.CONFLICT
          )
        );

      if (user)
        return ResponseHandler.handleError(
          res,
          new CustomError("User already exists", HttpStatus.CONFLICT)
        );

      let salt = bcrypt.genSaltSync(12);
      let hash = bcrypt.hashSync(password, salt);

      const role = await RoleModel.findOne({ name: "user" });

      const randomDigits = Math.floor(1000 + Math.random() * 9000);

      const newUser = await new UserModel({
        nickname: nickname,
        email: email,
        password: hash,
        image: `https://robohash.org/user${randomDigits}.png`,
        role: [role?.id],
      }).save();

      const newstatus = await new StatusModel({
        userid: newUser._id,
        status: "pending",
      }).save();

      const updatedUser = await UserModel.findByIdAndUpdate(
        newUser._id,
        { status: newstatus._id },
        { new: true }
      );

      const mailstatus = await this.emails.sendEmail(req, newstatus._id);

      return ResponseHandler.Ok(res, {
        message: `Code sent to ${mailstatus.accepted[0]}`,
        user: updatedUser,
      });
    } catch (error: any) {
      return ResponseHandler.handleError(res, error);
    }
  };

  signin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email: email });

      if (!user)
        return ResponseHandler.handleError(
          res,
          new CustomError("User not found", HttpStatus.NOT_FOUND)
        );
      const result = await bcrypt.compare(password, user.password);

      if (!result)
        return ResponseHandler.handleError(
          res,
          new CustomError(
            "Invalid password",

            HttpStatus.UNAUTHORIZED
          )
        );

      const token = this.jwt.jwtoken(user);

      return ResponseHandler.Ok(res, { token, user });
    } catch (error: any) {
      console.log(error);
      return ResponseHandler.handleError(res, error);
    }
  };

  verifyCode = async (req: Request, res: Response) => {
    try {
      const { userid, code } = req.body;

      const status: StatusInterface | null = await StatusModel.findOne({
        userid: userid,
      });

      if (!status)
        return ResponseHandler.handleError(
          res,
          new CustomError("User not found", HttpStatus.NOT_FOUND)
        );

      if (status?.status === "verified")
        return ResponseHandler.handleError(
          res,
          new CustomError(
            "User is already verified",

            HttpStatus.CONFLICT
          )
        );

      const time =
        status!.updatedAt.getTime() === status!.createdAt.getTime() &&
        status?.status === "pending"
          ? (new Date().getTime() - status!.createdAt.getTime()) / 1000 // Diferience between seconds
          : (new Date().getTime() - status!.updatedAt.getTime()) / 1000; // Diferience between seconds

      console.log(time);
      // 4 minutes expiration
      if (time > 240)
        return ResponseHandler.handleError(
          res,
          new CustomError("Code expired", HttpStatus.CONFLICT)
        );

      const validateCode = await bcrypt.compare(code, status!.code);

      if (validateCode === false)
        return ResponseHandler.handleError(
          res,
          new CustomError("Invalid code", HttpStatus.CONFLICT)
        );

      await StatusModel.findByIdAndUpdate(
        status?._id,
        { status: "verified" },
        { new: true }
      );

      const user = await UserModel.findOne({ _id: userid });
      const token = this.jwt.jwtoken(user);

      return ResponseHandler.Ok(res, { token, user });
    } catch (error: any) {
      return ResponseHandler.handleError(res, error);
    }
  };

  resendCode = async (req: Request, res: Response) => {
    try {
      const { email, reset } = req.body;
      const user = await UserModel.findOne({ email: email });

      if (!user)
        return ResponseHandler.handleError(
          res,
          new CustomError(
            `User with email ${email} does not exist, please check your email and try again`,

            HttpStatus.NOT_FOUND
          )
        );

      const status = await StatusModel.findOne({ userid: user?._id });

      if (status?.status === "verified" && reset == false)
        return ResponseHandler.handleError(
          res,
          new CustomError(
            "User is already verified",

            HttpStatus.CONFLICT
          )
        );

      const mailstatus = await this.emails.sendEmail(req, status!._id);

      return ResponseHandler.Ok(res, {
        userId: user._id,
        message: `Code sent to ${mailstatus.accepted[0]}`,
      });
    } catch (error: any) {
      return ResponseHandler.handleError(res, error);
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { code, userid, password } = req.body;

      const status: StatusInterface | null = await StatusModel.findOne({
        userid: userid,
      });

      if (!status)
        return ResponseHandler.handleError(
          res,
          new CustomError("User not found", HttpStatus.NOT_FOUND)
        );

      const time =
        status!.updatedAt.getTime() === status!.createdAt.getTime() &&
        status?.status === "pending"
          ? (new Date().getTime() - status!.createdAt.getTime()) / 1000 // Diferience between seconds
          : (new Date().getTime() - status!.updatedAt.getTime()) / 1000; // Diferience between seconds

      if (time > 120)
        // 2 minutes
        return ResponseHandler.handleError(
          res,
          new CustomError("Code expired", HttpStatus.CONFLICT)
        );

      const validateCode = await bcrypt.compare(code, status!.code);

      if (validateCode === false)
        return ResponseHandler.handleError(
          res,
          new CustomError("Invalid code", HttpStatus.CONFLICT)
        );

      const salt = bcrypt.genSaltSync(12);
      const hash = bcrypt.hashSync(password, salt);

      const user = await UserModel.findOneAndUpdate(
        { _id: userid },
        { password: hash },
        { new: true }
      );

      return ResponseHandler.Ok(res, {
        message: `The user's password for ${user?.email} has been updated`,
      });
    } catch (error: any) {
      return ResponseHandler.handleError(res, error);
    }
  };
}
