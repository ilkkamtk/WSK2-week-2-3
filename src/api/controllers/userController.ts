// TODO: create the following functions:
// - userGet - get user by id
// - userListGet - get all users
// - userPost - create new user. Remember to hash password
// - userPutCurrent - update current user
// - userDeleteCurrent - delete current user
// - checkToken - check if current user token is valid: return data from res.locals.user as UserOutput. No need for database query

import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import CustomError from '../../classes/CustomError';
import {LoginUser, User, UserOutput} from '../../types/DBTypes';
import {LoginResponse, MessageResponse} from '../../types/MessageTypes';
import userModel from '../models/userModel';
import bcrypt from 'bcryptjs';

const userListGet = async (
  _req: Request,
  res: Response<UserOutput[]>,
  next: NextFunction
) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const userPost = async (
  req: Request<{}, {}, User>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const salt = bcrypt.genSaltSync(10);

    const userInput = {
      user_name: req.body.user_name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt),
      role: 'user',
    };

    const user = await userModel.create(userInput);
    console.log(user);
    res.status(201).json({message: 'User created'});
  } catch (error) {
    next(error);
  }
};

export {userListGet, userPost};
