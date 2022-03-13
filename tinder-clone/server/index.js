const express = require("express");
const app = express();
const PORT = 8000;
const { MongoClient } = require("mongodb");
const config = require("./config.js");
// pick the version from uuid
const { v4: uuidv4 } = require("uuid");
// connecting to cluster through mongoDB
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const uri = config.uri;

app.use(cors());
app.use(express.json());
// --------------- REQUESTS ---------------------

app.get("/", (req, res, next) => {
  res.json("Hello to my app");
});

app.post("/login", async (req, res, next) => {
  const client = new MongoClient(uri);
  const {email, password} = req.body;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const user = await users.findOne({ email });
    const correctPassword = await bcrypt.compare(password, user.hashed_password)

    if (user && correctPassword) {
      const token = jwt.sign(user, email, {
        expiresIn: 60 * 24
      })
      // res.status(201).json({ token })
      res.status(201).json({ token, userId:user.user_id})
    }
    res.status(400).send('Invalid Credentials')

  } catch (err) {
    console.log(err)
  }

})

app.post("/signup", async (req, res, next) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;
  // UUID will generate unique number/ID
  const generatedUserId = uuidv4();
  // returning a hashed password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await client.connect();
    const database = client.db("app-data");
    // collection in mongo db we are connecting to
    const users = database.collection("users");

    // check if user exists
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.send(409).send("user already exists. PLEASE login");
    }
    //sanitizing email
    const sanitizedEmail = email.toLowerCase();

    const data = {
      // must match database
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword,
    };
    const insertedUser = await users.insertOne(data);

    // generate token
    // can use a secret key but not being used here
    // callback is amount of time to expire
    const token = jwt.sign(insertedUser, sanitizedEmail, {
      // expired in 24 hours
      expiresIn: 60 * 24,
    });
    // res.status(201).json({ token });
    res.status(201).json({ token, userId:generatedUserId})

  } catch (err) {
    console.log(err);
  }
});

app.get("/gendered-users", async (req, res, next) => {
  // connects to uri
  const client = new MongoClient(uri);
  const gender = req.query.gender

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    const query = {gender_identity: {$eq: gender}}
    const foundUsers = await users.find(query).toArray()
    // saving database as var
    // collection in mongo db we are connecting to

    // querying collection
    res.send(foundUsers);
  } finally {
    // ensures client closes when finished or if there is an error
    await client.close();
  }
});

app.get('/user', async (req, res, next) => {
  const client = new MongoClient(uri)
  const userId = req.query.userId;



  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const query = { user_id:userId}
    const user = await users.findOne(query)
    res.send(user)

  } finally {
    await client.close()
  }
})













app.put('/user', async (req,res,next) => {
  const client = new MongoClient(uri);
  const formData = req.body.formData

  console.log(formData);

  try {
    await client.connect()
    client.db()

    const database = client.db("app-data");
    const users = database.collection("users");

    const query = { user_id: formData.user_id}
    const updateDocument = {
      $set: {
        first_name: formData.first_name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        show_gender: formData.show_gender,
        gender_identity: formData.gender_identity,
        gender_interest:formData.gender_interest,
        url: formData.url,
        about: formData.about,
        matches: formData.matches
      },
    }
    const insertedUser = await users.updateOne(query, updateDocument);
    res.send(insertedUser)
  } finally {
    await client.close()
  }
})

// ----------------------------LISTEN-----------------------------------------

app.listen(PORT, () => {
  console.log(`Server running http://localhost/${PORT}`);
});
