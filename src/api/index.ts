import express, {Request, Response} from 'express';
import categoryRoute from './routes/categoryRoute';
import speciesRoute from './routes/speciesRoute';
import animalRoute from './routes/animalRoute';
import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'animals api v1',
  });
});
router.use('/categories', categoryRoute);
router.use('/species', speciesRoute);
router.use('/animals', animalRoute);
router.use('/users', userRoute);
router.use('/auth', authRoute);

export default router;
