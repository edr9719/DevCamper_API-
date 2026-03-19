import { NextFunction, Request, Response } from 'express';
import { Course } from '../models/Course.model';
import { ErrorResponse } from '../utils/errorResponse';
import { Bootcamp } from '../models/Bootcamp.model';
import { asyncHandler } from '../utils/asyncHandler';

//@desc Get all courses
//@route GET /api/v1/courses
//@route GET /api/v1/bootcamps/:bootcampId/courses
//@access Public
export const getCourses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let query;

    if (req.params.bootcampId) {
      const bootcamp = await Bootcamp.findById(req.params.bootcampId);

      if (!bootcamp) {
        return next(
          new ErrorResponse(
            `Bootcamp not found with id of ${req.params.bootcampId}`,
            404,
          ),
        );
      }
      // Coming from /api/v1/bootcamps/:bootcampId/courses
      query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
      query = Course.find().populate({
        path: 'bootcamp',
        select: 'name description',
      });
    }

    const courses = await query;

    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  },
);

//@desc Get single course
//@route GET /api/v1/courses/:id
//@access Public
export const getSingleCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let query = Course.findById(req.params.id);

    //Select fields
    if (req.query.select) {
      const fields = (req.query.select as string).split(',').join(' ');
      //Mongoose's .select() tells MongoDB to only return specific fields from the document
      query = query.select(fields);
    }

    console.log(query);

    const course = await query;

    if (!course) {
      return next(
        new ErrorResponse(`Course not found with id of ${req.params.id}`, 404),
      );
    }

    res.status(200).json({ success: true, data: course });
  },
);

//@desc Create a course
//@route POST /api/v1/bootcamps/bootcampId/courses/
//@access Private
export const createCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const course = await Course.create(req.body);
    res.status(201).json({
      success: true,
      data: course,
    });
  },
);

//@desc Edit a course
//@route PUT /api/v1/courses/:id
//@access Private
export const editCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return next(
        new ErrorResponse(`Course with id: ${req.params.id} not found`, 404),
      );
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  },
);

//@desc Delete a course
//@route DELETE /api/v1/courses/:id
//@access Private
export const deleteCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(`Course not found with id of ${req.params.id}`, 404),
      );
    }
    res.status(200).json({ success: true, data: {} });
  },
);
