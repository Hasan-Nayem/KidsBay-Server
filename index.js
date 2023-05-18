const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Kids Are Playing');
});



app.listen(port,() => {
    console.log('listening on port - ' + port);
});