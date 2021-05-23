import express from 'express';
import { Session } from 'express-session';
import UserService from '../service/userService';
import { hashPassword } from '../utils/utils';

type ExpressSession = Session & { userId: String };
type ExpressSessionRequest = express.Request & { session: ExpressSession };

class UserMiddleware {
  isAdmin = async (
    req: ExpressSessionRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.session.userId;
      const userData = await UserService.getById(userId);
      if (userData && userData[0].isadmin) {
        return next();
      }
      return res.status(401).send('Unauthorised User');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  };

  isValidUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const email = req.body.email;
      const password = hashPassword(req.body.password);
      const userData = await UserService.getByLoginDetails(email, password);
      if (userData) {
        req.body.id = userData[0].id;
        return next();
      }
      return res.status(404).send('User Not Found');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  };

  assignAdmin = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userData = await UserService.listAll();
      if (!userData) {
        req.body.isadmin = true;
      } else {
        req.body.isadmin = false;
      }
      return next();
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  };

  validateUserData = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const email = req.body.email;
      const userData = await UserService.getByLoginDetails(email);
      req.body.password = hashPassword(req.body.password);
      if (!userData) {
        return next();
      }
      return res.status(409).send('User with same email Already Exists');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  };

  initializeUserSession = async (
    req: ExpressSessionRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = req.body.id;
      if (id) {
        req.session.userId = id;
        delete req.body.id;
        return next();
      }
      return res.status(500).send('Internal Server Error');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  };

  isLoggedIn = async (
    req: ExpressSessionRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.session.userId;
      const userData = await UserService.getById(userId);
      if (userData) {
        req.body.createdby = userId;
        return next();
      }
      return res.status(404).send('User Not Found');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  };
}

export default new UserMiddleware();
