import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFnftData } from '../redux/newSlice'; // Import from the new slice
import { useParams } from 'react-router-dom';

const MetadataTestPage = () => {
    const { seqid } = useParams(); // Get the seqid from the URL
    const dispatch = useDispatch();

    // Ensure the fnftData is fetched correctly
    const fnftData = useSelector((state) => state.fnftData.data);

    // Safeguard for when data is not yet available or is undefined
    const item = fnftData?.length ? fnftData.find(item => item.seqid === Number(seqid)) : null;

    useEffect(() => {
        if (!item) {
            dispatch(fetchFnftData()); // Fetch the data if it's not already in the state
        }
    }, [dispatch, item]);

    if (!item) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Metadata Test Page</h2>
            <p><strong>SeqID:</strong> {item.seqid}</p>
            <p><strong>ID:</strong> {item.id}</p>
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Symbol:</strong> {item.symbol}</p>
            <p><strong>Token Contract Address:</strong> {item.tokenContractAddress}</p>
            <p><strong>NFT Contract Address:</strong> {item.nftContractAddress}</p>
            <p><strong>IPFS URL:</strong> <a href={item.ipfsUrl} target="_blank" rel="noopener noreferrer">{item.ipfsUrl}</a></p>
            <p><strong>Local Image:</strong> {item.localImage}</p>
            <p><strong>Local Video:</strong> {item.localVideo}</p>
        </div>
    );
};

export default MetadataTestPage;
