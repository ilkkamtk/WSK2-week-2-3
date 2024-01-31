// TODO: route for species
import express from 'express';
import {
  speciesListGet,
  speciesGet,
  speciesPost,
  speciesPut,
  speciesDelete,
} from '../controllers/speciesController';
import {body, param} from 'express-validator';
import {getWikiImage, validationErrors} from '../../middlewares';

const router = express.Router();

router
  .route('/')
  .get(speciesListGet)
  .post(
    body('species_name').notEmpty().isString().escape(),
    getWikiImage,
    body('category').notEmpty().isMongoId(),
    body('location').notEmpty().isObject(),
    body('location.coordinates').notEmpty().isArray(),
    body('location.coordinates.*').isNumeric(),
    body('image').notEmpty().isString(),
    validationErrors,
    speciesPost
  );

router
  .route('/:id')
  .get(param('id').isMongoId(), validationErrors, speciesGet)
  .put(
    param('id').isMongoId(),
    body('species_name').optional().isString().escape(),
    getWikiImage,
    body('category').optional().isMongoId(),
    body('image').optional().isString(),
    body('location').optional().isObject(),
    body('location.coordinates').optional().isArray(),
    body('location.coordinates.*').optional().isNumeric(),
    validationErrors,
    speciesPut
  )
  .delete(param('id').isMongoId(), validationErrors, speciesDelete);

export default router;
