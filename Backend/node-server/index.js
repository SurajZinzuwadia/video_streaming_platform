const https = require("https");
const WebSocket = require("ws");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();

// Enable CORS for all routes
app.use(cors());

const server = https.createServer(
  {
    cert: fs.readFileSync("../../SSL_Certificates/liveStream_SSL/private.crt"), // Replace with your SSL certificate path
    key: fs.readFileSync("../../SSL_Certificates/liveStream_SSL/private.key"), // Replace with your private key path
    passphrase: "dexter",
  },
  app
);

const wss = new WebSocket.Server({ server });

// Store active connections
const connections = new Set();

// Handle incoming WebSocket connections
wss.on("connection", (ws) => {
  // Add new connection to the set
  connections.add(ws);

  // Remove closed connections from the set
  ws.on("close", () => {
    connections.delete(ws);
  });
});

// Route to receive camera feed from the producer
app.post("/feed", (req, res) => {
  let body = "";

  req.on("data", (data) => {
    // Accumulate the data chunks
    body += data;
  });

  req.on("end", () => {
    // Handle the camera feed data sent by the producer
    // and broadcast it to all connected consumers

    // Assuming the producer sends base64-encoded video data
    connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(body);
      }
    });

    // Send a response to the producer
    res.statusCode = 200;
    res.end();
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
