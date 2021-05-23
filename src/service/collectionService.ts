import { Collections } from '../models/collections';
import pool from '../dbsetup/dbSetup';

class CollectionService {
  async create(collection: Collections) {
    let client;
    try {
      client = await pool.connect();
      const text =
        'INSERT INTO collections(name, books, createdby) VALUES($1, $2, $3) RETURNING *';
      const values = Object.values(collection);
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
  async listByUserId(userId: String) {
    let client;
    let collection;
    try {
      client = await pool.connect();
      const text = `SELECT * FROM collections WHERE createdby=$1`;
      const value = [userId];
      const { rows } = await client.query(text, value);
      collection = rows[0] ? rows : null;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    } finally {
      if (client) {
        await client.release(true);
      }
    }
    return collection;
  }
  async listByBookId(bookId: String) {
    let client;
    let collection;
    try {
      client = await pool.connect();
      const text = `SELECT * FROM collections WHERE $1 = any (books)`;
      const value = [bookId];
      const { rows } = await client.query(text, value);
      collection = rows[0] ? rows : null;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    } finally {
      if (client) {
        await client.release(true);
      }
    }
    return collection;
  }
  async getById(id: String) {
    let client;
    let collection;
    try {
      client = await pool.connect();
      const text = `SELECT * FROM collections WHERE id=$1`;
      const value = [id];
      const { rows } = await client.query(text, value);
      collection = rows[0] ? rows : null;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    } finally {
      if (client) {
        await client.release(true);
      }
    }
    return collection;
  }
  async update(id: String, data: Object) {
    let client;
    try {
      client = await pool.connect();
      const keys = Object.keys(data);
      const values = Object.values(data);
      const setOperations = [];
      let queryString = 'UPDATE collections SET ';
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
      const query = 'DELETE FROM collections WHERE id=$1';
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

export default new CollectionService();
