import { NextFunction, Request, Response } from 'express';
import { Course } from '../models/Course.model';
import { ErrorResponse } from '../utils/errorResponse';
import { asyncHandler } from '../utils/asyncHandler';

//@desc Get all courses
//@route GET /api/v1/courses
//@access Public
export const getCourses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let query;

    if (req.params.bootcampId) {
      // Coming from /api/v1/bootcamps/:bootcampId/courses
      query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
      query = Course.find();
    }
    console.log(query);
    const courses = await query;

    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  },
);
