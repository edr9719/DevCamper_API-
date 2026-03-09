import { Request, Response } from 'express';
import { Bootcamp } from '../models/Bootcamp.model';

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
export const getBootcamps = async (req: Request, res: Response) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      success: true,
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
export const createBootcamp = async (req: Request, res: Response) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

//@desc Delete a bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access Private
export const deleteBootcamp = (req: Request, res: Response): void => {
  res.status(200).json({ success: true, msg: 'Delete a Bootcamp' });
};

//@desc Edit a bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Private
export const editBootcamp = async (req: Request, res: Response) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
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
    res.status(400).json({ success: false, error: error.message });
  }
};

//@desc Partially update a bootcamp (merge/add to existing)
//@route PATCH /api/v1/bootcamps/:id
//@access Private
export const patchBootcamp = async (req: Request, res: Response) => {
  try {
    let updateData = {};

    // If careers are being updated, add to existing instead of replacing
    if (req.body.careers) {
      updateData = {
        $addToSet: { careers: { $each: req.body.careers } },
      };
    } else {
      updateData = req.body;
    }
  } catch (error) {}
};

//@desc Get a single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
export const getSingleBootcamp = async (req: Request, res: Response) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

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
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
