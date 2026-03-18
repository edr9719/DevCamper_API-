import express, { Router } from 'express';
import courses from '../routes/courses';
import {
  getBootcamps,
  createBootcamp,
  deleteBootcamp,
  editBootcamp,
  getSingleBootcamp,
  getBootcampsInRadius,
} from '../controllers/bootcampsControllers';

const router: Router = express.Router();

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/').get(getBootcamps).post(createBootcamp);

router
  .route('/:id')
  .delete(deleteBootcamp)
  .get(getSingleBootcamp)
  .put(editBootcamp);

//Courses Route
router.use('/:bootcampId/courses', courses);

export default router;
