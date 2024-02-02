import express from 'express';
import {userListGet, userPost} from '../controllers/userController';
import {body} from 'express-validator';
import {validationErrors} from '../../middlewares';

const router = express.Router();

router
  .route('/')
  .get(userListGet)
  .post(
    body('user_name').notEmpty().isString().escape(),
    body('password').notEmpty().isString().escape(),
    body('email').notEmpty().isEmail(),
    validationErrors,
    userPost
  );

export default router;
