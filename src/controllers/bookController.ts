import express from 'express';
import BookService from '../service/booksService';
import collectionService from '../service/collectionService';

class BooksController {
  async createBook(req: express.Request, res: express.Response) {
    try {
      await BookService.create(req.body);
      return res.status(201).send('Book creation successfull');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  }

  async getBooks(req: express.Request, res: express.Response) {
    try {
      const books = await BookService.list();
      return res.status(200).send(books);
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  }

  async getBookById(req: express.Request, res: express.Response) {
    try {
      const bookId = req.body.id;
      const book = await BookService.getById(bookId);
      return res.status(200).send(book);
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  }

  async updateBook(req: express.Request, res: express.Response) {
    try {
      const bookId = req.body.id;
      const updatedBookData = req.body;
      delete updatedBookData._id;
      await BookService.update(bookId, updatedBookData);
      return res.status(200).send('Book updated');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  }
  async deleteBook(req: express.Request, res: express.Response) {
    try {
      const bookId = req.body.id;
      const collections = await collectionService.listByBookId(bookId);
      await BookService.delete(bookId);
      // update the collections which consists of this book
      if (collections) {
        for (let i = 0; i < collections.length; i++) {
          const updatedBooks = collections[i].books.filter(
            (id) => id !== bookId
          );
          await collectionService.update(collections[i].id, {
            books: updatedBooks
          });
        }
      }
      return res.status(200).send('Books Delete Successfull');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  }
}

export default new BooksController();
