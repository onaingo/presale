import React, { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import Button from './Button';
import '../styles/connectWalletButton.css';

const truncateAddress = (address) => {
    if (typeof address !== 'string') return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const ConnectWalletButton = () => {
    const { walletAddress, connectWallet } = useContext(WalletContext);

    return (
        <Button
            label={walletAddress ? truncateAddress(walletAddress) : 'Connect Wallet'}
            onClick={connectWallet}
            type="primary"
            className="custom-connect-button"
        />
    );
};

export default ConnectWalletButton;
