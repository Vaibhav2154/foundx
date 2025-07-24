import express, { urlencoded } from 'express';
import userRoutes from './routes/user.routes.js';
import startUpRoutes from './routes/startUp.routes.js';
import projectRoutes from './routes/project.router.js';
import taskRoutes from  './routes/task.route.js'
import healthRoutes from './routes/health.routes.js';
import fundRoutes from './routes/fund.routes.js';
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
app.use(express.json({ limit: '10mb' }));
app.use(urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));
app.use(cookieParser());

// Simple root health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'FoundX Backend API is running!',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Use the routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/startups',startUpRoutes);
app.use('/api/v1/projects',projectRoutes);
app.use('/api/v1',taskRoutes)
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/funds', fundRoutes);

app.use((error, req, res, next) => {
    if (error instanceof ApiError) {
        console.error('[ApiError]', {
            message: error.message,
            statusCode: error.statusCode,
            errors: error.errors,
            stack: error.stack,
            route: req.originalUrl,
            method: req.method,
            body: req.body,
            params: req.params,
            query: req.query
        });
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            errors: error.errors,
            statusCode: error.statusCode
        });
    }
    console.error('[Unhandled Error]', {
        message: error.message,
        stack: error.stack,
        route: req.originalUrl,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query
    });
    return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
        stack: error.stack,
        statusCode: 500
    });
});

export default app;