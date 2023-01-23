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
import ShowErrorMsg from "../../../ShowErrorMsg";
import { useParamsContext } from '../../../context/ParamsContext';

// TODO 削除後に再取得のAPIを叩く仕様をやめるか要検討
// 注意事項　API通信で取得したデータもform部品から値を取得する時は文字列で渡ってくるのでデータ型をキャストしないと想定外の挙動になるので注意する　＊typesScriptの導入要検討

function AdminIndex() {

    // urlの設定
    const baseUrl = `/api/admin/admins`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'ADMIN';
    // paginateフックの呼び出し
    const {handlePageChange, handleTableRow} = usePaginate();
    // sortフックの呼び出し
    const {handleSort} = useSort();
    // filterフックの呼び出し
    const [dateRangeStart, dateRangeEnd, dateRangeField, {handleFilterInputText, handleFilterDateRange}] = useFilter();
    // checkboxフックの呼び出し
    const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();
    // useContext呼び出し
    const {params, setParams, scope, setScope} = useParamsContext();
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', [], model);
    // APIから取得したデータを変数に格納
    const admins = data.admins? data.admins.data: null;

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(scope === null || scope !== model) { // 全てのページにおいての初回読み込みなので初期値を代入
            console.log('ADMINにてparamsの初期値をセットしてscopeを変更');
            setParams({
                ...params,
                sort: { 'last_name_kana' : '', 'created_at' : '', 'updated_at' : '' },
                filter: { 'keyword' : '', 'dateRange': {} },
                // paginate: {
                //     data: null, // 取得したデータ
                //     current_page: 1, // 現在のページ
                //     per_page: 10, // 1ページ当たりの取得件数
                //     total: 0, // 総件数
                //     page_range_displayed: 5// ページネーションの表示個数
                // }
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
        <div style={{'overflowX': 'hidden', 'width': '90%', 'margin': '0 auto'}}>
            <h1>管理者一覧</h1>
            { errorMessage && <ShowErrorMsg errorMessage={errorMessage}/> }
            {   isLoading ? (
                <CircularProgress disableShrink />
            ): (
                <>
                    <button onClick={() => {
                        let answer = confirm(`選択項目${checklist.length}件を解除しますか？`);
                        answer && handleUnCheckAll();
                    }}>選択解除</button>
                    <button onClick={ () => {
                        let answer = confirm(`選択項目${checklist.length}件を削除しますか？`);
                        answer && dispatch({type:'DELETE', url:`/api/admin/admins/delete`, form:checklist});
                    }}>一括削除</button>
                    <button onClick={ () => {
                        dispatch({ type:'CREATE', url:`/api/admin/admins/csv`, form:checklist })
                    }}>CSV出力</button>

                    {   Object.keys(params.filter).length > 0 && scope === model &&

                        <div style={{'marginTop': '10px'}}>
                            <p style={{'marginBottom': '8px', 'fontWeight': 'bold'}}>フィルター機能</p>
                            <div style={{'marginBottom': '8px'}}>
                                <span style={{'marginRight': '20px'}}>キーワード検索</span>
                                <input type='text' name='keyword' onBlur={handleFilterInputText} defaultValue={params.filter.keyword} />
                            </div>
                            <div>
                                <span style={{'marginRight': '20px'}}>期間指定</span>
                                <select name='field' ref={dateRangeField} value={Object.keys(params.filter.dateRange)[0]} onChange={handleFilterDateRange}>
                                    <option value={'clear'}>フィールド選択</option>
                                    <option value={'created_at'}>作成日時</option>
                                    <option value={'updated_at'}>更新日時</option>
                                </select>
                                <input type='number' name='start' ref={dateRangeStart} onBlur={handleFilterDateRange} defaultValue={Object.values(params.filter.dateRange).length > 0 ? Object.values(params.filter.dateRange)[0][0]: ''} placeholder={'19500101'} />　〜
                                <input type='number' name='end' ref={dateRangeEnd} onBlur={handleFilterDateRange} defaultValue={Object.values(params.filter.dateRange).length > 0 ? Object.values(params.filter.dateRange)[0][1]: ''} placeholder={'1980101'} />
                            </div>
                        </div>
                    }

                    {  Object.keys(params.sort).length > 0 && scope === model &&

                        <div style={{'marginTop': '10px'}}>
                            <p style={{'marginBottom': '5px', 'fontWeight': 'bold'}}>ソート機能</p>
                            <label>氏名(カナ)
                                <select name='last_name_kana' value={params.sort.last_name_kana} onChange={handleSort}>
                                    <option value={''}>未選択</option>
                                    <option value={'desc'}>降順</option>
                                    <option value={'asc'}>昇順</option>
                                </select>
                            </label>
                            <label>作成日時
                                <select name='created_at' value={params.sort.created_at} onChange={handleSort}>
                                    <option value={''}>未選択</option>
                                    <option value={'desc'}>降順</option>
                                    <option value={'asc'}>昇順</option>
                                </select>
                            </label>
                            <label>更新日時
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
                            <th><button onClick={() => { handleCheckAll(admins) }}>全選択</button></th>
                            <th>ID</th>
                            <th>編集</th>
                            <th>氏名</th>
                            <th>氏名(カナ)</th>
                            <th>電話番号</th>
                            <th>メールアドレス</th>
                            <th>作成日時</th>
                            <th>更新日時</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            // 最初にAdminIndex() -> DataFetchApi() -> AdminIndex() と呼び出されてる間でも先に描画が走るがdata.adminsは空なのでエラーになってしまう
                            // なのでdata.adminsがあれば表示すると条件をつければいい
                            admins && !errorMessage &&
                            admins.map((admin) =>
                                <tr key={admin.id}>
                                    {/* ページネーションで別のページに遷移した際にチェックが外れてしまわないようにlist.includes()でステートの配列に含まれてる値IDとユーザーのIDが一致する時にチェックがつくようにセット */}
                                    <td><input type='checkbox' onChange={handleCheck} value={admin.id} checked={ checklist.includes(admin.id) } /></td>
                                    <td>{admin.id}</td>
                                    <td><Link to={`/admin/admins/${admin.id}/edit`}>編集</Link></td>
                                    <td>{admin.last_name} {admin.first_name}</td>
                                    <td>{admin.last_name_kana} {admin.first_name_kana}</td>
                                    <td>{admin.tel}</td>
                                    <td>{admin.email}</td>
                                    <td>{admin.created_at}</td>
                                    <td>{admin.updated_at}</td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                    { data.admins &&
                    <>
                        <label>行数<input type='number' onBlur={handleTableRow} defaultValue={data.admins.per_page} style={{'width': '40px'}} /></label>
                        <div>検索結果{data.admins.total}</div>
                        <div>現在のページ{data.admins.current_page}</div>
                        <Pagination
                            activePage={data.admins.current_page}
                            itemsCountPerPage={data.admins.per_page}
                            totalItemsCount={data.admins.total}
                            pageRangeDisplayed={data.admins.page_range_displayed}
                            onChange={handlePageChange}
                        />
                    </>
                    }
                </>
            )
            }
        </div>
    );
}

export default AdminIndex;



