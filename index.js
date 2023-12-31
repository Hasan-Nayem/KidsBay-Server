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

    //get all toys from all user
    app.get('/allToys', async (req, res) => {
      const result = await toyCollection.find().toArray();
      res.send(result);
    })

    //sort data by price
    app.get('/allToysSortBy/:sort', async (req, res) => {
      const sortBy = req.params.sort;
      const result = await toyCollection.find().sort({price:sortBy}).toArray();
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

    //get a single data of a user
    app.get('/toy/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id:  new ObjectId(id)};
      const result = await toyCollection.findOne(query);
      res.send(result);
    });


    //update toy data of a user
    app.put('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      // console.log(data.toy_title);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const update = { 
        $set : { 
          toy_title: data.toy_title, 
          description: data.description, 
          price: data.price, 
          img: data.img, 
          rating: data.rating, 
          quantity: data.quantity,
          category: data.category
        }
      };
      const result = await toyCollection.updateOne(filter, update, options);
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