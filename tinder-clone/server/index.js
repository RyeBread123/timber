const express = require('express');
const app = express();
const PORT = 8000;
const { MongoClient} = require('mongodb')
const config = require('./config.js')
// pick the version from uuid
const { v4: uuidv4} = require('uuid')
// connecting to cluster through mongoDB
const uri = `mongodb+srv://ryebread:${config.TOKEN}@cluster0.sfnwn.mongodb.net/Cluster0?retryWrites=true&w=majority`
const jwt = require('jsonwebtoken')
const cores = require('cors')
app.use(cors())
// --------------- REQUESTS ---------------------

app.get('/', (req, res, next) => {
  res.json("Hello to my app")
})

app.post('/signup', async (req, res, next) => {
  const client = new MongoClient(uri);
  const {email, password} = req.body
  // UUID will generate unique number/ID
  cosnt generateduserId = uuidv4()
  // returning a hashed password
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await client.connect()
    const database = client.db('app-data')
    // collection in mongo db we are connecting to
    const users = database.collection('users')

    // check if user exists
    const existingUser = user.findOne({email})

    if (existingUser) {
      return res.send(409).send("user already exists. PLEASE login")
    }
    //sanitizing email
    const sanitizedEmail = email.toLowerCase()

    const data = {
      // must match database
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword
    }
    const insertedUser = await users.insertOne(data)

    // generate token
    // can use a secret key but not being used here
    // callback is amount of time to expire
    const token = jwt.sign(insertedUser, sanitizedEmail, {
      // expired in 24 hours
      expiresIn: 60 * 24,
    })
    res.status(201).json({token, userId: generatedUserId, email: sanitizedEmail})
  } catch (err) {
    console.log(error)
  }

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