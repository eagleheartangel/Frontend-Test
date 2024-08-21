import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../../shared/http.response";

// Solo como ejemplo xD
export class ArticleController {
  createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json({ message: "Article created successfully" });
    } catch (error: any) {
      return ResponseHandler.handleError(res, error);
    }
  };
}
