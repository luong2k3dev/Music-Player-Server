const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const httpStatus = require('http-status');
const routes = require('./routes/v1/index.route');
const ApiError = require('./utils/ApiError');
const { errorConverter, errorHandler } = require('./middlewares/error');

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
const mongoURI =
    process.env.DB_URL || 'mongodb://127.0.0.1:27017/btl-nodejs-hit';

mongoose
    .connect(mongoURI)
    .then(() => console.log('Connect database successfully!'))
    .catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// app.use('/v1', routes);

app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
