import express from "express";
import morgan from "morgan";
import cors from "cors";

import { DataBase } from "./database/server";
import { AuthRouter } from "./router/user-routes/auth.router";
import { UserRouter } from "./router/user-routes/user.router";
import { Setup } from "./libs/setup";
import { ArticleRouter } from "./router/articles-router/articles.router";

class App extends DataBase {
  public app: express.Application = express();
  private authRoutes = new AuthRouter().router;
  private userRoutes = new UserRouter().router;
  private articleRoutes = new ArticleRouter().router;

  constructor(private readonly init: Setup = new Setup()) {
    super();
    this.middlewares();
    this.app.use("/api", this.routes());
    this.connectDB();
    this.init.setup();
  }

  middlewares(): void {
    this.app.use(morgan("dev"));

    this.app.use(
      cors({ origin: "*", methods: ["GET", "POST", "DELETE", "PUT"] })
    );

    this.app.use(express.urlencoded({ extended: false }));

    this.app.use(express.json());
  }

  routes(): express.Router[] {
    return [this.authRoutes, this.articleRoutes, this.userRoutes];
  }
}

new App();
