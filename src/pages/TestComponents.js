import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchFnftData } from '../redux/newSlice'; // Updated to use newSlice
import '../pages/testComponents.css';
import AddToWalletButton from '../components/AddToWalletButton';

const TestComponents = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFnftData()); // Ensure data is fetched for testing
    }, [dispatch]);

    return (
        <div className="test-components-container">
            <h2>Test Components</h2>
            <div className="test-component">
                <h3>Add To Wallet Button</h3>
                <AddToWalletButton />
            </div>
        </div>
    );
};

export default TestComponents;
