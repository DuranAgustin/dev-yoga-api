'use strict';

import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const PORT = process.env.PORT || 3000;
const CONNECTION_STRING =
  'mongodb+srv://kferne3:Violanerd12!@yoga-flow.g11hl.mongodb.net/?retryWrites=true&w=majority';

//MIDDLEWARE//
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

MongoClient.connect(CONNECTION_STRING).then(async (client) => {
  console.log('Connected to database...');
  const db = client.db('flows');
  const flowCollection = db.collection('saved-flows');

  app.get('/', async (req, res) => {
    await db
      .collection('saved-flows')
      .find()
      .toArray()
      .then((results) => {
        console.log(results);
        res.send(results);
      })
      .catch((error) => console.error(error));
  });

  //TODO-Add validation to the post method so that flows posted in there include the necessary data
  //TODO-figure out routes and mongoose for the get/post/delete

  app.post('/flows', (req, res) => {
    flowCollection
      .insertOne(req.body)
      .then((result) => {
        console.log(result);
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  });

  app.delete('/flows/remove:id', (req, res) => {
    flowCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.json('Flow deleted');
      })
      .catch((error) => console.log(error));
  });

  //TODO-build update functionality
  app.put('/flows', (req, res) => {});
});
