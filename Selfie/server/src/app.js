import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import dbConnection from '../src/api/database/config.js';

import authRouter from '../src/api/controllers/auth.js';
import eventsRouter from '../src/api/controllers/events.js';
import notesRouter from '../src/api/controllers/notes.js';
import tasksRouter from '../src/api/controllers/tasks.js';

dotenv.config();

(async () => {
    try {
        await dbConnection();

        const app = express();
        const PORT = process.env.PORT || 3000;

        app.use(cors());
        app.use(express.json());
        app.use(express.static('public'));

        app.use('/api/auth', authRouter);
        app.use('/api/events', eventsRouter);
        app.use('/api/notes', notesRouter);
        app.use('/api/tasks', tasksRouter);

        app.get('/*', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });

        app.use((req, res, next) => {
            console.log(`Incoming request: ${req.method} ${req.path}`);
            next();
        });

    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
    }
})();
