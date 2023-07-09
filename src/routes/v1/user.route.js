const express = require('express');
const { userController } = require('../../controllers/index.controller');

const userRouter = express.Router();

userRouter
    .route('/')
    .get(userController.getUsers)
    .post(userController.createUser);

userRouter
    .route('/:userId')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = userRouter;
