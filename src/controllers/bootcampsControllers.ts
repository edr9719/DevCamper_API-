import { NextFunction, Request, Response } from 'express';
import { Bootcamp } from '../models/Bootcamp.model';
import { ErrorResponse } from '../utils/errorResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { geocoder } from '../utils/geoCoder';

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
export const getBootcamps = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let query;

    let queryString = JSON.stringify(req.query);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );
    query = Bootcamp.find(JSON.parse(queryString));

    const bootcamps = await query;
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  },
);

//@desc Creates a bootcamp
//@route POST /api/v1/bootcamps
//@access Private
export const createBootcamp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  },
);

//@desc Delete a bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access Private
export const deleteBootcamp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return res
        .status(400)
        .json({ success: false, error: 'Bootcamp not found' });
    }
    res.status(200).json({ success: true, data: {} });
  },
);

//@desc Edit a bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Private
export const editBootcamp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
  },
);

//@desc Get a single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
export const getSingleBootcamp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
  },
);

//@desc Get bootcamps within a radius
//@route GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access Public
export const getBootcampsInRadius = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const zipcode = req.params.zipcode as string;
    const distance = parseFloat(req.params.distance as string);

    //Get lat/lng from Geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //Calculate radius using radians
    //Divide distance by radius of Earth
    //Earth Radius = 3,963 mi / 6,378 km

    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
      location: {
        $geoWithin: { $centerSphere: [[lng ?? 0, lat ?? 0], radius] },
      },
    });

    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  },
);
