import React from 'react';
import VideoCard from './VideoCard';
import './VideoCardGrid.css';

function VideoCardGrid() {
  const videoData = [
    { id: 1, title: 'Darshan Live Stream', thumbnail: 'https://example.com/video1-thumbnail.jpg' },
    { id: 2, title: 'Krishn\'s Live Stream', thumbnail: 'https://example.com/video2-thumbnail.jpg' },
    { id: 3, title: 'Harsh\'s Live Stream', thumbnail: 'https://example.com/video3-thumbnail.jpg' },
    // Add more video data as needed
  ];

  return (
    <div className="video-card-grid">
      {videoData.map(video => (
        <VideoCard
          key={video.id}
          title={video.title}
          // thumbnail={video.thumbnail}
        />
      ))}
    </div>
  );
}

export default VideoCardGrid;
