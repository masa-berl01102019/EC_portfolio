import React, {useState, useContext} from 'react';
import { shareParams } from '../App';

const useSort = (initialValue) => {

    // ソート管理
    const [sort, setSort] = useState(initialValue);

    const {params, setParams} = useContext(shareParams);

    const handleSort = (e) => {
        console.log('handleSort');
        setSort({
            ...sort,
            [e.target.name]: e.target.value
        });
        setParams({
            ...params,
            sort: {
                ...sort,
                [e.target.name]: e.target.value
            }
        });
    }

    return [sort, {setSort, handleSort}];

}

export default useSort;
