const videoContainer = document.getElementById("videoContainer");
const videoCanvas = document.getElementById("videoCanvas");
const flipButton = document.getElementById("flipButton");

let aspectRatio = 1;
let isFrontCamera = true; // Initial facing mode is front camera

// Check if browser supports getUserMedia and mediaDevices
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({
      video: { facingMode: isFrontCamera ? "user" : "environment" },
    })
    .then(function (stream) {
      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.play();

      // Wait for metadata to be loaded for accurate video dimensions
      videoElement.addEventListener("loadedmetadata", function () {
        // Set the canvas dimensions to match the video stream
        videoCanvas.width = videoElement.videoWidth;
        videoCanvas.height = videoElement.videoHeight;

        // Draw video frames onto the canvas
        const canvasContext = videoCanvas.getContext("2d");
        const drawVideoFrame = () => {
          // Clear the canvas
          canvasContext.clearRect(0, 0, videoCanvas.width, videoCanvas.height);

          // Flip the video frame horizontally if necessary
          canvasContext.save();

          if (isFrontCamera) {
            canvasContext.translate(videoCanvas.width, 0);
            canvasContext.scale(-1, 1);
          }

          // Draw the video frame onto the canvas
          canvasContext.drawImage(
            videoElement,
            0,
            0,
            videoCanvas.width,
            videoCanvas.height
          );
          canvasContext.restore();
          requestAnimationFrame(drawVideoFrame);
        };
        drawVideoFrame();
      });

      // Add event listener to flip button
      flipButton.addEventListener("click", function () {
        // Toggle the facing mode
        isFrontCamera = !isFrontCamera;

        // Stop the current stream
        videoElement.srcObject.getTracks().forEach(function (track) {
          track.stop();
        });

        // Create new constraints with updated facingMode
        const constraints = {
          video: {
            facingMode: isFrontCamera ? "user" : "environment",
          },
        };

        // Access the camera with updated constraints
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function (newStream) {
            videoElement.srcObject = newStream;
            videoElement.play();
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
  console.error("getUserMedia is not supported in this browser.");
}
