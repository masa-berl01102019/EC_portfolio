import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import Pagination from 'react-js-pagination'; // パラメータ https://www.npmjs.com/package/react-js-pagination
import useFetchApiData from "../../../hooks/useFetchApiData";
import useCreateParams from "../../../hooks/useCreateParams";
import { useParamsContext } from '../../../context/ParamsContext';

function OrderIndexPage() {

    // urlの設定
    const baseUrl = `/api/user/orders`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'ORDER';
    // URLパラメータ変更のフックの呼び出し
    const [dateRangeStart, dateRangeEnd, dateRangeField, {handleFilter, handleFilterCheckbox, handleFilterDateRange, handleCurrentPage, handlePerPage, handleSort}] = useCreateParams();
    // useContext呼び出し
    const {params, setParams, scope, setScope} = useParamsContext();
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', [],  model);
    // APIから取得したデータを変数に格納
    const orders = data.data? data.data: null;

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(scope === null || scope !== model) { // 全てのページにおいての初回読み込みなので初期値を代入
            console.log('ORDERにてparamsの初期値をセットしてscopeを変更');
            setParams({
                ...params,
                sort: {},
                filter: {},
            });
            setScope(model);
        }
        // ユーザー削除に成功した場合にdelete:trueが帰ってくるので条件分岐
        if(data.create && data.create === true) {
            // ページネーションの設定を保持して再度読み込み
            dispatch({ type: 'READ', url: baseUrl });
        }
    },[data]);

    // 描画のみを担当
    return (
        isLoading ? (
            <CircularProgress disableShrink />
        ) : errorMessage && errorMessage.httpRequestError ? (
            <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p>
        ) : (
            <>
                <h1>購入履歴</h1>
                
                {   orders && !errorMessage &&
                    <ul> 
                        {                  
                            orders.map((order) =>
                                <li key={order.id} style={{'display' : 'flex'}}>
                                    <Link to={`/items/${order.item_id}`}>
                                        <img src={order.top_image} alt="" style={{ 'width':'150px', 'height': '150px', 'display': 'block' }}/>
                                        { order.stock_status === 0 && <p style={{'color': 'red'}}>在庫なし</p>}
                                    </Link>
                                    <div>
                                        <p>{order.brand_name}</p>
                                        <p>{order.item_name}</p>
                                        <p>{order.order_price_text} (税別)</p>
                                        <p>{order.order_color} / {order.order_size}</p>
                                        <p>{order.created_at}</p>
                                        <p>
                                            { 
                                                order.cart_status === 0 ? (
                                                    <button 
                                                        onClick={ () => { dispatch({type:'CREATE', form: {sku_id: `${order.sku_id}`}, url:`/api/user/carts`}); }}
                                                    >
                                                        カートに入れる
                                                    </button>
                                                ) : (
                                                    <button disabled={true}>カートに登録済</button>
                                                )
                                            }
                                        </p>
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                }
                { data.meta &&
                    <>
                        <label>行数<input type='number' onBlur={handlePerPage} defaultValue={data.meta.per_page} style={{'width': '40px'}} /></label>
                        <div>検索結果{data.meta.total}</div>
                        <div>現在のページ{data.meta.current_page}</div>
                        <Pagination
                            activePage={data.meta.current_page}
                            itemsCountPerPage={data.meta.per_page}
                            totalItemsCount={data.meta.total}
                            pageRangeDisplayed={data.meta.page_range_displayed}
                            onChange={handleCurrentPage}
                        />
                    </>
                } 
            </>
        )
    );
}

export default OrderIndexPage;



