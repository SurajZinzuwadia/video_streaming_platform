const express = require("express");
const https = require("https");
const WebSocket = require("ws");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS middleware

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
  // Handle the camera feed data sent by the producer
  // and broadcast it to all connected consumers

  // Assuming the producer sends data as JSON
  req.on("data", (data) => {
    const feedData = JSON.parse(data);

    // Broadcast the feed data to all connected consumers
    connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(feedData));
      }
    });
  });

  // Send a response to the producer
  res.sendStatus(200);
});

// Start the server
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
