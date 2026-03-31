import express, { Express } from 'express';
import bootcamps from './routes/bootcamps';
import courses from './routes/courses';
import morgan from 'morgan';
import fileupload from 'express-fileupload';
import { errorHandler } from './middleware/error';
import { config } from './config';
import path from 'node:path';

const app: Express = express();

// Express 5 changed the default query parser to 'simple'; restore 'extended' (qs) to support nested bracket notation e.g. ?price[lte]=1000
app.set('query parser', 'extended');

// –– Global Middleware –– \\

// –– Express parse JSON –– \\
app.use(express.json());

// –– Dev Logging Middleware –– \\
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

//File uploading
app.use(fileupload());

//Set Static folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// –– Mount Routers –– \\
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// –– Error handling Middleware –– \\
//Note: Error handlers are called by Express automatically by looking for any middleware with "4 parameters"
app.use(errorHandler);

export default app;
