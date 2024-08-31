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
    const [currencyType, setCurrencyType] = useState('ETH');

    // Function to determine the step based on the current value
    const getDynamicStep = (value) => {
        if (value && value.includes('.')) {
            const decimalLength = value.split('.')[1]?.length || 0;
            return Math.pow(10, -decimalLength);
        }
        return 1; // Default step if there are no decimals
    };

    // Switchy ETH & USD values
    const toggleCurrencyType = () => {
        if (currencyType === 'ETH') {
            if (ethAmount && ethPriceInUSD) {
                const usdValue = (parseFloat(ethAmount) * ethPriceInUSD).toFixed(2);
                setEthAmount(usdValue);
            }
            setCurrencyType('USD');
        } else {
            if (ethAmount && ethPriceInUSD) {
                const ethValue = (parseFloat(ethAmount) / ethPriceInUSD).toFixed(6);
                setEthAmount(ethValue);
            }
            setCurrencyType('ETH');
        }
    };    

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
                    const balance = await fetchTokenBalance(signer, tokenDetails.vaultAddress);
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
        let value = e.target.value;
    
        if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
            setEthAmount(''); 
            setTokenAmount(''); 
            return;
        }
    
        if (value.length > 8) {
            value = value.slice(0, 8);
        }
    
        setEthAmount(value);
    
        if (currencyType === 'ETH') {
            setTokenAmount(Number(parseFloat(value) * rate).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 6
            }));
        } else {
            setTokenAmount(Number(parseFloat(value) / ethPriceInUSD * rate).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 6
            }));
        }
    };    

    const handleTokenChange = (e) => {
        let tokenValue = e.target.value;
    
        if (isNaN(parseFloat(tokenValue)) || parseFloat(tokenValue) < 0) {
            setTokenAmount(''); 
            setEthAmount(''); 
            return;
        }
    
        if (tokenValue.length > 8) {
            tokenValue = tokenValue.slice(0, 8);
        }
    
        setTokenAmount(tokenValue);
        setEthAmount(Number(parseFloat(tokenValue) / rate).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 6
        }));
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
            // setEthAmount('');
            // setTokenAmount('');
        } catch (error) {
            console.error('Swap failed:', error);
            toast.error('Swap failed. Please try again.');
        }
    };
    

    const getProgress = () => {
        return ((totalSupply - remainingSupply) / totalSupply) * 100;
    };

    const fetchTokenBalance = async (signer, vaultAddress) => {
        try {
            if (!signer) throw new Error("Signer is not available");

            const userAddress = await signer.getAddress();
            const contract = new ethers.Contract(vaultAddress, fnftTokenLogicABI, signer);
            const balance = await contract.balanceOf(userAddress);
            return ethers.formatUnits(balance, 18); 
        } catch (error) {
            console.error('Error fetching token balance:', error);
            return null;
        }
    };

    return (
        <div className="swap-interface">
            <h2>Own A Piece Of Elmo</h2>
            <div className="swap-form">
        <div className="input-group">
    <label className="currencyLabel" htmlFor="ethAmount">Buy</label>
    <input
        type="number"
        id="ethAmount"
        value={ethAmount}
        onChange={handleEthChange}
        placeholder="0.0"
        step={getDynamicStep(ethAmount)}
        maxLength="8"
    />
<div className="currency-switcher">
    <span 
        className={`currency ${currencyType === 'ETH' ? 'visible' : 'hidden'}`} 
        onClick={toggleCurrencyType}
    >
        ETH
    </span>
    <span 
        className={`currency ${currencyType === 'USD' ? 'visible' : 'hidden'}`} 
        onClick={toggleCurrencyType}
    >
        USD
    </span>
</div>

    <span className="usd-value">
    {ethAmount && ethPriceInUSD === null ? (
        <div className="loading-dots">
            <span className="dot">•</span>
            <span className="dot">•</span>
            <span className="dot">•</span>
        </div>
    ) : ethAmount && currencyType === 'ETH' ? (
        `$${(parseFloat(ethAmount) * ethPriceInUSD).toFixed(2)} USD`
    ) : ethAmount && currencyType === 'USD' ? (
        `${(parseFloat(ethAmount) / ethPriceInUSD).toFixed(6)} ETH`
    ) : null}
</span>
</div>

<div className="input-group">
    <label className="currencyLabel" htmlFor="tokenAmount">Receive</label>
    <input
        type="number"
        id="tokenAmount"
        value={tokenAmount}
        onChange={handleTokenChange}
        placeholder="0.0"
        step={getDynamicStep(tokenAmount)}  // Update this line
        maxLength="8"
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
    {walletBalance !== null ? `${parseFloat(walletBalance).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 6 })} ${tokenSymbol}` : '—'}
</span>

        {/* Etherscan Button */}
        {tokenDetails && tokenDetails.vaultAddress && (
        <a
            href={`https://sepolia.etherscan.io/token/${tokenDetails.vaultAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="etherscan-button"
        >
            {tokenSymbol} on Etherscan
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
                    <p>{Number(remainingSupply).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })} Tokens remaining</p>
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
