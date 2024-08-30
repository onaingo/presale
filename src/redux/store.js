import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import walletReducer from './walletSlice';
import fnftReducer from './fnftSlice';
import newSliceReducer from './newSlice'; // Import the new slice

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  wallet: walletReducer,
  fnft: fnftReducer,
  fnftData: newSliceReducer, // Add the new slice reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
