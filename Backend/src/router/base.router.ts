import { Router } from "express";

export class BaseRouter<T> {
  public router: Router;
  public controller: T;
  constructor(controller: { new (): T }) {
    this.router = Router();
    this.controller = new controller();
    this.routes();
  }

  routes() {}
}
