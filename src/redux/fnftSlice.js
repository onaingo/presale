import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTokenSymbol = createAsyncThunk(
    'fnft/fetchTokenSymbol',
    async (seqid, { getState }) => {
        const { fnft } = getState();

        // Check if the token symbol is already cached
        const cachedSymbol = fnft.tokenSymbolsCache[seqid];
        if (cachedSymbol) {
            return cachedSymbol; // Return cached value if it exists
        }

        // If not cached, fetch from the server
        const response = await axios.get('http://localhost:3001/fnftdata');
        const fnftItem = response.data.find(item => item.seqid === Number(seqid));
        return fnftItem ? fnftItem.symbol : null;
    }
);

const fnftSlice = createSlice({
    name: 'fnft',
    initialState: {
        tokenSymbol: null,
        tokenSymbolsCache: {}, // Initialize as an empty object
        currentSeqid: null, // Store the current seqid to check for changes
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTokenSymbol.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTokenSymbol.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tokenSymbol = action.payload;
                state.currentSeqid = action.meta.arg; // Update currentSeqid to the new value
                
                // Update the cache with the fetched token symbol
                state.tokenSymbolsCache[action.meta.arg] = action.payload;
            })
            .addCase(fetchTokenSymbol.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default fnftSlice.reducer;
