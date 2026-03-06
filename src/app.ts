import express, { Express } from 'express';
import bootcamps from './routes/bootcamps';
import morgan from 'morgan';
import { config } from './config';

const app: Express = express();

// –– Global Middleware –– \\

app.use(express.json()); //Enables Express to parse incoming request bodies as JSON

// –– Dev Logging Middleware –– \\
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// –– Mount Routers –– \\
app.use('/api/v1/bootcamps', bootcamps);

export default app;
