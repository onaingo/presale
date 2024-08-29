import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTokenSymbol } from '../redux/fnftSlice'; // Ensure this import is correct
import { useParams } from 'react-router-dom'; // Assuming you are using react-router for routing

const TestPage = () => {
    const { seqid } = useParams(); // Get the seqid from the URL
    const dispatch = useDispatch();
    const tokenSymbol = useSelector((state) => state.fnft.tokenSymbol);

    useEffect(() => {
        if (seqid) {
            dispatch(fetchTokenSymbol(Number(seqid))); // Dispatch the fetch action with the seqid
        }
    }, [dispatch, seqid]);

    return (
        <div>
            <h2>Test Page</h2>
            <p>SeqID: {seqid}</p>
            <p>Token Symbol: {tokenSymbol || 'Loading...'}</p>
            {/* Add more fields as necessary to test */}
        </div>
    );
};

export default TestPage;
