import * as dotenv from "dotenv";
import express from "express";
import { connect } from "mongoose";
dotenv.config();

export class DataBase {
  public app: express.Application = express();
  private port: number = parseInt(process.env.PORT!) || 8080;

  public connectDB = async () => {
    try {
      await connect(`${process.env.DATABASE}`);
      this.app.listen(this.port, () => {
        console.log(`Server open at http://localhost:${this.port} 🦊`);
      });
    } catch (error) {
      console.log(error);
    }
  };
}
