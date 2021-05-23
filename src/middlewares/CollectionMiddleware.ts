import express from 'express';
import { Session } from 'express-session';
import CollectionService from '../service/collectionService';

type ExpressSession = Session & { userId: String };
type ExpressSessionRequest = express.Request & { session: ExpressSession };

class CollectionMiddleware {
  extractCollectionId = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      if (req.params.collectionId) {
        req.body.id = req.params.collectionId;
        return next();
      }
      return res.status(404).send('Invalid Collection Id');
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
      const collection = await CollectionService.getById(req.body.id);
      if (collection) {
        req.body.createdby = collection[0].createdby;
        return next();
      }
      return res.status(404).send('Invalid Collection Id');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  };
  isValidUser = async (
    req: ExpressSessionRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const createdby = req.body.createdby;
      const userId = req.session.userId.toString();
      if (createdby === userId) {
        return next();
      }
      return res.status(401).send('Unauthorised User');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  };
}

export default new CollectionMiddleware();
