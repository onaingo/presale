import React, { useState, useEffect, useContext, useMemo } from 'react';
import '../styles/swapInterface.css';
import Button from './Button';
import ProgressBar from './ProgressBar';
import Tooltip from './Tooltip';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTokenSymbol } from '../redux/fnftSlice'; // Import your async thunk

const SwapInterface = ({ seqid }) => {
    const { isConnected, connectWallet, signer } = useContext(WalletContext);
    const [ethAmount, setEthAmount] = useState('');
    const [tokenAmount, setTokenAmount] = useState('');
    const [ethPriceInUSD, setEthPriceInUSD] = useState(null);
    const [remainingSupply, setRemainingSupply] = useState(200); // Example starting supply
    const totalSupply = 240; // Example total supply
    const rate = 10; // Example rate: 1 ETH = 10 Tokens
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Get the dispatch function
    const dispatch = useDispatch(); 

    // Fetch token symbol from the Redux store
    const tokenSymbol = useSelector((state) => state.fnft.tokenSymbol);
    // Fetch current load state
    const status = useSelector((state) => state.fnft.status);

    // Memoize the sale end date
    const saleEndDate = useMemo(() => new Date('2024-09-01T00:00:00Z'), []);

    // Fetch ETH price initially and then every 60 seconds
    useEffect(() => {
        const fetchETHPrice = async () => {
            try {
                const response = await axios.get('http://localhost:3001/ethprice'); // Fetch from your server
                setEthPriceInUSD(response.data.price); // Assuming the server response has a 'price' key
            } catch (error) {
                console.error('Error fetching ETH price from server:', error);
            }
        };

        fetchETHPrice();

        const interval = setInterval(() => {
            fetchETHPrice();
        }, 60000); // Fetch the price every 60 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = saleEndDate.getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                // Handle token burning logic here
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
        if (seqid) {
            dispatch(fetchTokenSymbol(seqid)); // Fetch the token symbol for the specific seqid
        }
    }, [seqid, dispatch]);

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
            alert('Please enter a valid ETH amount.');
            return;
        }

        try {
            // Example swap logic:
            // Replace this with your smart contract interaction logic
            // Assuming you have a contract instance and ABI ready
            /*
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const tx = await contract.swap({
                value: ethers.parseEther(ethAmount.toString()),
            });
            await tx.wait();
            */

            // Update remaining supply
            const newRemainingSupply = remainingSupply - tokenAmount;
            if (newRemainingSupply < 0) {
                alert('Not enough tokens remaining for this swap.');
                return;
            }
            setRemainingSupply(newRemainingSupply);

            alert(`Successfully swapped ${ethAmount} ETH for ${tokenAmount} Tokens`);
            // Reset input fields
            setEthAmount('');
            setTokenAmount('');
        } catch (error) {
            console.error('Swap failed:', error);
            alert('Swap failed. Please try again.');
        }
    };

    const getProgress = () => {
        return ((totalSupply - remainingSupply) / totalSupply) * 100;
    };

    return (
        <div className="swap-interface">
            <h2>Token Swap</h2>
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
                    <span className="currency">
                        {status === 'loading' ? 'Loading...' : `$${tokenSymbol}`}
                    </span>
                    <span className="usd-value">
                        {ethPriceInUSD !== null && tokenAmount
                            ? `$${((tokenAmount / rate) * ethPriceInUSD).toFixed(2)} USD`
                            : '—'}
                    </span>
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
