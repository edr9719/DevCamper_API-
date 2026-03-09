import mongoose from 'mongoose';
import { config } from '../config';
import chalk from 'chalk';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoURI);
    console.log(chalk.bgMagenta(`MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    console.error(chalk.bgRed('Databse Connection failed:', error));
    process.exit(1);
  }
};
