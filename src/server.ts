import app from './app';
import { config } from './config';
import { connectDB } from './config/db';
import chalk from 'chalk';

const startServer = async () => {
  try {
    //Connect to dabase first
    await connectDB();

    //Then start the server
    const server = app.listen(config.port, () => {
      console.log(
        chalk.bgGreen.bold(
          `Server running in ${config.nodeEnv} mode on port ${config.port}`,
        ),
      );
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: Error) => {
      console.log(chalk.bgRed(`Error: ${err.message}`));
      // Close server & exit gracefully
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(chalk.bgRed(`Failed to start`));
    process.exit(1);
  }
};

startServer();
