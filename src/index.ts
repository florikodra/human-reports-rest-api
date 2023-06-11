import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import { setupSwagger } from "./swagger";
import router from './router';
import mongoose from 'mongoose';

const app = express();
require('dotenv').config();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
setupSwagger(app);


// Database setup
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on('error', (error: Error) => console.log(error));

// Routes
app.use('/api/', router());

const server = http.createServer(app);
server.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on http://localhost:${process.env.SERVER_PORT}`);
});
    