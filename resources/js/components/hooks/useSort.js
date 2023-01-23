import React from 'react';
import { useParamsContext } from '../context/ParamsContext';

const useSort = () => {

    // useContextでグローバルで管理するパラメータを取得
    const {params, setParams} = useParamsContext();

    const handleSort = (e) => {
        console.log('handleSort直前のparams', params);
        setParams({
            ...params,
            sort: {
                ...params.sort,
                [e.target.name]: e.target.value
            }
        });
    }

    return {handleSort};

}

export default useSort;
