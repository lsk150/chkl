const axios = require("axios");
let info;

axios
  .get("http://localhost:3000/inventory")
  .then((response) => {
    info = response.data;
    console.log(info);
    // use the imported "info" data here
  })
  .catch((error) => {
    console.log(error);
  });

console.log(info);
