import React, { useState } from 'react';
import '../styles/videoPlaceholder.css';
import Modal from './Modal';
import VideoPlayer from './VideoPlayer';
import { useFnftData } from '../contexts/FnftDataContext'; // Import the context hook

const VideoPlaceholder = ({ seqid }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fnftData = useFnftData();

    // Get the token details from the fnftData context using the seqid
    const tokenDetails = fnftData.find(item => item.seqid === Number(seqid));
    const tokenSymbol = tokenDetails?.symbol;

    // Dynamically generate the image placeholder and self-hosted video URL using the token symbol
    const imagePlaceholder = `${process.env.PUBLIC_URL}/images/${tokenSymbol}.jpg`;
    const videoUrl = `${process.env.PUBLIC_URL}/videos/${tokenSymbol}.mp4`;

    // The actual URL to the ipfs video, which would be displayed as a link
    const ipfsUrl = tokenDetails?.ipfsUrl;

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
                alt={`${tokenSymbol} Placeholder`}
                className="video-placeholder-image"
                onClick={handleImageClick}
            />
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <VideoPlayer videoSrc={videoUrl} />
                    {ipfsUrl && (
    <p className="ipfs-url">
        <a href={ipfsUrl} target="_blank" rel="noopener noreferrer">
            {ipfsUrl}
        </a>
    </p>
)}

                </Modal>
            )}
        </>
    );
};

export default VideoPlaceholder;
