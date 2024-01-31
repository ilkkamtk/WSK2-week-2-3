// TODO: Controller for species model
import {Request, Response, NextFunction} from 'express';
import {PostMessage} from '../../types/MessageTypes';
import {Species} from '../../types/DBTypes';
import CustomError from '../../classes/CustomError';
import SpeciesModel from '../models/speciesModel';

const speciesListGet = async (
  _req: Request,
  res: Response<Species[]>,
  next: NextFunction
) => {
  try {
    const species = await SpeciesModel.find();
    res.json(species);
  } catch (error) {
    next(error);
  }
};

const speciesGet = async (
  req: Request<{id: string}>,
  res: Response<Species>,
  next: NextFunction
) => {
  try {
    const species = await SpeciesModel.findById(req.params.id);
    if (!species) {
      throw new CustomError('Species not found', 404);
    }
    res.json(species);
  } catch (error) {
    next(error);
  }
};

const speciesPost = async (
  req: Request<{}, {}, Omit<Species, '_id'>>,
  res: Response<PostMessage>,
  next: NextFunction
) => {
  try {
    req.body.location = {
      ...req.body.location,
      type: 'Point',
    };
    const species = await SpeciesModel.create(req.body);
    res.status(201).json({message: 'Species created', _id: species._id});
  } catch (error) {
    next(error);
  }
};

const speciesPut = async (
  req: Request<{id: string}, {}, Omit<Species, '_id'>>,
  res: Response<PostMessage>,
  next: NextFunction
) => {
  try {
    req.body.location = {
      ...req.body.location,
      type: 'Point',
    };

    const species = await SpeciesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );
    if (!species) {
      throw new CustomError('Species not found', 404);
    }
    res.json({message: 'Species updated', _id: species._id});
  } catch (error) {
    next(error);
  }
};

const speciesDelete = async (
  req: Request<{id: string}>,
  res: Response<PostMessage>,
  next: NextFunction
) => {
  try {
    const species = (await SpeciesModel.findByIdAndDelete(
      req.params.id
    )) as unknown as Species;
    if (!species) {
      throw new CustomError('Species not found', 404);
    }
    res.json({message: 'Species deleted', _id: species._id});
  } catch (error) {
    next(error);
  }
};

export {speciesListGet, speciesGet, speciesPost, speciesPut, speciesDelete};
