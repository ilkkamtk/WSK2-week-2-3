// TODO: Route for animals
import express from 'express';
import {
  animalListGet,
  animalGet,
  animalPost,
  animalPut,
  animalDelete,
} from '../controllers/animalController';
import {body, param} from 'express-validator';
import {authenticate, validationErrors} from '../../middlewares';

const router = express.Router();

router
  .route('/')
  .get(animalListGet)
  .post(
    authenticate,
    body('animal_name').notEmpty().isString().escape(),
    validationErrors,
    animalPost
  );

router
  .route('/:id')
  .get(param('id').isMongoId(), validationErrors, animalGet)
  .put(
    param('id').isMongoId(),
    body('animal_name').notEmpty().isString().escape(),
    validationErrors,
    animalPut
  )
  .delete(
    authenticate,
    param('id').isMongoId(),
    validationErrors,
    animalDelete
  );

export default router;
