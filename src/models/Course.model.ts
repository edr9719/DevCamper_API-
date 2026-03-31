import chalk from 'chalk';
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

//Finds all courses belonging to a specific bootcamp
//Calculates the average tuition across those courses
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  try {
    const obj = await this.aggregate([
      { $match: { bootcamp: bootcampId } },
      {
        $group: {
          _id: '$bootcamp',
          averageCost: { $avg: '$tuition' },
        },
      },
    ]);

    await mongoose.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: obj.length > 0 ? Math.ceil(obj[0].averageCost / 10) * 10 : 0,
    });
  } catch (error) {
    console.error(error);
  }
};

//Call getAverageCost after save
CourseSchema.post('save', function () {
  (this.constructor as any).getAverageCost(this.bootcamp);
});

//Save bootcamp ID before delete so it's available in post hook
CourseSchema.pre(
  'deleteOne',
  { document: true, query: false },
  function (this: ICourse) {
    (this as any)._bootcampId = this.bootcamp;
  },
);

//Call getAverageCost after remove
CourseSchema.post(
  'deleteOne',
  { document: true, query: false },
  function (this: ICourse) {
    (this.constructor as any).getAverageCost((this as any)._bootcampId);
  },
);

//Make title unique
CourseSchema.index({ title: 1, bootcamp: 1 }, { unique: true });

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
