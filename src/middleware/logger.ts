import { Request, Response, NextFunction } from 'express';

//@desc Logs request to console
export const logger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`,
  );
  next();
};
