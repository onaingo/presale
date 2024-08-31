import React from 'react';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddToWalletButton = ({ className, disabled }) => {
    const { seqid } = useParams(); // Get the seqid from the URL

    // Access token details from Redux state using seqid
    const tokenDetails = useSelector((state) => state.fnftData.data.find(item => item.seqid === Number(seqid)));
    const tokenSymbol = tokenDetails?.symbol;
    const tokenContractAddress = tokenDetails?.tokenContractAddress;
    const tokenImage = `${window.location.origin}/images/${tokenSymbol}.jpg`;

    const handleAddToWallet = async () => {
        if (disabled || !tokenSymbol || !tokenContractAddress) {
            toast.warn('Token details are not loaded yet or the button is disabled.');
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
            toast.success(`${tokenSymbol} has been added to your wallet!`);
        } catch (error) {
            console.error('Failed to add token to wallet:', error);
            toast.error('Failed to add token to wallet.');
        }
    };

    return (
        <div>
            <button 
                className={`add-to-wallet-button ${disabled ? 'disabled' : ''}`}
                onClick={handleAddToWallet}
                disabled={disabled}
            >
                {`Add`}
            </button>
        </div>
    );
};

export default AddToWalletButton;
