const connectButton = document.getElementById('connectButton');

connectButton.textContent = 'Join Live';
connectButton.style.padding = '10px';
connectButton.style.margin = '5px';
connectButton.style.backgroundColor = '#4caf50'; // Set background color
connectButton.style.color = '#ffffff'; // Set text color
connectButton.style.border = 'none'; // Remove border
connectButton.style.borderRadius = '4px'; // Apply border radius

let socket;


// Function to connect to the server and start receiving camera feed
function connectToServer() {


// Connect to the server using WebSocket
const socket = new WebSocket('wss://localhost:3000'); // Replace <server-ip> with the server IP or domain

// Event handler for when the WebSocket connection is established
socket.onopen = () => {
  console.log('Connected to the server');
};

// Event handler for receiving messages from the server
socket.onmessage = (event) => {
const data = JSON.parse(event.data);

// console.log(event);
// Display the received image data in the video player
// videoElement.src = data.image;
// Assuming you have a canvas element with an id of 'myCanvas'
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

// Retrieve the base64 string of the image data
const base64String = "Your base64 image data here";

// Create an Image object
const img = new Image();

// Set the source of the Image object to the base64 string
img.src = data.image;

// Once the image is loaded, draw it on the canvas
img.onload = function() {
  // Set the canvas dimensions to match the image dimensions
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the image on the canvas
  context.drawImage(img, 0, 0);
};


// Event handler for errors in the WebSocket connection
socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// Event handler for when the WebSocket connection is closed
socket.onclose = () => {
  console.log('Disconnected from the server');
};

}
}
// Event listener for the connect button
connectButton.addEventListener('click', () => {
  connectToServer();
});
