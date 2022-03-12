const express = require('express');
const app = express();
const PORT = 8000;
const { MongoClient} = require('mongodb')
const uri = 'mongodb+srv://ryebread:bread@cluster0.sfnwn.mongodb.net/Cluster0?retryWrites=true&w=majority'

app.get('/', (req, res, next) => {
  res.json("Hello to my app")
})

app.post('/signup', (req, res, next) => {
  res.json("Hello to my app")

})

app.get('/users', async (req, res, next) => {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const returnedUsers = await users.find().toArray()
    res.send(returnedUsers)
  } finally {
    // ensures client closes when finished or if there is an error
    await client.close()
  }
})


app.listen(PORT, () => {
  console.log(`Server running http://localhost/${PORT}`)
})