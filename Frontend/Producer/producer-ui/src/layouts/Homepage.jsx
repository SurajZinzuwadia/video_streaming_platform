import React, { useRef, useState, useEffect } from 'react';
import './Homepage.css';
import Navbar from './Navbar';

function Homepage() {
    const [imageData, setImageData] = useState(null);
    const [ isConnected, setIsConnected ] = useState(false);
    const socketRef = useRef(null);
  
    const connectWebSocket = () => {
      socketRef.current = new WebSocket('wss://192.168.2.111:3000'); // Update WebSocket URL if necessary
  
      socketRef.current.onopen = () => {
        // console.log('WebSocket connection established');
        setIsConnected(true);
      };
  
      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.image) {
          setImageData(data.image);
        }
      };
  
      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      socketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
      };
    };
  
    const handleConnect = () => {
      if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
        connectWebSocket();
      } else {
        socketRef.current.close();
      }
    };
  
  return (
    <div className="homepage">
        <Navbar />
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
 
            {!isConnected ? (
                <>
                    <h1>Welcome to the Live Stream</h1>

                    <button className="cta-button" onClick={handleConnect}>
                Join Live
            </button>
                </>
            ):(
                <>
                <div className="video-thumbnail">
                    {imageData && <img src={imageData} alt="Video Thumbnail" />}
                </div> 
                <button className="close-video-button" onClick={handleConnect}>
                Close Video
                </button>
                </>

            )}       
            {/* <a href="#get-started" className="cta-button">
            Join Live
          </a> */}
        </div>
      </section>
    </div>
  );
}

export default Homepage;
