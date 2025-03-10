const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv').config();
const port=process.env.PORT||5000;

//midddleware
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
  res.send('boss is sitting')
});



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n7txs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const database=client.db('bistroDB');
    const menu=database.collection('menu');
    const reviews=database.collection('reviews');
    const cart=database.collection('cart');
    const users=database.collection('users');


    //users api
    app.post('/users',async (req,res)=>{
      const user=req.body;
      const query={email: user.email};

      const existingUser=await users.findOne(query);
      if(existingUser){
        return res.send({message: 'user already exists', insertedId: null});
      }
      const result=await users.insertOne(user);
      res.send(result);
    })

    app.get('/users', async (req,res)=>{
      const result= await users.find().toArray();
      res.send(result);
    })

    //getting menu
    app.get('/menu',async (req,res)=>{
      const result=await menu.find().toArray();
      res.send(result);
    })

    //getting reviews
    app.get('/reviews',async (req,res)=>{
      const result=await reviews.find().toArray();
      res.send(result);
    })
    

    //cart collection
    app.post('/cart',async (req,res)=>{
      const cartItem=req.body;
      const result=await cart.insertOne(cartItem);
      res.send(result);
    })

    app.get('/cart',async (req,res)=>{
      const email=req.query.email;
      const query={email: email};
      const result=await cart.find(query).toArray();
      res.send(result);
    })

    app.delete('/cart/:id',async (req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const result=await cart.deleteOne(query);
      res.send(result);
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);




app.listen(port,()=>{
  console.log(`Bistro boss is sitting on port ${port}`);
})