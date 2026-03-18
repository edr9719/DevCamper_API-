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

    //Copy of req.query so req.query stays untouched and only the copy gets modified.
    const reqQuery = { ...req.query };

    //Fields To Exclude
    const removeFields = ['select', 'sort', 'limit', 'page'];

    //Loop over removeFields and delete from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    //Create query string
    let queryString = JSON.stringify(reqQuery);

    //Create operators ($gt, $gte, etc)
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );

    //Finding Resource
    query = Bootcamp.find(JSON.parse(queryString));

    //Select fields
    if (req.query.select) {
      const fields = (req.query.select as string).split(',').join(' ');
      //Mongoose's .select() tells MongoDB to only return specific fields from the document
      query = query.select(fields);
    }

    //Sort
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //Pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    //Page 1 → skip 0, Page 2 → skip 10, Page 3 → skip 20, etc.
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //Executing query
    const bootcamps = await query;

    //Pagination result
    const pagination: {
      next?: { page: number; limit: number };
      prev?: { page: number; limit: number };
    } = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
      pagination,
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
