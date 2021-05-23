import { Books } from '../models/books';
import pool from '../dbsetup/dbSetup';

class BookService {
  async create(book: Books) {
    let client;
    try {
      client = await pool.connect();
      const text =
        'INSERT INTO books(name, description, genre) VALUES($1, $2, $3) RETURNING *';
      const values = Object.values(book);
      await client.query(text, values);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    } finally {
      if (client) {
        await client.release(true);
      }
    }
  }
  async list() {
    let client;
    let books;
    try {
      client = await pool.connect();
      const sql = 'SELECT * FROM books';
      const { rows } = await client.query(sql);
      books = rows;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    } finally {
      if (client) {
        await client.release(true);
      }
    }
    return books;
  }
  async getById(id: String) {
    let client;
    let book;
    try {
      client = await pool.connect();
      const text = `SELECT * FROM books WHERE id=$1`;
      const value = [id];
      const { rows } = await client.query(text, value);
      book = rows[0] ? rows : null;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    } finally {
      if (client) {
        await client.release(true);
      }
    }
    return book;
  }
  async update(id: String, data: Object) {
    let client;
    try {
      client = await pool.connect();
      const keys = Object.keys(data);
      const values = Object.values(data);
      const setOperations = [];
      let queryString = 'UPDATE books SET ';
      const queryValues = [];
      for (let i = 0; i < keys.length; i++) {
        setOperations.push(`${keys[i]} = $${setOperations.length + 1}`);
        queryValues.push(values[i]);
      }
      queryValues.push(id);
      queryString += setOperations.join(',');
      queryString += ` WHERE id=$${queryValues.length} `;
      await client.query(queryString, queryValues);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    } finally {
      if (client) {
        await client.release(true);
      }
    }
  }
  async delete(id: String) {
    let client;
    try {
      client = await pool.connect();
      const query = 'DELETE FROM books WHERE id=$1';
      const values = [id];
      await client.query(query, values);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    } finally {
      if (client) {
        await client.release(true);
      }
    }
  }
}

export default new BookService();
