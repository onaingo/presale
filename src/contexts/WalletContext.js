import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const checkWalletConnection = async () => {
            if (window.ethereum) {
                try {
                    const web3Provider = new ethers.BrowserProvider(window.ethereum);
                    const accounts = await web3Provider.listAccounts();
                    if (accounts.length > 0) {
                        const account = accounts[0];
                        setWalletAddress(account);
                        setProvider(web3Provider);
                        setSigner(web3Provider.getSigner());
                        setIsConnected(true);
                    }
                } catch (error) {
                    console.error('Error checking wallet connection:', error);
                }
            } else {
                console.warn('No Ethereum provider found. Install MetaMask.');
            }
        };

        checkWalletConnection();

        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', async (accounts) => {
                if (accounts.length > 0) {
                    const newProvider = new ethers.BrowserProvider(window.ethereum);
                    const newSigner = await newProvider.getSigner();
                    setWalletAddress(accounts[0]);
                    setProvider(newProvider);
                    setSigner(newSigner);
                    setIsConnected(true);
                } else {
                    setWalletAddress(null);
                    setIsConnected(false);
                }
            });

            window.ethereum.on('chainChanged', async () => {
                const newProvider = new ethers.BrowserProvider(window.ethereum);
                const newSigner = await newProvider.getSigner();
                const newAddress = await newSigner.getAddress();
                setProvider(newProvider);
                setSigner(newSigner);
                setWalletAddress(newAddress);
                setIsConnected(true);
            });
        }

        return () => {
            if (window.ethereum.removeListener) {
                window.ethereum.removeListener('accountsChanged');
                window.ethereum.removeListener('chainChanged');
            }
        };
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const web3Provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await web3Provider.send('eth_requestAccounts', []);
                if (accounts.length > 0) {
                    const account = accounts[0];
                    setWalletAddress(account);
                    setProvider(web3Provider);
                    setSigner(web3Provider.getSigner());
                    setIsConnected(true);
                }
            } catch (error) {
                console.error('Error connecting wallet:', error);
            }
        } else {
            alert('MetaMask is not installed. Please install it to use this feature.');
        }
    };

    return (
        <WalletContext.Provider
            value={{
                walletAddress,
                provider,
                signer,
                isConnected,
                connectWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
