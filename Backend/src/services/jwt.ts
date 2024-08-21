import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export class JWT {
  jwtoken = (user: any) => {
    const payload: { [key: string]: string } = {
      uid: user._id,
      active: user.active,
    };
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "8h",
    });
  };
}
