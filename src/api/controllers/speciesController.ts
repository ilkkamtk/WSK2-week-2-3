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
    const species = await SpeciesModel.find()
      .select('-__v')
      .populate('category', '-__v');
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
    const species = await SpeciesModel.findById(req.params.id)
      .select('-__v')
      .populate('category', '-__v');
    if (!species) {
      throw new CustomError('Species not found', 404);
    }
    res.json(species);
  } catch (error) {
    next(error);
  }
};

const speciesGetByBoundingBox = async (
  req: Request<{}, {}, {}, {topRight: string; bottomLeft: string}>,
  res: Response<Species[]>,
  next: NextFunction
) => {
  try {
    const {topRight, bottomLeft} = req.query;
    // query example: /species/area?topRight=40.73061,-73.935242&bottomLeft=40.71427,-74.00597
    // longitude first, then latitude (opposite of google maps)

    const rightCorner = topRight.split(',');

    const leftCorner = bottomLeft.split(',');

    const species = await SpeciesModel.find({
      location: {
        $geoWithin: {
          $box: [leftCorner, rightCorner],
        },
      },
    })
      .select('-__v')
      .populate('category', '-__v');
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
    console.log('type of coordinate', typeof req.body.location.coordinates[0]);
    req.body.location = {
      coordinates: [
        Number(req.body.location.coordinates[0]), // make sure it's a number
        Number(req.body.location.coordinates[1]),
      ],
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

export {
  speciesListGet,
  speciesGet,
  speciesGetByBoundingBox,
  speciesPost,
  speciesPut,
  speciesDelete,
};
