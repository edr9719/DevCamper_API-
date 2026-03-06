import { Request, Response } from 'express';

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
export const getBootcamps = (req: Request, res: Response): void => {
  res.status(200).json({ success: true, msg: 'Get all Bootcamps' });
};

//@desc Creates a bootcamp
//@route POST /api/v1/bootcamps
//@access Private
export const createBootcamp = (req: Request, res: Response): void => {
  res.status(200).json({ success: true, msg: 'Create a Bootcamp' });
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
export const editBootcamp = (req: Request, res: Response): void => {
  res.status(200).json({ success: true, msg: 'Edit a Bootcamp' });
};

//@desc Get a single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
export const getSingleBootcamp = (req: Request, res: Response): void => {
  res.status(200).json({ success: true, msg: 'Get single Bootcamp' });
};
