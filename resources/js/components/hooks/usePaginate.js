import React from 'react';
import { useParamsContext } from '../context/ParamsContext';

const usePaginate = () => {

    // useContextでグローバルで管理するパラメータを取得
    const {params, setParams} = useParamsContext();

    // 各ページネーションをクリックすると数字が渡ってくるのでパラメータをつけてリクエストを飛ばす
    const handlePageChange = (pageNumber) => {
        console.log('handlePageChange直前のparams', params);
        setParams({
            ...params,
            paginate: {
                ...params.paginate,
                'current_page': pageNumber
            }
        });
    };

    //　行数の指定をした場合にパラメータを渡して１ページ当たりの取得件数を変更してリクエストを飛ばす
    const handleTableRow = (e) => {
        console.log('handleTableRow直前のparams', params);
        setParams({
            ...params,
            paginate: {
                ...params.paginate,
                'per_page': Number(e.target.value)
            }
        });
    };

    return {handlePageChange, handleTableRow};

}

export default usePaginate;


