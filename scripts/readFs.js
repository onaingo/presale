require('dotenv').config({ path: '../.env' }); // Load environment variables from .env
const { ethers } = require('ethers');

// Check if PRIVATE_KEY is loaded correctly
if (!process.env.PRIVATE_KEY) {
    console.error('Private Key is missing or not loaded correctly from the .env file');
    process.exit(1);
}

const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const vaultAddress = process.env.VAULT_ADDRESS;

const abi = [
    {
        "inputs": [],
        "name": "name",
        "outputs": [{"internalType": "string","name":"","type":"string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{"internalType": "string","name":"","type":"string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token",
        "outputs": [{"internalType": "address","name":"","type":"address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"internalType": "uint256","name":"","type":"uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

const vaultContract = new ethers.Contract(vaultAddress, abi, wallet);

// Function to get token name
async function getTokenName() {
    try {
        const name = await vaultContract.name();
        console.log('Token Name:', name);
    } catch (error) {
        console.error('Error retrieving token name:', error);
    }
}

// Function to get token symbol
async function getTokenSymbol() {
    try {
        const symbol = await vaultContract.symbol();
        console.log('Token Symbol:', symbol);
    } catch (error) {
        console.error('Error retrieving token symbol:', error);
    }
}

// Function to get token address
async function getTokenAddress() {
    try {
        const tokenAddress = await vaultContract.token();
        console.log('NFT Token Address:', tokenAddress);
    } catch (error) {
        console.error('Error retrieving token address:', error);
    }
}

// Function to get total supply
async function getTotalSupply() {
    try {
        const totalSupply = await vaultContract.totalSupply();
        const formattedTotalSupply = ethers.utils.formatUnits(totalSupply, 18); // Divide by 10^18
        console.log('Total Supply:', formattedTotalSupply);
    } catch (error) {
        console.error('Error retrieving total supply:', error);
    }
}


// Function to execute based on command-line flag
function executeFunction(flag) {
    switch(flag) {
        case '--name':
            getTokenName();
            break;
        case '--symbol':
            getTokenSymbol();
            break;
        case '--token':
            getTokenAddress();
            break;
        case '--totalSupply':
            getTotalSupply();
            break;
        default:
            console.error('Unknown flag:', flag);
            console.log('Available flags: --name, --symbol, --token, --totalSupply'); // List available flags
    }
}

// Get the command-line flag (e.g., "--name")
const flag = process.argv[2];
if (flag) {
    executeFunction(flag);
} else {
    console.error('Please provide a flag to indicate which function to run.');
    console.log('Available flags: --name, --symbol, --token, --totalSupply'); // List available flags
}
