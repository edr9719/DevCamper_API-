import express, { Router } from 'express';
import {
  getBootcamps,
  createBootcamp,
  deleteBootcamp,
  editBootcamp,
  getSingleBootcamp,
} from '../controllers/bootcampsControllers';

const router: Router = express.Router();

router.route('/').get(getBootcamps).post(createBootcamp);

router
  .route('/:id')
  .delete(deleteBootcamp)
  .get(getSingleBootcamp)
  .put(editBootcamp);

export default router;
