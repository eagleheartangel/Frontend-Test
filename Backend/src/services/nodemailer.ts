import { Request } from "express";
import { ObjectId } from "mongodb";
import * as dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import OtoCodeGenerator from "otp-generator";
import StatusModel from "../models/user-models/status.model";
import UserModel from "../models/user-models/user.model";
dotenv.config();

export class EmailsClass {
  sendEmail = async (req: Request, id: ObjectId): Promise<any> => {
    try {
      const { reset } = req.body;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.PASSWORD_EMAIL,
        },
        tls: {
          ciphers: "TLSv1.2",
          rejectUnauthorized: false, // Para evitar problemas con certificados autofirmados
        },
      });

      const code = OtoCodeGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      let salt = bcrypt.genSaltSync(12);
      let hashCode = bcrypt.hashSync(code, salt);

      const setStatus = reset == true ? "Verified" : "Pending";

      const status = await StatusModel.findByIdAndUpdate(
        id,
        { code: hashCode, status: setStatus },
        { new: true }
      );

      const user = await UserModel.findOne({ _id: status?.userid });

      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user?.email,
        subject: `Miguel's verification step`,
        text: `This is your verification code: ${code}`,
      };

      const result = await transporter.sendMail(mailOptions);

      return Promise.resolve(result);
    } catch (error: Error | any) {
      throw error;
    }
  };
}
