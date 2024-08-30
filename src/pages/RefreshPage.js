import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchTokenDetails } from '../redux/fnftSlice'; // Adjust the import path if necessary

const RefreshPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTokenDetails());
        // Redirect to the main page or any other page after refresh
        window.location.href = '/';
    }, [dispatch]);

    return (
        <div>
            <p>Refreshing data...</p>
        </div>
    );
};

export default RefreshPage;
