FROM ubuntu:latest

# Install required libraries
RUN apt-get update && \
    apt-get install -y \
        build-essential \
        cmake \
        git \
        pkg-config \
        libavcodec-dev \
        libavformat-dev \
        libavutil-dev

WORKDIR /app

# Copy the source code into the container
COPY Video-Encoding-Server .

# Compile the code
RUN g++ -o VideoEncoder VideoEncoder.cpp -lavcodec -lavformat -lavutil

# Set the entrypoint
ENTRYPOINT ["./VideoEncoder"]
