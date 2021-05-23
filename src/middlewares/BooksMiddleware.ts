import express from 'express';
import BooksService from '../service/booksService';

class BooksMiddleware {
  extractBookId = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      if (req.params.bookId) {
        req.body.id = req.params.bookId;
        return next();
      }
      return res.status(404).send('Invalid Book Id');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  };
  isValidId = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const book = await BooksService.getById(req.body.id);
      if (book) {
        return next();
      }
      return res.status(404).send('Invalid Book Id');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  };
}

export default new BooksMiddleware();
