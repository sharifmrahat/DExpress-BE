import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

import { Prisma } from '@prisma/client';
import { IGenericErrorMessage, IGenericErrorResponse } from '../../interface/error'
import handleValidationError from '../../errors/handle-validation-error'
import handleClientError from '../../errors/handle-client-error'
import ApiError from '../../errors/api-error'
import { ZodError } from 'zod';
import handleZodError from '../../errors/handle-zod-error'

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let statusCode = 500;
  let message = 'Something went wrong !';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handleClientError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }else if (error instanceof ZodError) {
    const simplifiedError: IGenericErrorResponse = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
        {
          path: '',
          message: error?.message,
        },
      ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
        {
          path: '',
          message: error?.message,
        },
      ]
      : [];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack:  error?.stack 
  });
};

export default globalErrorHandler;