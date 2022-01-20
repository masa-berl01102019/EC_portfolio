import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import Pagination from 'react-js-pagination'; // パラメータ https://www.npmjs.com/package/react-js-pagination
import useFetchApiData from "../../../hooks/useFetchApiData";
import useInputCheckBox from "../../../hooks/useInputCheckBox";
import usePaginate from "../../../hooks/usePaginate";
import useSort from "../../../hooks/useSort";
import useFilter from "../../../hooks/useFilter";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import { useParamsContext } from '../../../context/ParamsContext';

// TODO 期間指定のフィルター機能を修正(カレンダーで選択する / パラメータがセットされてる時にクリアボタンを表示する)
// 注意事項 API通信で取得したデータもform部品から値を取得する時は文字列で渡ってくるのでデータ型をキャストしないと想定外の挙動になるので注意する　＊typesScriptの導入要検討

function OrderIndex() {

    // urlの設定
    const baseUrl = `/api/admin/orders`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'ORDER';
    // paginateフックの呼び出し
    const { handlePageChange, handleTableRow} = usePaginate();
    // sortフックの呼び出し
    const {handleSort} = useSort();
    // filterフックの呼び出し
    const [dateRangeStart, dateRangeEnd, dateRangeField, {handleFilterInputText, handleFilterCheckbox, handleFilterDateRange}] = useFilter();
    // checkboxフックの呼び出し
    const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();
    // useContext呼び出し
    const {params, setParams, scope, setScope} = useParamsContext();
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', [],  model);
    // APIから取得したデータを変数に格納
    const orders = data.orders? data.orders.data: null;


    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(scope === null || scope !== model) { // 全てのページにおいての初回読み込みなので初期値を代入
            console.log('ORDERにてparamsの初期値をセットしてscopeを変更');
            setParams({
                ...params,
                sort: { 'total_amount' : '', 'created_at' : '', 'updated_at' : ''},
                filter: { 'payment_method' : [], 'is_paid' : [], 'is_shipped' : [], 'dateRange': {} },
            });
            setScope(model);
        }
        // ユーザー削除に成功した場合にdelete:trueが帰ってくるので条件分岐
        if(data.delete && data.delete === true) {
            // ページネーションの設定を保持して再度読み込み
            dispatch({ type: 'READ', url: useCreateUrl(baseUrl, params) });
            // ステートの配列を初期化
            setChecklist([]);
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
                <h1>受注一覧</h1>
                <button onClick={() => {
                    let answer = confirm(`選択項目${checklist.length}件を解除しますか？`);
                    answer && handleUnCheckAll();
                }}>選択解除</button>
                <button onClick={ () => {
                    let answer = confirm(`選択項目${checklist.length}件を削除しますか？`);
                    answer && dispatch({type:'DELETE', url:`/api/admin/orders/delete`, form:checklist});
                }}>一括削除</button>
                <button onClick={ () => {
                        dispatch({ type:'CREATE', url:`/api/admin/orders/csv`, form:checklist })
                }}>CSV出力</button>

                {   Object.keys(params.filter).length > 0 && scope === model &&

                    <div className={'filter'}>
                        <h3>フィルター機能</h3>
                        <div>
                            <span style={{'marginRight': '20px'}}>支払方法</span>
                            <label><input type='checkbox' name='payment_method' onChange={handleFilterCheckbox} value={0} checked={params.filter.payment_method.includes(0)} />クレジットカード</label>
                            <label><input type='checkbox' name='payment_method' onChange={handleFilterCheckbox} value={1} checked={params.filter.payment_method.includes(1)} />代引き</label>
                        </div>
                        <div>
                            <span style={{'marginRight': '20px'}}>入金状況</span>
                            <label><input type='checkbox' name='is_paid' onChange={handleFilterCheckbox} value={0} checked={params.filter.is_paid.includes(0)} />未入金</label>
                            <label><input type='checkbox' name='is_paid' onChange={handleFilterCheckbox} value={1} checked={params.filter.is_paid.includes(1)} />入金済</label>
                        </div>
                        <div>
                            <span style={{'marginRight': '20px'}}>出荷状況</span>
                            <label><input type='checkbox' name='is_shipped' onChange={handleFilterCheckbox} value={0} checked={params.filter.is_shipped.includes(0)} />未配送</label>
                            <label><input type='checkbox' name='is_shipped' onChange={handleFilterCheckbox} value={1} checked={params.filter.is_shipped.includes(1)} />配送済</label>
                        </div>
                        <div>
                            <span>期間指定</span>
                            <select name='field' ref={dateRangeField} value={Object.keys(params.filter.dateRange)[0]} onChange={handleFilterDateRange}>
                                <option value={'clear'}>フィールド選択</option>
                                <option value={'created_at'}>購入日</option>
                                <option value={'updated_at'}>ステータス更新日</option>
                            </select>
                            <input type='number' name='start' ref={dateRangeStart} onBlur={handleFilterDateRange} defaultValue={Object.values(params.filter.dateRange).length > 0 ? Object.values(params.filter.dateRange)[0][0]: ''} placeholder={'19500101'} />　〜
                            <input type='number' name='end' ref={dateRangeEnd} onBlur={handleFilterDateRange} defaultValue={Object.values(params.filter.dateRange).length > 0 ? Object.values(params.filter.dateRange)[0][1]: ''} placeholder={'1980101'} />
                        </div>
                    </div>
                }

                {   Object.keys(params.sort).length > 0 && scope === model &&

                    <div className={'sort'}>
                        <h3>ソート機能</h3>
                        <label>合計金額
                            <select name='total_amount' value={params.sort.total_amount} onChange={handleSort}>
                                <option value={''}>未選択</option>
                                <option value={'desc'}>降順</option>
                                <option value={'asc'}>昇順</option>
                            </select>
                        </label>
                        <label>購入日
                            <select name='created_at' value={params.sort.created_at} onChange={handleSort}>
                                <option value={''}>未選択</option>
                                <option value={'desc'}>降順</option>
                                <option value={'asc'}>昇順</option>
                            </select>
                        </label>
                        <label>ステータス更新日
                            <select name='updated_at' value={params.sort.updated_at} onChange={handleSort}>
                                <option value={''}>未選択</option>
                                <option value={'desc'}>降順</option>
                                <option value={'asc'}>昇順</option>
                            </select>
                        </label>
                    </div>
                }

                <table border="1" style={{'display': 'block', 'overflowX': 'scroll', 'borderCollapse': 'collapse', 'whiteSpace': 'nowrap'}}>
                    <thead>
                        <tr>
                            <th><button onClick={() => { handleCheckAll(orders) }}>全選択</button></th>
                            <th>ID</th>
                            <th>編集</th>
                            <th>購入日</th>
                            <th>購入金額</th>
                            <th>支払方法</th>
                            <th>入金状況</th>
                            <th>出荷状況</th>
                            <th>購入者(カナ)</th>
                            <th>連絡先</th>
                            <th>メールアドレス</th>
                            <th>配送先 郵便番号</th>
                            <th>配送先 住所</th>
                            <th>ステータス更新日</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        orders && !errorMessage &&
                        orders.map((order) =>
                            <tr key={order.id}>
                                <td><input type='checkbox' onChange={handleCheck} value={order.id} checked={ checklist.includes(order.id) } /></td>
                                <td>{order.id}</td>
                                <td><Link to={`/admin/orders/${order.id}/edit`}>編集</Link></td>
                                <td>{order.created_at}</td>
                                <td>{order.total_amount_text}</td>
                                <td>{order.payment_method_text}</td>
                                <td>{order.is_paid_text}</td>
                                <td>{order.is_shipped_text}</td>
                                {   order.user && <td>{order.user.full_name}({order.user.full_name_kana})</td> }
                                <td>{order.user.tel}</td>
                                <td>{order.user.email}</td>
                                {/* 配送先住所が設定されていた場合はそちらを優先する */}
                                <td>{order.user.delivery_post_code_text ? order.user.delivery_post_code_text : order.user.post_code_text}</td>
                                <td>{order.user.full_delivery_address ? order.user.full_delivery_address : order.user.full_address}</td>
                                <td>{order.updated_at}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
 
                { data.orders &&
                    <>
                        <label>行数<input type='number' onBlur={handleTableRow} defaultValue={data.orders.per_page} style={{'width': '40px'}} /></label>
                        <div>検索結果{data.orders.total}</div>
                        <div>現在のページ{data.orders.current_page}</div>
                        <Pagination
                            activePage={data.orders.current_page}
                            ordersCountPerPage={data.orders.per_page}
                            totalItemsCount={data.orders.total}
                            pageRangeDisplayed={data.orders.page_range_displayed}
                            onChange={handlePageChange}
                        />
                    </>
                }
            </>
        )
    );
}

export default OrderIndex;


