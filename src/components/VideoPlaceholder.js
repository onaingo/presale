import React, { useState } from 'react';
import '../styles/videoPlaceholder.css';
import Modal from './Modal';
import VideoPlayer from './VideoPlayer';
import RED_WHALE_LOGO from '../images/Y1.jpg';
import Y1Video from '../NFT-videos/Y1.mp4';

const VideoPlaceholder = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <img
                src={RED_WHALE_LOGO}
                alt="NFT Placeholder"
                className="video-placeholder-image"
                onClick={handleImageClick}
            />
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <VideoPlayer videoSrc={Y1Video} />
                </Modal>
            )}
        </>
    );
};

export default VideoPlaceholder;
