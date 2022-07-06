require('dotenv').config();
import express from 'express';
import ws from "ws";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload'
import path from 'path';
import models from './models/models';
import sequelize from './db';
import mainRouter from './routes';
import errorMiddleware from './middlewares/errorMiddleware';
import RoleService from './services/roleService';
import dbCleaner from './cleaner';
import webSocketServer from './websocket';

const app = express();

const mainPort = process.env.MAIN_PORT || 5000;

app.use(cors(
    {
        origin: process.env.FRONT_LINK,
        credentials: true
    }
));

app.use(fileUpload({}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(cookieParser());
app.use('/api', mainRouter);
app.use(errorMiddleware);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        RoleService.checkBaseRoles();
        dbCleaner();
        const mainServer = app.listen(mainPort, () => console.log(`Server started at port ${mainPort}`));
        webSocketServer(mainServer);
    } catch (e) {
        console.log(e);
    }
};
start();