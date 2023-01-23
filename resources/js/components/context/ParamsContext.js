import React, { createContext, useState, useContext } from 'react';

const ParamsContext = createContext();

export function useParamsContext() {
    return useContext(ParamsContext);
}

export function ParamsProvider({ children }) {

    const [params, setParams] = useState({
        paginate: {},
        filter: {},
        sort: {}
    });

    const value = {
        params,
        setParams
    }

    return (
        <ParamsContext.Provider value={value}>{children}</ParamsContext.Provider>
    );
}
