const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

//MiddleWare
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174", "https://genius-gala.web.app"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swvd3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const assignmentCollection = client
      .db("genius-gala")
      .collection("assignments");
    const submittedCollection = client
      .db("genius-gala")
      .collection("submittedData");

    //===========POSTS===============//

    //Save Created Assignments Data to the DB
    app.post("/assignments", async (req, res) => {
      const assignmentData = req.body;
      const result = await assignmentCollection.insertOne(assignmentData);
      res.send(result);
    });

    //Save Submitted assignments date in the db
    app.post("/submitted_assignment", async (req, res) => {
      const submittedAssignmentData = req.body;
      // console.log(bidData);
      const result = await submittedCollection.insertOne(
        submittedAssignmentData
      );
      res.send(result);
    });

    //===========GETS==============//

    //Get All Assignments data from DB
    app.get("/assignments", async (req, res) => {
      const cursor = assignmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //get a single data from db using assignment id
    app.get("/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentCollection.findOne(query);
      res.send(result);
    });

    //Get All Submitted assignments posted data by a specific user
    app.get("/my_submitted_assignment/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await submittedCollection.find(query).toArray();
      res.send(result);
    });

    //Get all pending assignment that are submitted from the DB for assignment creator
    app.get("/pending_assignments/:email", async (req, res) => {
      const email = req.params.email;
      const query = { creator_email: email };
      const result = await submittedCollection.find(query).toArray();
      res.send(result);
    });

    //=============DELETES===============//
    //Delete Assignment by id
    app.delete("/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentCollection.deleteOne(query);
      res.send(result);
    });

    //==============PUTS==================//
    //Update a Assignment data by id
    app.put("/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const updatedAssignment = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...updatedAssignment,
        },
      };
      const result = await assignmentCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    //================PATCHES=================//
    app.patch("/submitted_assignment/:id", async (req, res) => {
      const id = req.params.id;
      const { score, feedback, status } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { score, feedback, status },
      };
      const result = await submittedCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send({ server_name: "Genius Gala" });
});

app.listen(port, () => {
  console.log(`Genius Gala API is running on port ${port}`);
});
