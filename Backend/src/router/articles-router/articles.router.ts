import { ArticleController } from "../../controllers/articles-controllers/article.controller";
import { BaseRouter } from "../base.router";

export class ArticleRouter extends BaseRouter<ArticleController> {
  constructor() {
    super(ArticleController);
  }
  routes() {
    this.router.post("/article", (req, res, next) =>
      this.controller.createArticle(req, res, next)
    );
  }
}
