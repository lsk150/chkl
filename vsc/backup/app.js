const io = require("socket.io")(3000);
const SerialPort = require("serialport");
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: "\r\n",
});

var port = new SerialPort("COM3", {
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

port.pipe(parser);

io.on("connection", function (socket) {
  socket.on("lights", function (data) {
    console.log(data);
    port.write(data.status);
  });
});

parser.on("data", function (data) {
  console.log("Received data from port: " + data);
  if (data < 900) {
  }

  io.emit("data", data);
});
