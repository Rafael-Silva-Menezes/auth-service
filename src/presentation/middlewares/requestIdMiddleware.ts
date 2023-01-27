import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

interface IRequestWithTraceId extends Request {
  requestId: string;
}

export const requestIdMiddleware = (
  req: IRequestWithTraceId,
  res: Response,
  next: NextFunction,
) => {
  req.requestId = uuidv4();
  next();
};
