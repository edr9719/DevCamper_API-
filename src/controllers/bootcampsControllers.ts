import { NextFunction, Request, Response } from 'express';
import { Bootcamp } from '../models/Bootcamp.model';
import { ErrorResponse } from '../utils/errorResponse';

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
export const getBootcamps = async (req: Request, res: Response) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

//@desc Creates a bootcamp
//@route POST /api/v1/bootcamps
//@access Private
export const createBootcamp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error: any) {
    next(error);
  }
};

//@desc Delete a bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access Private
export const deleteBootcamp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return res
        .status(400)
        .json({ success: false, error: 'Bootcamp not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    next(error);
  }
};

//@desc Edit a bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Private
export const editBootcamp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let updateData: any = {};

    //Si careers está en el body, añadir sin duplicar
    if (req.body.careers) {
      const { careers, ...otherFields } = req.body;
      updateData.$addToSet = { careers: { $each: careers } };
      if (Object.keys(otherFields).length > 0) {
        updateData.$set = otherFields;
      }
    } else {
      // Si NO hay careers, actualización normal
      updateData = req.body;
    }

    const bootcamp = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: 'after', runValidators: true },
    );

    if (!bootcamp) {
      return res
        .status(400)
        .json({ success: false, error: 'Bootcamp not found' });
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error: any) {
    next(error);
  }
};

//@desc Get a single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
export const getSingleBootcamp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Bootcamp not found with id of ${req.params.id}`,
          404,
        ),
      );
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error: any) {
    next(error);
  }
};
