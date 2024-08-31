// src/pages/MainPage.js
import React from 'react';
import { ToastContainer } from '../components/Toast';
import { useParams } from 'react-router-dom'; 
import VideoPlaceholder from '../components/VideoPlaceholder';
import Tabs from '../components/Tabs';
import SwapInterface from '../components/SwapInterface';
import { FnftDataProvider } from '../contexts/FnftDataContext'; // Import the context provider
import './mainPage.css';

const MainPage = () => {
    const { seqid } = useParams(); // Get the seqid from the URL
    const handleWalletConnect = (account) => {
        console.log('Connected to account:', account);
    };

    return (
        <FnftDataProvider>  {/* Wrap your main page with the provider */}
            <div className="main-page">
                <ToastContainer /> 
                <div className="content-wrapper">
                    <div className="left-section">
                        <VideoPlaceholder seqid={seqid} />
                    </div>
                    <div className="right-section">
                        <Tabs
                            tabs={[
                                {
                                    label: 'Swap',
                                    content: <SwapInterface seqid={seqid} />,
                                },
                                {
                                    label: 'Pool',
                                    content: <div>Add Liquidity Content</div>,
                                },
                                {
                                    label: 'Earn',
                                    content: <div>Lock LP Content</div>,
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </FnftDataProvider>
    );
};

export default MainPage;
