const videoCanvas = document.getElementById("videoCanvas");
const flipButton = document.getElementById("flipButton");

// Check if browser supports getUserMedia and mediaDevices
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.play();

      // Draw video frames onto the canvas
      const canvasContext = videoCanvas.getContext("2d");
      const drawVideoFrame = () => {
        canvasContext.drawImage(
          videoElement,
          0,
          0,
          videoCanvas.width,
          videoCanvas.height
        );
        requestAnimationFrame(drawVideoFrame);
      };
      drawVideoFrame();

      // Add event listener to flip button
      flipButton.addEventListener("click", function () {
        // Stop the current stream
        videoElement.srcObject.getTracks().forEach(function (track) {
          track.stop();
        });

        // Create new constraints with flipped facingMode
        const constraints = {
          video: {
            facingMode:
              videoElement.srcObject.getVideoTracks()[0].getSettings()
                .facingMode === "user"
                ? "environment"
                : "user",
          },
        };

        // Access the camera with flipped constraints
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
