import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const AddToWalletButton = () => {
    const [isConnected, setIsConnected] = useState(false);
    const { seqid } = useParams(); // Get the seqid from the URL

    // Access token details from Redux state using seqid
    const tokenDetails = useSelector((state) => state.fnftData.data.find(item => item.seqid === Number(seqid)));
    const tokenSymbol = tokenDetails?.symbol;
    const tokenContractAddress = tokenDetails?.tokenContractAddress;
    const tokenImage = `${window.location.origin}/images/${tokenSymbol}.jpg`;

    useEffect(() => {
        const checkWalletConnection = async () => {
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.listAccounts();
                setIsConnected(accounts.length > 0);
            }
        };

        checkWalletConnection();
    }, []);

    const handleAddToWallet = async () => {
        if (!isConnected) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                await provider.send('eth_requestAccounts', []);
                setIsConnected(true);
            } catch (error) {
                console.error('Failed to connect wallet:', error);
                alert('Failed to connect wallet.');
            }
            return;
        }

        if (!tokenSymbol || !tokenContractAddress) {
            alert('Token details are not loaded yet.');
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send('wallet_watchAsset', {
                type: 'ERC20',
                options: {
                    address: tokenContractAddress,  // Correct contract address
                    symbol: tokenSymbol,    // Token symbol
                    decimals: 18,           // Common decimal places for ERC-20 tokens
                    image: tokenImage       // URL to the token's image
                },
            });
            alert(`${tokenSymbol} has been added to your wallet!`);
        } catch (error) {
            console.error('Failed to add token to wallet:', error);
            alert('Failed to add token to wallet.');
        }
    };

    return (
        <div>
            <button className="add-to-wallet-button" onClick={handleAddToWallet}>
                {isConnected ? `Add ${tokenSymbol} to Wallet` : 'Connect Wallet'}
            </button>
        </div>
    );
};

export default AddToWalletButton;
