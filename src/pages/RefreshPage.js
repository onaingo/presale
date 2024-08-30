import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchFnftData } from '../redux/newSlice'; // Updated to use newSlice

const RefreshPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFnftData()); // Fetch data when the page is loaded
        window.location.href = '/'; // Redirect to the main page after refresh
    }, [dispatch]);

    return (
        <div>
            <p>Refreshing data...</p>
        </div>
    );
};

export default RefreshPage;
