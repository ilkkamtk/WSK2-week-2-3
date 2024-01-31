// TODO: Controller for the Category model

import {Request, Response, NextFunction} from 'express';
import {PostMessage} from '../../types/MessageTypes';
import {Category} from '../../types/DBTypes';
import CategoryModel from '../models/categoryModel';
import CustomError from '../../classes/CustomError';

const categoryListGet = async (
  _req: Request,
  res: Response<Category[]>,
  next: NextFunction
) => {
  try {
    const categories = await CategoryModel.find();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const categoryGet = async (
  req: Request<{id: string}>,
  res: Response<Category>,
  next: NextFunction
) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      throw new CustomError('Category not found', 404);
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

const categoryPost = async (
  req: Request<{}, {}, Pick<Category, 'category_name'>>,
  res: Response<PostMessage>,
  next: NextFunction
) => {
  try {
    const category = await CategoryModel.create(req.body);
    res.status(201).json({message: 'Category created', _id: category._id});
  } catch (error) {
    next(error);
  }
};

const categoryPut = async (
  req: Request<{id: string}, {}, Pick<Category, 'category_name'>>,
  res: Response<PostMessage>,
  next: NextFunction
) => {
  try {
    const category = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!category) {
      throw new CustomError('Category not found', 404);
    }
    console.log(category);
    res.json({message: 'Category updated', _id: category._id});
  } catch (error) {
    next(error);
  }
};

export {categoryListGet, categoryGet, categoryPost};