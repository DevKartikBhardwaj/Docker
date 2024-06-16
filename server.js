var express = require("express");
var path = require("path");
const { MongoClient } = require("mongodb");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const local_uri = "mongodb://0.0.0.0:27017";
const container_uri = "mongodb://admin:password@mongodb";

//connecting to the database
const client = new MongoClient(container_uri);
client
  .connect()
  .then(() => console.log("Connected Successfully"))
  .catch((error) => console.log("Failed to connect", error.message));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/getData", async (req, res) => {
  try {
    const database = client.db("users");
    const collection = database.collection("info");
    const userInfo = await collection.findOne({ userId: 1 });
    res.status(200).send(userInfo);
  } catch (error) {
    var { message } = error;
    console.log(message);
    res.status(400).send(message);
  }
});

app.put("/handleForm", async (req, res) => {
  try {
    const database = client.db("users");
    const collection = database.collection("info");
    const userInfo = await collection.updateOne(
      { userId: 1 },
      { $set: req.body }
    );
    res.status(200).send(userInfo);
  } catch (error) {
    var { message } = error;
    console.log(message);
    res.status(400).send(message);
  }
});

app.listen(3000, () => {
  console.log("running at port 3000");
});
