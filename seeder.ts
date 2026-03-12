import fs from 'fs';
import mongoose from 'mongoose';
import chalk from 'chalk';
import { config } from './src/config/index';
import { Bootcamp } from './src/models/Bootcamp.model';

//Connect to DB
mongoose.connect(config.mongoURI);

//Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'),
);

//Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);

    console.log(chalk.green.inverse('Data Imported...'));
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

//Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();

    console.log(chalk.red.inverse('Data Destroyed...'));
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
