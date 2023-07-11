(
  function showCameraStream() {
    // Create the video element
    var videoElement = document.createElement('video');
    videoElement.setAttribute('autoplay', '');
    videoElement.setAttribute('playsinline', '');
    videoElement.style.transform = 'scaleX(-1)'; // Apply mirror effect
    videoElement.style.width = '100%'; // Reduce aspect ratio
    videoElement.style.transition = 'transform 0.8s'; // Add transition effect
  
    // Create the flip button
    var flipButton = document.createElement('button');
    flipButton.textContent = 'Flip Camera';
    flipButton.style.padding = '10px';
    flipButton.style.margin = '5px';
    flipButton.style.backgroundColor = '#4caf50'; // Set background color
    flipButton.style.color = '#ffffff'; // Set text color
    flipButton.style.border = 'none'; // Remove border
    flipButton.style.borderRadius = '4px'; // Apply border radius
  
    // Create the go live button
    var goLiveButton = document.createElement('button');
    goLiveButton.textContent = 'Go Live';
    goLiveButton.style.margin = '5px';
    goLiveButton.style.padding = '10px';
    goLiveButton.style.backgroundColor = '#f44336'; // Set background color
    goLiveButton.style.color = '#ffffff'; // Set text color
    goLiveButton.style.border = 'none'; // Remove border
    goLiveButton.style.borderRadius = '4px'; // Apply border radius
  
    // Access the user's camera stream
    function accessCamera() {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          videoElement.srcObject = stream;
          document.body.appendChild(videoElement);
        })
        .catch(function (error) {
          console.error('Error accessing camera stream:', error);
        });
    }
  
    // Flip the camera
    function flipCamera() {
      var videoTracks = videoElement.srcObject.getVideoTracks();
      var facingMode = videoTracks[0].getSettings().facingMode;
  
      videoElement.style.transform = 'scaleX(1)'; // Apply transition effect
      videoElement.offsetHeight; // Trigger reflow to start the transition
  
      videoTracks[0].stop(); // Stop the current camera stream
  
      // Get the new facing mode
      var newFacingMode = (facingMode === 'user') ? 'environment' : 'user';
  
      // Update the constraints with the new facing mode
      var constraints = { video: { facingMode: newFacingMode } };
  
      // Access the new camera stream
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          videoElement.srcObject = stream;
  
          // Apply mirror effect for front camera
          if (newFacingMode === 'user') {
            videoElement.style.transform = 'scaleX(-1)';
          } else {
            videoElement.style.transform = 'scaleX(1)';
          }
        })
        .catch(function (error) {
          console.error('Error accessing camera stream:', error);
        });
    }
  
    // Function for "Go Live" button
    function goLive() {
      // Add your logic here to start the live stream
      console.log('Go Live button clicked!');
      // Get access to the camera feed
      navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        // Create a canvas element to capture video frames
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const frameRate = 30; // Adjust the frame rate as needed

        setInterval(() => {
          // Draw the current video frame onto the canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Get the image data from the canvas as a base64-encoded string
          const imageData = canvas.toDataURL('image/jpeg', 0.8);

          // Send the image data to the server
          sendDataToServer(imageData);
        }, 1000 / frameRate);
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });

      // Function to send image data to the server
      function sendDataToServer(imageData) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://172.20.10.10:3000/feed'); // Replace <server-ip> with the server IP or domain
      xhr.setRequestHeader('Content-Type', 'application/json');

      const data = {
        image: imageData,
        timestamp: new Date().getTime() // Optionally include a timestamp
      };

      xhr.send(JSON.stringify(data));
      }

    }
  
    // Add event listeners to buttons
    flipButton.addEventListener('click', flipCamera);
    goLiveButton.addEventListener('click', goLive);
  
    // Access the camera stream initially
    accessCamera();
  
    // Append video element and buttons to the body
    document.body.appendChild(videoElement);
    document.body.appendChild(flipButton);
    document.body.appendChild(goLiveButton);
  }
    
)();
