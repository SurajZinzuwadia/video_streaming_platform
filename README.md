To run the project

1. Build the image
   `docker build -t video-streaming-image .`

2. Run the image
   `docker run -d -p 80:8080 -p 443:8081 --name video-streaming-container video-streaming-image`

The URL: https://localhost:443

The README.md of frontend-development
