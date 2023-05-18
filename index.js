const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const uri = "mongodb+srv://nayemmh66:TX7DLHFd5uIGZ8bs@cluster0.6bvml06.mongodb.net/?retryWrites=true&w=majority";

// middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Kids Are Playing');
});

//nayemmh66
//TX7DLHFd5uIGZ8bs





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
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.listen(port,() => {
    console.log('listening on port - ' + port);
});