import express, { urlencoded } from 'express';
import userRoutes from './routes/user.routes.js';
import startUpRoutes from './routes/startUp.routes.js';
import projectRoutes from './routes/project.router.js';
import taskRoutes from  './routes/task.route.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(cors());
   
app.use(express.json({ limit: '16kb' }));
app.use(urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());




// Use the routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/startups',startUpRoutes);
app.use('/api/v1/projects',projectRoutes);
app.use('/api/v1',taskRoutes)
export default app;