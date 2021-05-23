import { Users } from '../models/users';
import pool from '../dbsetup/dbSetup';

class UserService {
  async create(user: Users) {
    let client;
    try {
      client = await pool.connect();
      const text =
        'INSERT INTO users(name, email, password, isadmin) VALUES($1, $2, $3, $4) RETURNING *';
      const values = Object.values(user);
      await client.query(text, values);
    } catch (error) {
      console.log(error);
    } finally {
      if (client) {
        await client.release(true);
      }
    }
  }
  async listAll() {
    let client;
    let users;
    try {
      client = await pool.connect();
      const sql = 'SELECT id, name, email FROM users';
      const { rows } = await client.query(sql);
      users = rows;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      if (client) {
        await client.release(true);
      }
    }
    return users;
  }
  async getById(id: String) {
    let client;
    let user;
    try {
      client = await pool.connect();
      const text = `SELECT id, name, email, isadmin FROM users WHERE id=$1`;
      const value = [id];
      const { rows } = await client.query(text, value);
      user = rows[0] ? rows : null;
    } catch (error) {
      console.log(error);
      return [];
    } finally {
      if (client) {
        await client.release(true);
      }
    }
    return user;
  }
  async getByLoginDetails(email: String, password?: String) {
    let client;
    let user;
    try {
      client = await pool.connect();
      let text = 'SELECT id, name, email FROM users WHERE email=$1';
      let values = [email];
      if (password) {
        text =
          'SELECT id, name, email FROM users WHERE email=$1 AND password=$2';
        values.push(password);
      }
      const { rows } = await client.query(text, values);
      user = rows[0] ? rows : null;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      if (client) {
        await client.release(true);
      }
    }
    return user;
  }
}

export default new UserService();
