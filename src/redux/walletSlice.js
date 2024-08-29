// src/redux/walletSlice.js
import { createSlice } from '@reduxjs/toolkit';

const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        isConnected: false,
        address: '',
    },
    reducers: {
        connectWallet: (state, action) => {
            state.isConnected = true;
            state.address = action.payload;
        },
        disconnectWallet: (state) => {
            state.isConnected = false;
            state.address = '';
        },
    },
});

export const { connectWallet, disconnectWallet } = walletSlice.actions;
export default walletSlice.reducer;
