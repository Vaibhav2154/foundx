import express, { urlencoded } from 'express';
import userRoutes from './routes/user.routes.js';
import startUpRoutes from './routes/startUp.routes.js';
import projectRoutes from './routes/project.router.js';
import taskRoutes from  './routes/task.route.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import ApiError from './utils/ApiError.js';

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'https://foundx.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json({ limit: '16kb' }));
app.use(urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());




// Use the routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/startups',startUpRoutes);
app.use('/api/v1/projects',projectRoutes);
app.use('/api/v1',taskRoutes)

// Global error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            errors: error.errors,
            statusCode: error.statusCode
        });
    }
    
    // Handle other errors
    console.error('Unhandled error:', error);
    return res.status(500).json({
        success: false,
        message: 'Internal server error',
        statusCode: 500
    });
});

export default app;