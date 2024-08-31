import React, { useState, useEffect, useContext, useMemo } from 'react';
import '../styles/swapInterface.css';
import Button from './Button';
import ProgressBar from './ProgressBar';
import Tooltip from './Tooltip';
import { WalletContext } from '../contexts/WalletContext';
import { useFnftData } from '../contexts/FnftDataContext';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AddToWalletButton from './AddToWalletButton';
import { ethers } from 'ethers';
import { fnftTokenLogicABI } from '../smartContracts/ABI';
import { toast } from 'react-toastify';

const SwapInterface = ({ seqid }) => {
    const { isConnected, connectWallet, walletAddress, signer } = useContext(WalletContext);
    const fnftData = useFnftData();
    const [ethAmount, setEthAmount] = useState('');
    const [tokenAmount, setTokenAmount] = useState('');
    const [ethPriceInUSD, setEthPriceInUSD] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);
    const [remainingSupply, setRemainingSupply] = useState(200);
    const totalSupply = 240;
    const rate = 10;
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const status = useSelector((state) => state.fnftData.status);
    const tokenDetails = fnftData.find(item => item.seqid === Number(seqid));
    const tokenSymbol = tokenDetails?.symbol;
    const saleEndDate = useMemo(() => new Date('2024-09-01T00:00:00Z'), []);

    useEffect(() => {
        const fetchETHPrice = async () => {
            try {
                const response = await axios.get('http://localhost:3001/ethprice');
                setEthPriceInUSD(response.data.price);
            } catch (error) {
                console.error('Error fetching ETH price from server:', error);
            }
        };

        fetchETHPrice();

        const interval = setInterval(() => {
            fetchETHPrice();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = saleEndDate.getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [saleEndDate]);

    useEffect(() => {
        const fetchWalletBalance = async () => {
            if (isConnected && window.ethereum && tokenDetails) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner(); // Define the signer here
                    const address = await signer.getAddress(); // Fetch the signer's address
                    const balance = await fetchTokenBalance(signer, tokenDetails.tokenContractAddress);
                    setWalletBalance(balance);
                } catch (error) {
                    console.error('Error fetching wallet balance:', error);
                    setWalletBalance(null);
                }
            }
        };

        fetchWalletBalance();
    }, [isConnected, tokenDetails, walletAddress, signer]);

    const handleEthChange = (e) => {
        const ethValue = e.target.value;
        setEthAmount(ethValue);
        setTokenAmount(ethValue * rate);
    };

    const handleTokenChange = (e) => {
        const tokenValue = e.target.value;
        setTokenAmount(tokenValue);
        setEthAmount(tokenValue / rate);
    };

    const handleSwap = async () => {
        if (!isConnected) {
            connectWallet();
            return;
        }

        if (!ethAmount || ethAmount <= 0) {
            toast.info('Please enter a valid ETH amount.');
            return;
        }

        try {
            const newRemainingSupply = remainingSupply - tokenAmount;
            if (newRemainingSupply < 0) {
                toast.error('Not enough tokens remaining for this swap.');
                return;
            }
            setRemainingSupply(newRemainingSupply);

            toast.success(`Successfully swapped ${ethAmount} ETH for ${tokenAmount} Tokens`);
            setEthAmount('');
            setTokenAmount('');
        } catch (error) {
            console.error('Swap failed:', error);
            toast.error('Swap failed. Please try again.');
        }
    };

    const getProgress = () => {
        return ((totalSupply - remainingSupply) / totalSupply) * 100;
    };

    const fetchTokenBalance = async (signer, tokenContractAddress) => {
        try {
            if (!signer) throw new Error("Signer is not available");

            const userAddress = await signer.getAddress();
            const contract = new ethers.Contract(tokenContractAddress, fnftTokenLogicABI, signer);
            const balance = await contract.balanceOf(userAddress);
            return ethers.formatUnits(balance, 18); 
        } catch (error) {
            console.error('Error fetching token balance:', error);
            return null;
        }
    };

    return (
        <div className="swap-interface">
            <h2>Own A Piece Of {tokenSymbol}</h2>
            <div className="swap-form">
                <div className="input-group">
                    <label htmlFor="ethAmount">Buy</label>
                    <input
                        type="number"
                        id="ethAmount"
                        value={ethAmount}
                        onChange={handleEthChange}
                        placeholder="0.0"
                        step="0.01"
                        min="0"
                    />
                    <span className="currency">ETH</span>
                    <span className="usd-value">
                        {ethPriceInUSD !== null && ethAmount
                            ? `$${(ethAmount * ethPriceInUSD).toFixed(2)} USD`
                            : '—'}
                    </span>
                </div>
                <div className="input-group">
    <label htmlFor="tokenAmount">Receive</label>
    <input
        type="number"
        id="tokenAmount"
        value={tokenAmount}
        onChange={handleTokenChange}
        placeholder="0.0"
        step="1"
        min="0"
    />
    <span className={`currency ${walletBalance !== null && parseFloat(walletBalance) > 0 ? 'adjusted-token-symbol' : ''}`}>
        {status === 'loading' ? 'Loading...' : tokenSymbol ? `$${tokenSymbol}` : '—'}
    </span>

    {/* Commented out the conditional rendering for future use */}
    {/*
    {walletBalance === null || parseFloat(walletBalance) === 0 ? (
        <AddToWalletButton className="add-to-wallet-button" disabled={!isConnected} />
    ) : null}
    */}

    {/* Always render the AddToWalletButton */}
    <AddToWalletButton className="add-to-wallet-button" disabled={!isConnected} />
    <span className="wallet-balance">
        {walletBalance !== null ? `${walletBalance} ${tokenSymbol}` : '—'}
    </span>
        {/* Etherscan Button */}
        {tokenDetails && tokenDetails.tokenContractAddress && (
        <a
            href={`https://sepolia.etherscan.io/token/${tokenDetails.tokenContractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="etherscan-button"
        >
            View on Etherscan
        </a>
    )}
</div>
                <Button
                    label={isConnected ? 'Swap' : 'Connect Wallet'}
                    onClick={handleSwap}
                    type="primary"
                    className="custom-buy-button"
                />
            </div>
            <div className="progress-bar-container">
                <ProgressBar progress={getProgress()} />
                <div className="token-info">
                    <div className="flashy-bubble">
                        <div className="orbiting-bubble"></div>
                        <div className="orbiting-bubble"></div>
                        <div className="orbiting-bubble"></div>
                    </div>
                    <p>{remainingSupply} Tokens remaining</p>
                </div>
            </div>

            <div className="countdown-timer">
                <Tooltip
                    id="sale-end-tooltip"
                    text="Unclaimed tokens will be burnt when the timer hits zero!"
                >
                    <span className="info-icon">ℹ️</span>
                </Tooltip>
                <div className="timer">
                    {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
                </div>
            </div>
        </div>
    );
};

export default SwapInterface;
