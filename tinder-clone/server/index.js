const express = require('express');
const app = express();
const PORT = 8000;
const { MongoClient} = require('mongodb')

// connecting to cluster through mongoDB
const uri = 'mongodb+srv://ryebread:bread@cluster0.sfnwn.mongodb.net/Cluster0?retryWrites=true&w=majority'

// --------------- REQUESTS ---------------------

app.get('/', (req, res, next) => {
  res.json("Hello to my app")
})

app.post('/signup', (req, res, next) => {
  const client = new MongoClient(uri);


})

app.get('/users', async (req, res, next) => {
  // connects to uri
  const client = new MongoClient(uri)

  try {
    await client.connect()
    // saving database as var
    const database = client.db('app-data')
    // collection in mongo db we are connecting to
    const users = database.collection('users')

    // querying collection
    const returnedUsers = await users.find().toArray()
    res.send(returnedUsers)
  } finally {
    // ensures client closes when finished or if there is an error
    await client.close()
  }
})

// ----------------------------LISTEN-----------------------------------------


app.listen(PORT, () => {
  console.log(`Server running http://localhost/${PORT}`)
})