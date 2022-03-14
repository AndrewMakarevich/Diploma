require('dotenv').config();
import express from 'express';
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

const app = express();
// const pgModels = models;

const PORT = process.env.PORT || 5000;

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
        await sequelize.sync({ alter: true });
        RoleService.checkBaseRoles();
        dbCleaner();
        app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};
start();