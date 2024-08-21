import { Response } from 'express';

export enum HttpStatus {
  OK = 200,
  NOT_FOUND = 404,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(`${message}`);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class ResponseHandler {
  static async tryCatch<T>(func: () => Promise<T>, res: Response): Promise<T> {
    try {
      return await func();
    } catch (error: any) {
      throw new CustomError(error.message);
    }
  }

  static handleError(res: Response, error: CustomError): Response {
    const statusCode = error.statusCode
      ? error.statusCode
      : HttpStatus.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      status: statusCode,
      error: { name: error.name, message: error.message },
    });
  }

  static Ok(res: Response, data?: any): Response {
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: data,
    });
  }
}
