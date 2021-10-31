const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require ('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p5yyu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('tourismWebsite');
        const destinationsCollection = database.collection('destinations');
        const ordersCollection = database.collection('orders');

        //Get Single Destination
        app.get('/destinations/:id', async(req, res)=>{
            const id = req.params.id;
            console.log('getting spacific destination', id);
            const query = {_id: ObjectId(id)};
            const destination = await destinationsCollection.findOne(query);
            res.json(destination);
        })

        //Get API
        app.get('/destinations', async(req, res)=>{
            const cursor = destinationsCollection.find({});
            const destinations = await cursor.toArray();
            res.send(destinations);
        })

        //POST API
        app.post('/destinations', async(req, res)=>{
            const destination = req.body;
            console.log('hit the post API',destination);
            
            const result = await destinationsCollection.insertOne(destination);
            console.log(result);
            res.json(result);
        });
        //GET API for ORDER
        app.get('/orders',async(req, res)=>{
            const orderCursor = ordersCollection.find({})
            const orders = await orderCursor.toArray();
            res.send(orders);
        })

        
        //POST API for users information
        app.post('/orders', async(req, res)=>{
            const order = req.body;
            console.log('Hitting Order',order);
            res.send('post hitted order');
        
            const orderResult = await ordersCollection.insertOne(order);
            console.log(orderResult);
            res.json(orderResult);
        });

        //Delete API for users information
        app.delete('/orders/:id',async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id) };
            const orderResult = await ordersCollection.deleteOne(query);

            console.log('delete id',orderResult);

            res.json(orderResult);

        })


    }
    finally{
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Server');
});

app.listen(port, () =>{
    console.log('Running server on port', port);
})