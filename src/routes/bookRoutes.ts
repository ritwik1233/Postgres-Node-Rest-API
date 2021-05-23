import express from 'express';

import { CommonRoutesConfig } from './commonRouteConfig';
import BooksController from '../controllers/bookController';
import UserMiddleware from '../middlewares/UserMiddleware';
import BooksMiddleware from '../middlewares/BooksMiddleware';

export class BooksRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'BooksRoutes');
  }

  configureRoutes() {
    this.app.route(`/books`).get(BooksController.getBooks);
    this.app
      .route(`/book`)
      .post(UserMiddleware.isAdmin, BooksController.createBook);
    this.app.param(`bookId`, BooksMiddleware.extractBookId);
    this.app
      .route(`/book/:bookId`)
      .get(BooksMiddleware.isValidId, BooksController.getBookById)
      .put(
        UserMiddleware.isAdmin,
        BooksMiddleware.isValidId,
        BooksController.updateBook
      )
      .delete(
        UserMiddleware.isAdmin,
        BooksMiddleware.isValidId,
        BooksController.deleteBook
      );

    return this.app;
  }
}
