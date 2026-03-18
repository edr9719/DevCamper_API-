import express, { Router } from 'express';
import { getCourses } from '../controllers/coursesControllers';

const router: Router = express.Router({ mergeParams: true });

router.route('/').get(getCourses);

export default router;
