import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchTokenDetails } from '../redux/fnftSlice';
import '../pages/testComponents.css';
import AddToWalletButton from '../components/AddToWalletButton';

const TestComponents = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const seqid = 1; // Use a valid seqid for testing
        dispatch(fetchTokenDetails(seqid)); // Ensure this is correctly dispatched
        console.log('Dispatched fetchTokenDetails with seqid:', seqid); // Log to confirm dispatch
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
