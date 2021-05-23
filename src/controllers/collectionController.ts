import express from 'express';
import CollectionService from '../service/collectionService';

class CollectionController {
  async createCollection(req: express.Request, res: express.Response) {
    try {
      const books = req.body.books.join(',');
      const updatedData = { ...req.body, books: `{${books}}` };
      await CollectionService.create(updatedData);
      return res.status(201).send('Collection creation Successfull');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  }

  async getCollectionByUserId(req: express.Request, res: express.Response) {
    try {
      const userId = req.body.createdby;
      const collections = await CollectionService.listByUserId(userId);
      return res.status(200).send(collections);
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  }

  async getCollectionById(req: express.Request, res: express.Response) {
    try {
      const collectionId = req.body.id;
      const collection = await CollectionService.getById(collectionId);
      return res.status(200).send(collection);
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  }

  async updateCollection(req: express.Request, res: express.Response) {
    try {
      const collectionId = req.body.id;
      const updatedCollectionData = req.body;
      delete updatedCollectionData.createdby;
      delete updatedCollectionData.id;
      await CollectionService.update(collectionId, updatedCollectionData);
      return res.status(200).send('collection updated');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  }
  async deleteCollection(req: express.Request, res: express.Response) {
    try {
      const collectionId = req.body.id;
      await CollectionService.delete(collectionId);
      return res.status(200).send('Collection Deleted Successfully');
    } catch (e) {
      console.log(e);
      return res.status(500).send('Internal Server Error');
    }
  }
}

export default new CollectionController();
