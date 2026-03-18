import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  weeks: string;
  tuition: number;
  minimumSkill: string;
  scholarshipAvailable: boolean;
  createdAt: Date;
  bootcamp: mongoose.Types.ObjectId;
}

const CourseSchema = new Schema<ICourse>({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add the duration of the bootcamp in weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
