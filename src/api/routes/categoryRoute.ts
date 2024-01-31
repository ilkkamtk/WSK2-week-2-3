import express from 'express';
import {
  categoryPost,
  categoryListGet,
  categoryGet,
  categoryPut,
  categoryDelete,
} from '../controllers/categoryController';

const router = express.Router();

router.route('/').get(categoryListGet).post(categoryPost);

router.route('/:id').get(categoryGet).put(categoryPut).delete(categoryDelete);

export default router;
