// Standard
const express = require("express");
const app = express(); // create app by calling express()
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = 3000;

// use middleware
app.use(cors()); // Allow access for two different port and server
app.use(express.json()); // For parsing body of POST and PUT Method

// for testing
app.get("/", (req, res) => {
  res.send({ message: "Success" });
});

const uri = `mongodb+srv://nekow:nekow@elaina.5gk5p.mongodb.net/test`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const myCollection = client.db("mydatabase").collection("mycollection");

    // const productCollection = client.db("dewalt_DB").collection("products");
    // const reviewCollection = client.db("dewalt_DB").collection("reviews");
    // const orderCollection = client.db("dewalt_DB").collection("orders");
    // const userCollection = client.db("dewalt_DB").collection("users");
    // const paymentCollection = client.db("dewalt_DB").collection("payments");

    app.get("/inventory", async (req, res) => {
      // Endpoint name must be singular
      const query = req.query;
      const cursor = myCollection.find(query);
      const result = await cursor.toArray();
      console.log("mongodb connected");
      res.send(result);

      console.log(result);
    });
  } finally {
    //   await client.close(); // do not forget to comment ✔
  }
}
run().catch(console.dir); // do not forget to call run ✔

// for testing
/*
app.get("/", (req, res) => {
res.send({ message: "Success" });
});
*/

app.listen(port, () => {
  console.log("Listening to port", port);
});
