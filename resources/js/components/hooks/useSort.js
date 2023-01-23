import React, {useState} from 'react';
import { useParamsContext } from '../context/ParamsContext';

const useSort = (initialValue) => {

    // ソート管理
    const [sort, setSort] = useState(initialValue);
    // useContextでグローバルで管理するパラメータを取得
    const {params, setParams} = useParamsContext();

    const handleSort = (e) => {
        console.log('handleSort直前のparams', params);
        // setSort({ ...sort, [e.target.name]: e.target.value });
        setParams({
            ...params,
            sort: {
                ...params.sort,
                [e.target.name]: e.target.value
            }
        });
    }

    return [sort, {setSort, handleSort}];

}

export default useSort;
