import React from 'react';
import '../styles/videoPlayer.css';

const VideoPlayer = ({ videoSrc }) => {
    return (
        <video controls autoPlay loop className="video-player">
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
};

export default VideoPlayer;
