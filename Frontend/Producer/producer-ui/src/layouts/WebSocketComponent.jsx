import React, { useEffect, useRef } from 'react';

function WebSocketComponent() {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);

  const connectToServer = () => {
    // Connect to the server using WebSocket
    socketRef.current = new WebSocket('wss://192.168.2.93:3000'); // Replace <server-ip> with the server IP or domain

    // Event handler for when the WebSocket connection is established
    socketRef.current.onopen = () => {
      console.log('Connected to the server');
    };

    // Event handler for receiving messages from the server
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Assuming you have the base64 image data in the received 'data' object
      const base64String = data.image;

      const img = new Image();
      img.src = base64String;

      // Once the image is loaded, draw it on the canvas
      img.onload = function () {
        // Set the canvas dimensions to match the image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas
        context.drawImage(img, 0, 0);
      };
    };

    // Event handler for errors in the WebSocket connection
    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Event handler for when the WebSocket connection is closed
    socketRef.current.onclose = () => {
      console.log('Disconnected from the server');
    };
  };

  useEffect(() => {
    // Clean up the WebSocket connection when the component is unmounted
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} id="myCanvas" />
      <button onClick={connectToServer}>Connect</button>
    </div>
  );
}

export default WebSocketComponent;
