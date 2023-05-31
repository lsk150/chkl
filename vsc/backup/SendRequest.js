const { default: mongoose } = require("mongoose");

// Include the `socket.io-client` module
const io = require("socket.io-client");

var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb+srv://nekow:nekow@elaina.5gk5p.mongodb.net/test")
  .then(function (client) {
    let collection = client.db("mydatabase").collection("trigger_connection");
    let db = client.db("mydatabase");

    let change_streams = db.collection("trigger_connection").watch();
    change_streams.on("change", function (change) {
      // Check if the change was an update
      if (change.operationType === "update") {
        // Use `findOne()` to retrieve the updated document
        db.collection("trigger_connection").findOne({ _id: change.documentKey._id }, (error, data) => {
          if (error) {
            console.log(error);
          } else {
            // Check if the value of the updated document is "1"
            if (data.value === "OpenF") {
              // Create a client using the `io()` function and connect to the server
              const client = io("http://localhost:3000");

              // Emit a "lights" event with the data when
              client.emit("lights", { status: "1" });
            }

            if (data.value === "CloseF") {
              // Create a client using the `io()` function and connect to the server
              const client = io("http://localhost:3000");

              // Emit a "lights" event with the data when
              client.emit("lights", { status: "0" });
            }

            if (data.value === "OpenC") {
              // Create a client using the `io()` function and connect to the server
              const client = io("http://localhost:3000");

              // Emit a "lights" event with the data when
              client.emit("lights", { status: "01" });
            }

            if (data.value === "CloseC") {
              // Create a client using the `io()` function and connect to the server
              const client = io("http://localhost:3000");

              // Emit a "lights" event with the data when
              client.emit("lights", { status: "00" });
            }
          }
        });
      }
    });
  })
  .catch((error) => {
    // Handle any errors that occur when connecting to the MongoDB server
    console.error(error);
  });
