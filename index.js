const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.6bvml06.mongodb.net/?retryWrites=true&w=majority`;
// middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Kids Are Playing');
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const categoryCollection = client.db("kidsbay").collection("category");
    const toyCollection = client.db("kidsbay").collection("toys")

    app.get('/category', async (req, res) => {
      const data = await categoryCollection.find().toArray();
      res.send(data);
    });

    app.get('/allToys', async (req, res) => {
      const result = await toyCollection.find().toArray();
      res.send(result);
    })

    app.post('/addToy', async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await toyCollection.insertOne(data);
      res.send(result);
    })

    //Get toys added by specific user
    app.get('/my-toy/:id', async(req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { seller_id: id };
      const result = await toyCollection.find(query).toArray();
      // console.log(result);
      res.send(result);
    });
    //delete users toy
    app.delete('/my-toy/:id', async(req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      // console.log(result);
      res.send(result);
    });



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port,() => {
    console.log('listening on port - ' + port);
});