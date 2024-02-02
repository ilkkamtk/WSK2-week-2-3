import {NextFunction, Request, Response} from 'express';
import imageFromWikipedia from './functions/imageFromWikipedia';
import {ErrorResponse} from './types/MessageTypes';
import CustomError from './classes/CustomError';
import {validationResult} from 'express-validator';
import {LoginUser, Species} from './types/DBTypes';
import jwt from 'jsonwebtoken';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // console.log('errorhanler', err);
  const statusCode = err.status !== 200 ? err.status || 500 : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const getWikiImage = async (
  req: Request<{}, {}, Omit<Species, '_id'>>,
  _res: Response,
  next: NextFunction
) => {
  try {
    const {species_name} = req.body;
    if (!species_name) {
      next();
    }
    const image = await imageFromWikipedia(species_name);
    req.body.image = image;
    next();
  } catch (error) {
    next(error);
  }
};

const validationErrors = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }
  next();
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearer = req.headers.authorization;
    if (!bearer) {
      next(new CustomError('No token provided', 401));
      return;
    }

    const token = bearer.split(' ')[1];

    if (!token) {
      next(new CustomError('No token provided', 401));
      return;
    }

    const tokenContent = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as LoginUser;

    // check if user exists in database (optional)
    // const user = await userModel.findById(tokenContent._id);

    // if (!user) {
    //   next(new CustomError('Token not valid', 403));
    //   return;
    // }

    // add user to req locals to be used in other middlewares / controllers
    res.locals.user = tokenContent;

    next();
  } catch (error) {
    next(new CustomError((error as Error).message, 400));
  }
};

export {notFound, errorHandler, getWikiImage, validationErrors, authenticate};
