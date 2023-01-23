import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import Pagination from 'react-js-pagination'; // パラメータ https://www.npmjs.com/package/react-js-pagination
import useFetchApiData from "../../../hooks/useFetchApiData";
import useInputCheckBox from "../../../hooks/useInputCheckBox";
import useCreateParams from "../../../hooks/useCreateParams";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import { useParamsContext } from '../../../context/ParamsContext';

function NotificationIndex() {

    // urlの設定
    const baseUrl = `/api/admin/notifications`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'NOTIFICATION';
    // URLパラメータ変更のフックの呼び出し
    const [dateRangeStart, dateRangeEnd, dateRangeField, {handleFilter, handleFilterCheckbox, handleFilterDateRange, handleCurrentPage, handlePerPage, handleSort}] = useCreateParams();
    // checkboxフックの呼び出し
    const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();
    // useContext呼び出し
    const {params, setParams, scope, setScope} = useParamsContext();
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', [],  model);
    // APIから取得したデータを変数に格納
    const notifications = data.data? data.data: null;

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(scope === null || scope !== model) { // 全てのページにおいての初回読み込みなので初期値を代入
            console.log('NOTIFICATIONにてparamsの初期値をセットしてscopeを変更');
            setParams({
                ...params,
                sort: { 'last_name_kana' : '', 'expired_at' : '', 'posted_at' : '', 'modified_at' : ''},
                filter: { 'keyword' : '', 'is_published' : [], 'dateRange': {} },
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
                <h1>お知らせ一覧</h1>
                <button onClick={() => {
                    let answer = confirm(`選択項目${checklist.length}件を解除しますか？`);
                    answer && handleUnCheckAll();
                }}>選択解除</button>
                <button onClick={ () => {
                    let answer = confirm(`選択項目${checklist.length}件を削除しますか？`);
                    answer && dispatch({type:'DELETE', url:`/api/admin/notifications`, form:checklist});
                }}>一括削除</button>
                <button onClick={ () => {
                        dispatch({ type:'CREATE', url:`/api/admin/notifications/csv`, form:checklist })
                }}>CSV出力</button>

                {   Object.keys(params.filter).length > 0 && scope === model &&

                    <div className={'filter'}>
                        <h3>フィルター機能</h3>
                        <div>
                            <span>キーワード検索</span>
                            <input type='text' name='keyword' onBlur={handleFilter} defaultValue={params.filter.keyword} placeholder={'タイトルを検索'}/>
                        </div>
                        <div>
                            <span style={{'marginRight': '20px'}}>公開状況</span>
                            <label><input type='checkbox' name='is_published' onChange={handleFilterCheckbox} value={0} checked={params.filter.is_published.includes(0)} />非公開</label>
                            <label><input type='checkbox' name='is_published' onChange={handleFilterCheckbox} value={1} checked={params.filter.is_published.includes(1)} />公開中</label>
                        </div>
                        <div>
                            <span>期間指定</span>
                            <select name='field' ref={dateRangeField} value={Object.keys(params.filter.dateRange)[0]} onChange={handleFilterDateRange}>
                                <option value={'clear'}>フィールド選択</option>
                                <option value={'expired_at'}>掲載終了日</option>
                                <option value={'posted_at'}>投稿日</option>
                                <option value={'modified_at'}>更新日</option>
                            </select>
                            <input type='number' name='start' ref={dateRangeStart} onBlur={handleFilterDateRange} defaultValue={Object.values(params.filter.dateRange).length > 0 ? Object.values(params.filter.dateRange)[0][0]: ''} placeholder={'19500101'} />　〜　
                            <input type='number' name='end' ref={dateRangeEnd} onBlur={handleFilterDateRange} defaultValue={Object.values(params.filter.dateRange).length > 0 ? Object.values(params.filter.dateRange)[0][1]: ''} placeholder={'1980101'} />
                        </div>
                    </div>
                }

                {   Object.keys(params.sort).length > 0 && scope === model &&

                    <div className={'sort'}>
                        <h3>ソート機能</h3>
                        <label>氏名(カナ)
                            <select name='last_name_kana' value={params.sort.last_name_kana} onChange={handleSort}>
                                <option value={''}>未選択</option>
                                <option value={'desc'}>降順</option>
                                <option value={'asc'}>昇順</option>
                            </select>
                        </label>
                        <label>掲載終了日
                            <select name='expired_at' value={params.sort.expired_at} onChange={handleSort}>
                                <option value={''}>未選択</option>
                                <option value={'desc'}>降順</option>
                                <option value={'asc'}>昇順</option>
                            </select>
                        </label>
                        <label>投稿日
                            <select name='posted_at' value={params.sort.posted_at} onChange={handleSort}>
                                <option value={''}>未選択</option>
                                <option value={'desc'}>降順</option>
                                <option value={'asc'}>昇順</option>
                            </select>
                        </label>
                        <label>更新日
                            <select name='modified_at' value={params.sort.modified_at} onChange={handleSort}>
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
                            <th><button onClick={() => { handleCheckAll(notifications) }}>全選択</button></th>
                            <th>ID</th>
                            <th>編集</th>
                            <th>公開状況</th>
                            <th>タイトル</th>
                            <th>本文</th>
                            <th>最終更新者</th>
                            <th>掲載終了日</th>
                            <th>投稿日</th>
                            <th>更新日</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        // 最初にUserIndex() -> DataFetchApi() -> UserIndex() と呼び出されてる間でも先に描画が走るがdata.notificationsは空なのでエラーになってしまう
                        // なのでdata.notificationsがあれば表示すると条件をつければいい
                        notifications && !errorMessage &&
                        notifications.map((notification) =>
                            <tr key={notification.id}>
                                {/* ページネーションで別のページに遷移した際にチェックが外れてしまわないようにlist.includes()でステートの配列に含まれてる値IDとユーザーのIDが一致する時にチェックがつくようにセット */}
                                <td><input type='checkbox' onChange={handleCheck} value={notification.id} checked={ checklist.includes(notification.id) } /></td>
                                <td>{notification.id}</td>
                                <td><Link to={`/admin/notifications/${notification.id}/edit`}>編集</Link></td>
                                <td>{notification.is_published_text}</td>
                                <td><span style={{ 'display':'block', 'width': '318px', 'overflowX':'hidden' }}>{notification.title}</span></td>
                                <td><span style={{ 'display':'block', 'width': '318px', 'overflowX':'hidden' }}>{notification.body}</span></td>
                                <td>{notification.full_name && notification.full_name_kana && (`${notification.full_name}(${notification.full_name_kana})`)}</td>
                                <td>{notification.expired_at}</td>
                                <td>{notification.posted_at}</td>
                                <td>{notification.modified_at}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
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

export default NotificationIndex;



