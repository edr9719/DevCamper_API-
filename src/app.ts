import express, { Express } from 'express';
import bootcamps from './routes/bootcamps';
import morgan from 'morgan';
import { errorHandler } from './middleware/error';
import { config } from './config';

const app: Express = express();

// –– Global Middleware –– \\

// –– Express parse JSON –– \\
app.use(express.json());

// –– Dev Logging Middleware –– \\
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// –– Mount Routers –– \\
app.use('/api/v1/bootcamps', bootcamps);

// –– Error handling Middleware –– \\
//Note: Error handlers are called by Express automatically by looking for any middleware with "4 parameters"
app.use(errorHandler);

export default app;
