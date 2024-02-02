// TODO: Controller for the Animal model
import {Request, Response, NextFunction} from 'express';
import {PostMessage} from '../../types/MessageTypes';
import {Animal} from '../../types/DBTypes';
import CustomError from '../../classes/CustomError';
import AnimalModel from '../models/animalModel';

const animalListGet = async (
  _req: Request,
  res: Response<Animal[]>,
  next: NextFunction
) => {
  try {
    const animals = await AnimalModel.find()
      .select('-__v')
      .populate({
        path: 'species',
        select: '-__v',
        populate: {
          path: 'category',
          select: '-__v',
        },
      });
    res.json(animals);
  } catch (error) {
    next(error);
  }
};

const animalGet = async (
  req: Request<{id: string}>,
  res: Response<Animal>,
  next: NextFunction
) => {
  try {
    const animal = await AnimalModel.findById(req.params.id)
      .select('-__v')
      .populate({
        path: 'species',
        select: '-__v',
        populate: {
          path: 'category',
          select: '-__v',
        },
      });
    if (!animal) {
      throw new CustomError('Animal not found', 404);
    }
    res.json(animal);
  } catch (error) {
    next(error);
  }
};

const animalPost = async (
  req: Request<{}, {}, Omit<Animal, '_id'>>,
  res: Response<PostMessage>,
  next: NextFunction
) => {
  try {
    const animal = await AnimalModel.create(req.body);
    res.status(201).json({message: 'Animal created', _id: animal._id});
  } catch (error) {
    next(error);
  }
};

const animalPut = async (
  req: Request<{id: string}, {}, Omit<Animal, '_id'>>,
  res: Response<PostMessage>,
  next: NextFunction
) => {
  try {
    const animal = await AnimalModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );
    if (!animal) {
      throw new CustomError('Animal not found', 404);
    }
    res.json({message: 'Animal updated', _id: animal._id});
  } catch (error) {
    next(error);
  }
};

const animalDelete = async (
  req: Request<{id: string}>,
  res: Response<PostMessage>,
  next: NextFunction
) => {
  try {
    const animal = (await AnimalModel.findByIdAndDelete(
      req.params.id
    )) as unknown as Animal;
    if (!animal) {
      throw new CustomError('Animal not found', 404);
    }
    res.json({message: 'Animal deleted', _id: animal._id});
  } catch (error) {
    next(error);
  }
};

export {animalListGet, animalGet, animalPost, animalPut, animalDelete};
