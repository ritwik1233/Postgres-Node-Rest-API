import express from 'express';
import UserService from '../service/userService';
import { Session } from 'express-session';

type ExpressSession = Session & { userId: String };
type ExpressSessionRequest = express.Request & { session: ExpressSession };

class UserController {
  async createUser(req: express.Request, res: express.Response) {
    try {
      await UserService.create(req.body);
      return res.status(201).send('User Registration Succesfull');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  }

  async getByUserId(req: ExpressSessionRequest, res: express.Response) {
    try {
      const userId = req.session.userId;
      const user = await UserService.getById(userId);
      return res.status(200).send(user);
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  }
  async logoutUser(req: ExpressSessionRequest, res: express.Response) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return res.status(500).send('Internal Server Error');
        }
        return res.status(200).send('User Logged Out');
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  }
}

export default new UserController();
