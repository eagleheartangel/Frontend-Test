import { UserController } from "../../controllers/user-controllers/user.controller";
import { BaseRouter } from "../base.router";
import { validateJWT, validateAdminJWT } from "../../middlewares/validate-jwt";

export class UserRouter extends BaseRouter<UserController> {
  constructor() {
    super(UserController);
  }

  routes() {
    // this.router.get("/users", validateJWT, (req, res) =>
    //   this.controller.getUsers(req, res)
    // );
    this.router.get("/users", validateJWT, (req, res) =>
      this.controller.getPaginatedUsers(req, res)
    );
    this.router.get("/user/:id", validateJWT, (req, res) =>
      this.controller.getUserById(req, res)
    );
    this.router.put("/user/:id", validateJWT, (req, res) =>
      this.controller.updateUser(req, res)
    );
    this.router.delete("/user/:id", validateJWT, (req, res) =>
      this.controller.deleteUser(req, res)
    );
    this.router.get("/users/:status", validateAdminJWT, (req, res) =>
      this.controller.getUsersByStatus(req, res)
    );
  }
}
