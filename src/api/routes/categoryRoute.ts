import express from 'express';
import {
  categoryPost,
  categoryListGet,
  categoryGet,
  categoryPut,
} from '../controllers/categoryController';

const router = express.Router();

router.route('/').get(categoryListGet).post(categoryPost);

router.route('/:id').get(categoryGet).put(categoryPut);

export default router;
