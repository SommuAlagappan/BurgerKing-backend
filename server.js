const express = require('express')
const cors = require('cors')
const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const URL = process.env.DB
const DB = 'burgerking'
const PORT = process.env.PORT



const app = express()
app.use(express.json())
app.use(
  cors({
    origin: '*'
  })
)

app.get('/', function (req, res) {
  res.send("API is running")
})


//Authenticate
let authenticate = (req, res, next) => {
  // console.log(req.headers)
  if (req.headers.authorization) {
    try {
      let decode = jwt.verify(req.headers.authorization, process.env.SECRET);
      if (decode) {
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(401).json("Unauthorised");
    }
  } else {
    res.status(401).json("Unauthorised");
  }
};

// Veg Burgers

app.post("/product", authenticate, async function (req, res) {
  try {
    // Step1: Create a connection between Nodejs and MongoDB
    const connection = await mongoClient.connect(URL);

    // Step2: Select the DB
    const db = connection.db(DB);

    // Step3: Select the collection
    // Step4: Do the operation (Create,Read,Update and Delete)
    await db.collection("products").insertOne(req.body);

    // Step5: Close the connection
    await connection.close();
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.log(error);
    //If any error throw error
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/products", authenticate, async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let resUser = await db.collection("products").find().toArray();

    await connection.close();

    res.json(resUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/product/:id", authenticate, async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let resUser = await db
      .collection("products")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });

    await connection.close();

    res.json(resUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});



// Non-veg Burgers

app.post("/product1", authenticate, async function (req, res) {
  try {
    // Step1: Create a connection between Nodejs and MongoDB
    const connection = await mongoClient.connect(URL);

    // Step2: Select the DB
    const db = connection.db(DB);

    // Step3: Select the collection
    // Step4: Do the operation (Create,Read,Update and Delete)
    await db.collection("products1").insertOne(req.body);

    // Step5: Close the connection
    await connection.close();
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.log(error);
    //If any error throw error
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/products1", authenticate, async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let resUser = await db.collection("products1").find().toArray();

    await connection.close();

    res.json(resUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/product1/:id", authenticate, async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let resUser = await db
      .collection("products1")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });

    await connection.close();

    res.json(resUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});



//Sweets and Treats

app.post("/product2", authenticate, async function (req, res) {
  try {
    // Step1: Create a connection between Nodejs and MongoDB
    const connection = await mongoClient.connect(URL);

    // Step2: Select the DB
    const db = connection.db(DB);

    // Step3: Select the collection
    // Step4: Do the operation (Create,Read,Update and Delete)
    await db.collection("products2").insertOne(req.body);

    // Step5: Close the connection
    await connection.close();
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.log(error);
    //If any error throw error
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/products2", authenticate, async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let resUser = await db.collection("products2").find().toArray();

    await connection.close();

    res.json(resUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/product2/:id", authenticate, async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let resUser = await db
      .collection("products2")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });

    await connection.close();

    res.json(resUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//Register user
app.post("/register", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);

    let salt = await bcrypt.genSalt(10);
    // console.log(salt)
    let hash = await bcrypt.hash(req.body.password, salt);
    // console.log(hash)
    req.body.password = hash;

    await db.collection("users").insertOne(req.body)
    await connection.close();
    res.json("User registered successfully");
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

//Login User
app.post("/login", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);

    let user = await db.collection("users").findOne({ emailAddress: req.body.emailAddress });

    if (user) {
      let compare = await bcrypt.compare(req.body.password, user.password);
      if (compare) {
        let token = jwt.sign({ _id: user._id }, process.env.SECRET, {
          expiresIn: "1h"
        })
        res.json({ token })
      } else {
        res.status(401).json({ message: "Username or Password is incorrect" });
      }
    } else {
      res.status(401).json({ message: "Username or Password is incorrect" });
    }
    await connection.close();
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});



app.listen(process.env.PORT || 4001, console.log(`Server is connected in ${PORT}`));