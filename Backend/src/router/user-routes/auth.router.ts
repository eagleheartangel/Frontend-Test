import { AuthController } from '../../controllers/user-controllers/auth.controller';
import { BaseRouter } from '../base.router';

export class AuthRouter extends BaseRouter<AuthController> {
  constructor() {
    super(AuthController);
  }
  routes() {
    this.router.post('/signup', (req, res) => this.controller.signup(req, res));
    this.router.post('/signin', (req, res) => this.controller.signin(req, res));
    this.router.post('/code', (req, res) =>
      this.controller.verifyCode(req, res)
    );
    this.router.post('/resend-code', (req, res) =>
      this.controller.resendCode(req, res)
    );
    this.router.post('/reset-password', (req, res) =>
      this.controller.resetPassword(req, res)
    );
  }
}
