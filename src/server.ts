import express from 'express';
import session from 'express-session';

import { CommonRoutesConfig } from './routes/commonRouteConfig';
import { UserRoutes } from './routes/userRoutes';
import { BooksRoutes } from './routes/bookRoutes';
import { CollectionRoutes } from './routes/collectionRoutes';
import pool from './dbsetup/dbSetup';

class Server {
  private app: express.Application;
  private routes: Array<CollectionRoutes> = [];
  constructor() {
    this.app = express();
    this.config();
    this.routes = this.RouterConfig();
    this.dbConnect();
    this.dataSetup();
  }

  private config() {
    this.app.use(
      session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
      })
    );
    this.app.use(express.json());
  }

  private async dbConnect() {
    await pool.connect((err, client, done) => {
      if (err) {
        throw new Error(err);
      }
      console.log('Database Connected');
      client.release(true);
    });
  }

  private async dataSetup() {
    let client;
    try {
      const userTableQuery = `CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, name VARCHAR (50) NOT NULL, email VARCHAR (255) UNIQUE NOT NULL, password VARCHAR (255) NOT NULL, isAdmin BOOLEAN NOT NULL)`;
      client = await pool.connect();
      await client.query(userTableQuery);
      console.log('users table created');
      const booksTableQuery = `CREATE TABLE IF NOT EXISTS books(id SERIAL PRIMARY KEY, name VARCHAR (50) NOT NULL, description TEXT NOT NULL, genre VARCHAR (50) NOT NULL)`;
      await client.query(booksTableQuery);
      console.log('books table created');
      const collectionTableQuery = `CREATE TABLE IF NOT EXISTS collections(id SERIAL PRIMARY KEY, name VARCHAR (50) NOT NULL, createdBy VARCHAR (55) NOT NULL, books VARCHAR(55) [])`;
      await client.query(collectionTableQuery);
      console.log('collections table created');
    } catch (e) {
      console.log(e);
      throw new Error(e);
    } finally {
      if (client) {
        client.release(true);
      }
    }
  }

  private RouterConfig() {
    return [
      new UserRoutes(this.app),
      new BooksRoutes(this.app),
      new CollectionRoutes(this.app)
    ];
  }
  public start(port: number) {
    this.app.listen(port, () => {
      this.routes.forEach((route: CommonRoutesConfig) => {
        console.log(`Routes configured for ${route.getName()}`);
      });
      console.log(`Server running at http://localhost:${port}`);
    });
  }
}

export default Server;
