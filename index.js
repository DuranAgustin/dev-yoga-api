'use strict';

import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

import { auth } from 'express-openid-connect';
import pkg from 'express-openid-connect';
const { requiresAuth } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;
const CONNECTION_STRING =
  'mongodb+srv://kferne3:Violanerd12!@yoga-flow.g11hl.mongodb.net/?retryWrites=true&w=majority';

app.use(cors());
app.use(express.json());

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

//TODO-WE NEED VALIDATION
MongoClient.connect(CONNECTION_STRING).then(async (client) => {
  console.log('Connected to database...');
  const db = client.db('flows');
  const flowCollection = db.collection('saved-flows');
  const userCollection = db.collection('users');

  //------FLOW API CRUD CALLS-------//
  //-------------------------------//
  app.get('/', async (req, res) => {
    await db
      .collection('saved-flows')
      .find()
      .toArray()
      .then((results) => {
        res.send(results);
      })
      .catch((error) => console.error(error));
  });

  app.get('/flows/find:id', (req, res) => {
    flowCollection
      .findOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => console.error(error));
  });

  app.get('/:id', (req, res) => {
    flowCollection
      .findOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => console.error(error));
  });

  app.get('/flows/userId:id', (req, res) => {
    flowCollection
      .find({ userId: req.params.id })
      .toArray()
      .then((results) => {
        res.send(results);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  //
  app.post('/flows', (req, res) => {
    flowCollection
      .insertOne(req.body)
      .then((result) => {
        res.send(result);
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

  app.delete('/flows/remove:id', (req, res) => {
    flowCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.json('Flow deleted');
      })
      .catch((error) => console.log(error));
  });

  //TODO-build update functionality
  app.put('/flows/update:id', (req, res) => {
    flowCollection
      .findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            flow: req.body.flow,
          },
        },
        {
          upsert: false,
        }
      )
      .then((result) => res.json('Success'))
      .catch((error) => console.error(error));
  });

  //--------USER API CRUD CALLS-------//
  //---------------------------------//
  app.get('/user', async (req, res) => {
    await db
      .collection('users')
      .find()
      .toArray()
      .then((results) => {
        res.send(results);
      })
      .catch((error) => console.error(error));
  });

  app.get('/user/find:id', (req, res) => {
    userCollection
      .findOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => console.error(error));
  });

  app.get('/user/email:email', (req, res) => {
    userCollection
      .findOne({ email: req.params.email })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => console.error(error));
  });

  app.post('/user', (req, res) => {
    userCollection
      .insertOne(req.body)
      .then((result) => {
        console.log(result);
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  });
});
