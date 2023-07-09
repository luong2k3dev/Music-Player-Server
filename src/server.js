const express = require('express');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const routes = require('./routes/v1/index.route');
const ApiError = require('./utils/ApiError');
const { errorConverter, errorHandler } = require('./middlewares/error');
const config = require('./config/config');

const app = express();

app.use(express.json());

mongoose
    .connect(config.mongoose.url)
    .then(() => console.log('Connect database successfully'))
    .catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/v1', routes);

app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);

app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
});
