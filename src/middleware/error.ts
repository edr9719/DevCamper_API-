import chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';
import { ErrorResponse } from '../utils/errorResponse';

interface AppError extends Error {
  statusCode?: number;
  value?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = { ...err };
  error.message = err.message;

  //log to console for dev
  console.log(err);
  console.log(chalk.red(err.stack));

  //Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Bootcamp not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(', ');
    error = new ErrorResponse(message, 400);
  }
  //Duplicate name error when creating a bootcamp
  if ((err as any).code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
};
