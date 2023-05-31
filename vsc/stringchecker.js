const axios = require("axios");

// Define the URL of the API endpoint
const API_URL = "http://localhost:3000/data";

// Store the last data that was retrieved from the API
let lastData;

// Function to retrieve the data from the API
const getData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// Function to check for new data
const checkForNewData = async () => {
  const data = await getData();
  if (lastData) {
    // Compare the last data with the current data
    const newData = data.filter((item) => !lastData.some((i) => i._id.equals(item._id)));
    if (newData.length > 0) {
      console.log("New data: ", newData);
      lastData = data;
    } else {
      console.log("No new data");
    }
  } else {
    lastData = data;
  }
};

// Schedule the `checkForNewData` function to run every minute
setInterval(checkForNewData, 60000);
