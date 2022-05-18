const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbq1u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const taskCollection = client.db('taskCollection').collection('task');

        // total task
        app.get('/task', async(req, res) =>{
            const query = {};
            const cursor = taskCollection.find(query);
            const task = await cursor.toArray();

            res.send(task);
        });

        //   add task
          app.post('/task', async(req, res) =>{
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
          });

        // delete task
        app.delete('/task/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(console.dir)

app.get('/', (req, res) =>{
    res.send('Running api')
});

app.listen(port, () =>{
    console.log('Server running');
})