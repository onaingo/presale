import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '../styles/walletConnectButton.css';

const WalletConnectButton = () => {
    return (
        <div className="wallet-connect-button">
            <ConnectButton />
        </div>
    );
};

export default WalletConnectButton;
