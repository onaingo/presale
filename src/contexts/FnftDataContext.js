import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFnftData } from '../redux/newSlice';

const FnftDataContext = createContext();

export const useFnftData = () => {
    return useContext(FnftDataContext);
};

export const FnftDataProvider = ({ children }) => {
    const dispatch = useDispatch();
    const fnftData = useSelector((state) => state.fnftData.data);
    const status = useSelector((state) => state.fnftData.status);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchFnftData());
        }
    }, [status, dispatch]);

    return (
        <FnftDataContext.Provider value={fnftData}>
            {children}
        </FnftDataContext.Provider>
    );
};
