import React, {useState, useContext} from 'react';
import { shareParams } from '../App';

const usePaginate = (initialValue) => {

    // paginationのステータス管理
    const [paginate, setPaginate] = useState(initialValue);

    const {params, setParams} = useContext(shareParams);

    // 各ページネーションをクリックすると数字が渡ってくるのでパラメータをつけてリクエストを飛ばす
    const handlePageChange = (pageNumber) => {
        console.log('handlePageChange');
        setPaginate({...paginate, [paginate.current_page]: pageNumber});
        setParams({
            ...params,
            paginate: {
                ...paginate,
                'current_page': pageNumber
            }
        });
    };

    //　行数の指定をした場合にパラメータを渡して１ページ当たりの取得件数を変更してリクエストを飛ばす
    const handleTableRow = (e) => {
        console.log('handleTableRow');
        setPaginate({...paginate, [paginate.per_page]: e.target.value});
        setParams({
            ...params,
            paginate: {
                ...paginate,
                'per_page': Number(e.target.value)
            }
        });
    };

    return [paginate, {setPaginate, handlePageChange, handleTableRow}];

}

export default usePaginate;


