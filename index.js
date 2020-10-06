const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g75lc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

const port = 5000;

app.get('/', (req, res) => {
    res.send('Working');
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const tasksCollection = client.db("volunteerNetwork").collection("tasks");
  const volunteersCollection = client.db("volunteerNetwork").collection("volunteers");
  
  app.post('/addTasks', (req, res) => {
    const tasks = req.body;
    tasksCollection.insertOne(tasks)
    .then(result => {
      res.send(result.insertedCount);
    })
  })

  app.get('/tasks', (req, res) => {
    tasksCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addVolunteer', (req, res) => {
    const volunteer = req.body;
    volunteersCollection.insertOne(volunteer)
    .then(result => {
      res.send(result);
    })
  })

  app.get('/volunteers', (req, res) => {
    volunteersCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

});

app.listen(port);