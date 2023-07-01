// Get video element
const video = document.getElementById("videoElement");

// Get flip button element
const flipButton = document.getElementById("flipButton");

// Check if browser supports WebRTC
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Access the camera
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      // Set the video source to the camera stream
      video.srcObject = stream;

      // Add event listener to flip button
      flipButton.addEventListener("click", function () {
        // Stop the current stream
        video.srcObject.getTracks().forEach(function (track) {
          track.stop();
        });

        // Create new constraints with flipped facingMode
        const constraints = {
          video: {
            facingMode:
              video.srcObject.getVideoTracks()[0].getSettings().facingMode ===
              "user"
                ? "environment"
                : "user",
          },
        };

        // Access the camera with flipped constraints
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function (newStream) {
            // Set the video source to the new camera stream
            video.srcObject = newStream;
          })
          .catch(function (error) {
            console.error("Error accessing the camera:", error);
          });
      });
    })
    .catch(function (error) {
      console.error("Error accessing the camera:", error);
    });
} else {
  console.error("WebRTC is not supported in this browser.");
}
