import React, { useState } from 'react';
import '../styles/videoPlaceholder.css';
import Modal from './Modal';
import VideoPlayer from './VideoPlayer';
import Y1Video from '../NFT-videos/Y1.mp4';

const imagePlaceholder = `${process.env.PUBLIC_URL}/images/Y1.jpg`;

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
                src={imagePlaceholder}
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
