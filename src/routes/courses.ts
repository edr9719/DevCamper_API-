import express, { Router } from 'express';
import {
  getCourses,
  deleteCourse,
  getSingleCourse,
  createCourse,
  editCourse,
} from '../controllers/coursesControllers';

const router: Router = express.Router({ mergeParams: true });

router.route('/').get(getCourses).post(createCourse);
router.route('/:id').get(getSingleCourse).put(editCourse).delete(deleteCourse);

export default router;
