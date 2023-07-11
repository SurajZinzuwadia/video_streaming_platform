import React, { useEffect, useRef } from 'react';

function VideoCard() {
  const videoRef = useRef(null);
  const socketRef = useRef(null);

  const connectWebSocket = () => {
    socketRef.current = new WebSocket('wss://192.168.2.93:3000'); // Update WebSocket URL if necessary

    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    socketRef.current.onmessage = (event) => {
      const videoData = event.data;

      if (videoRef.current) {
        videoRef.current.src = URL.createObjectURL(videoData);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  const handleConnect = () => {
    if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
      connectWebSocket();
    }
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div className="video-card">
      <button onClick={handleConnect}>Connect</button>
      <video ref={videoRef} controls autoPlay muted />
    </div>
  );
}

// export default VideoCard;


// image based


import React, { useState, useEffect, useRef } from 'react';
import './VideoCard.css';

function VideoCard({ title }) {
  const [imageData, setImageData] = useState(null);
  const socketRef = useRef(null);

  const connectWebSocket = () => {
    socketRef.current = new WebSocket('wss://192.168.2.93:3000'); // Update WebSocket URL if necessary

    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.image) {
        setImageData(data.image);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  const handleConnect = () => {
    if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
      connectWebSocket();
    }
  };

  return (
    <div className="video-card">
      <div className="video-thumbnail">
        {imageData && <img src={imageData} alt="Video Thumbnail" />}
      </div>
      <div className="video-info">
        <h3 className="video-title">{title}</h3>
      </div>
      <button className="join-live-button" onClick={handleConnect}>
        Join Live
      </button>
    </div>
  );
}

export default VideoCard;
