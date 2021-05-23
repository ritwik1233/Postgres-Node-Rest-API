import express from 'express';

import { CommonRoutesConfig } from './commonRouteConfig';
import CollectionController from '../controllers/collectionController';
import UserMiddleware from '../middlewares/UserMiddleware';
import CollectionMiddleware from '../middlewares/CollectionMiddleware';

export class CollectionRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'CollectionRoutes');
  }

  configureRoutes() {
    this.app
      .route(`/collections`)
      .get(
        UserMiddleware.isLoggedIn,
        CollectionController.getCollectionByUserId
      );

    this.app
      .route(`/collection`)
      .post(UserMiddleware.isLoggedIn, CollectionController.createCollection);

    this.app.param(`collectionId`, CollectionMiddleware.extractCollectionId);

    this.app
      .route(`/collection/:collectionId`)
      .get(
        UserMiddleware.isLoggedIn,
        CollectionMiddleware.isValidId,
        CollectionMiddleware.isValidUser,
        CollectionController.getCollectionById
      )
      .put(
        UserMiddleware.isLoggedIn,
        CollectionMiddleware.isValidId,
        CollectionMiddleware.isValidUser,
        CollectionController.updateCollection
      )
      .delete(
        UserMiddleware.isLoggedIn,
        CollectionMiddleware.isValidId,
        CollectionMiddleware.isValidUser,
        CollectionController.deleteCollection
      );

    return this.app;
  }
}
