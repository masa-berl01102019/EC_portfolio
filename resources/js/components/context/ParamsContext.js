import React, { createContext, useState, useContext } from 'react';

const ParamsContext = createContext();

export function useParamsContext() {
    return useContext(ParamsContext);
}

export function ParamsProvider({ children }) {
    // paramsのstateをセット
    const [params, setParams] = useState({
        paginate: {},
        filter: {},
        sort: {}
    });
    // paramsの適用範囲のstateをセット
    const [scope, setScope] = useState(null);
    // 値とメソッドを代入
    const value = {
        params,
        setParams,
        scope,
        setScope,
    }

    return (
        <ParamsContext.Provider value={value}>{children}</ParamsContext.Provider>
    );
}
