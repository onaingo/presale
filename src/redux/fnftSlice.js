import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTokenDetails = createAsyncThunk(
    'fnft/fetchTokenDetails',
    async (seqid, { getState }) => {
        console.log('fetchTokenDetails called with seqid:', seqid); // Log to confirm the thunk is being called

        const { fnft } = getState();

        // Check if the token details are already cached
        const cachedDetails = fnft.tokenDetailsCache[seqid];
        if (cachedDetails) {
            return cachedDetails; // Return cached value if it exists
        }

        // Fetch from the server
        const response = await axios.get('http://localhost:3001/fnftdata');
        console.log('Server Response:', response.data); // Log the full response
        const fnftItem = response.data.find(item => item.seqid === Number(seqid));

        if (fnftItem) {
            return {
                symbol: fnftItem.symbol,
                tokenContractAddress: fnftItem.tokenContractAddress, // Ensure this is being returned
            };
        } else {
            return null;
        }
    }
);

const fnftSlice = createSlice({
    name: 'fnft',
    initialState: {
        tokenDetails: { symbol: null, tokenContractAddress: null }, // Updated to hold both symbol and contract address
        tokenDetailsCache: {}, // Initialize cache as an empty object
        currentSeqid: null, // Store the current seqid to check for changes
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTokenDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTokenDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tokenDetails = action.payload;
                state.currentSeqid = action.meta.arg; // Update currentSeqid to the new value

                // Update the cache with the fetched token details
                state.tokenDetailsCache[action.meta.arg] = action.payload;
            })
            .addCase(fetchTokenDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default fnftSlice.reducer;
