const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://nekow:nekow@elaina.5gk5p.mongodb.net/test";
const dbName = "mydatabase";
const client = new MongoClient(url);

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();

var currentdate = new Date();

var datetime = "Last Sync: " + currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
// Defining the serial port
const port = new SerialPort("COM5", {
  baudRate: 9600,
});

// The Serial port parser
const parser = new Readline();
port.pipe(parser);

// mongoose connection
async function connect() {
  try {
    await mongoose.connect(url);
    console.log("Connected to db!");
  } catch (err) {
    console.log(err);
  }
}

let lastData;

checkForNewData();

function checkForNewData() {
  const collection = client.db(dbName).collection("strings");
  collection.find({}).toArray((err, data) => {
    if (err) throw err;
    if (lastData) {
      // Compare lastData with current data
      const newData = data.filter((item) => !lastData.some((i) => i._id.equals(item._id)));
      if (newData.length > 0) {
        console.log("New data: ", newData);
        for (let i = 0; i < newData.length; i++) {
          if (newData[i].string === "Hello world") {
            console.log("Found new data with string 'hello world'");
            // Send string to arduino
            port.write("hello world", function (err) {
              if (err) {
                return console.log("Error on write: ", err.message);
              }
              console.log("message written");
            });
          }
        }
        lastData = data;
      } else {
        // console.log("No new data");
      }
    } else {
      lastData = data;
    }
    setTimeout(checkForNewData, 5000);
  });
}

// parser
parser.on("data", function (data) {
  console.log(data);

  client.connect(function (err) {
    if (err) throw err;

    // Get a reference to the "mycollection" collection
    const collection = client.db(dbName).collection("mycollection");
    const valuedata = data.includes("Value : ");
    const number = /\d/.test(data);

    // Calculate the current date and time
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    // Insert a new document into the collection
    if (valuedata && number < 500) {
      collection.insertOne({
        name: "Heavy Rain",
        time: datetime,
      });
    }
    if (valuedata && number < 900 && number > 500) {
      collection.insertOne(
        {
          name: "Light Rain",
          time: datetime,
        },
        function (err, result) {
          if (err) throw err;

          console.log("Successfully inserted document");
        }
      );
    }
    previousData = data;
  });
});

connect();
