import express from 'express';
import {
  categoryPost,
  categoryListGet,
  categoryGet,
  categoryPut,
  categoryDelete,
} from '../controllers/categoryController';
import {body, param} from 'express-validator';
import {validationErrors} from '../../middlewares';

const router = express.Router();

router
  .route('/')
  .get(categoryListGet)
  .post(
    body('category_name').notEmpty().isString().escape(),
    validationErrors,
    categoryPost
  );

router
  .route('/:id')
  .get(param('id').isMongoId(), validationErrors, categoryGet)
  .put(
    param('id').isMongoId(),
    body('category_name').notEmpty().isString().escape(),
    validationErrors,
    categoryPut
  )
  .delete(param('id').isMongoId(), validationErrors, categoryDelete);

export default router;
