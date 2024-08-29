import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Replace with your actual server URL if different

export const fetchFNFTData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/fnftdata`);
        return response.data;
    } catch (error) {
        console.error('Error fetching F-NFT data:', error);
        throw error;
    }
};
