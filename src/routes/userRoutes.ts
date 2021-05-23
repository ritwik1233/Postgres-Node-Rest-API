import express from 'express';

import { CommonRoutesConfig } from './commonRouteConfig';
import UserController from '../controllers/userController';
import UserMiddleware from '../middlewares/UserMiddleware';

export class UserRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'UserRoutes');
  }
  configureRoutes() {
    this.app
      .route(`/login`)
      .post(
        UserMiddleware.isValidUser,
        UserMiddleware.initializeUserSession,
        UserController.getByUserId
      );

    this.app
      .route(`/register`)
      .post(
        UserMiddleware.validateUserData,
        UserMiddleware.assignAdmin,
        UserController.createUser
      );

    this.app
      .route(`/logout`)
      .get(UserMiddleware.isLoggedIn, UserController.logoutUser);
    return this.app;
  }
}
