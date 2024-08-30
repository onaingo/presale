import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // Ensure this import is correct
import axios from 'axios';

// Async thunk to fetch data from the API
export const fetchFnftData = createAsyncThunk('fnft/fetchFnftData', async () => {
    const response = await axios.get('http://localhost:3001/fnftdata');
    return response.data;
});

const newSlice = createSlice({
    name: 'fnft',
    initialState: {
        data: [], // To hold the fetched data
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFnftData.pending, (state) => {
                state.status = 'loading';
                console.log('Loading data...');
            })
            .addCase(fetchFnftData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload; // Store the fetched data
                console.log('Data stored in state:', state.data);
            })
            .addCase(fetchFnftData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                console.error('Failed to fetch data:', state.error);
            });
    },
});


export default newSlice.reducer;
