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
// 注意事項　API通信で取得したデータもform部品から値を取得する時は文字列で渡ってくるのでデータ型をキャストしないと想定外の挙動になるので注意する　＊typesScriptの導入要検討

function UserIndex() {

    // urlの設定
    const baseUrl = `/api/admin/users`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'USER';
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
    const users = data.users? data.users.data: null;

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(scope === null || scope !== model) { // 全てのページにおいての初回読み込みなので初期値を代入
            console.log('USERにてparamsの初期値をセットしてscopeを変更');
            setParams({
                ...params,
                sort: { 'last_name_kana' : '', 'birthday' : '', 'created_at' : '', 'updated_at' : ''},
                filter: { 'keyword' : '', 'gender' : [], 'is_received' : [], 'dateRange': {} },
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
                <h1>会員一覧</h1>
                <button onClick={() => {
                    let answer = confirm(`選択項目${checklist.length}件を解除しますか？`);
                    answer && handleUnCheckAll();
                }}>選択解除</button>
                <button onClick={ () => {
                    let answer = confirm(`選択項目${checklist.length}件を削除しますか？`);
                    answer && dispatch({type:'DELETE', url:`/api/admin/users/delete`, form:checklist});
                }}>一括削除</button>
                <button onClick={ () => {
                        dispatch({ type:'CREATE', url:`/api/admin/users/csv`, form:checklist })
                }}>CSV出力</button>

                {   Object.keys(params.filter).length > 0 &&　scope === model &&

                    <div className={'filter'}>
                        <h3>フィルター機能</h3>
                        <div>
                            <span>キーワード検索</span>
                            <input type='text' name='keyword' onBlur={handleFilterInputText} defaultValue={params.filter.keyword} placeholder={'名前を検索'} />
                        </div>
                        <div>
                            <span>性別</span>
                            <label><input type='checkbox' name='gender' onChange={handleFilterCheckbox} value={0} checked={params.filter.gender.includes(0)} />男性</label>
                            <label><input type='checkbox' name='gender' onChange={handleFilterCheckbox} value={1} checked={params.filter.gender.includes(1)} />女性</label>
                            <label><input type='checkbox' name='gender' onChange={handleFilterCheckbox} value={2} checked={params.filter.gender.includes(2)} />その他</label>
                            <label><input type='checkbox' name='gender' onChange={handleFilterCheckbox} value={3} checked={params.filter.gender.includes(3)} />未回答</label>
                        </div>
                        <div>
                            <span>DM登録状況</span>
                            <label><input type='checkbox' name='is_received' onChange={handleFilterCheckbox} value={0} checked={params.filter.is_received.includes(0)} />未登録</label>
                            <label><input type='checkbox' name='is_received' onChange={handleFilterCheckbox} value={1} checked={params.filter.is_received.includes(1)} />登録済</label>
                        </div>
                        <div>
                            <span>期間指定</span>
                            <select name='field' ref={dateRangeField} value={Object.keys(params.filter.dateRange)[0]} onChange={handleFilterDateRange}>
                                <option value={'clear'}>フィールド選択</option>
                                <option value={'birthday'}>生年月日</option>
                                <option value={'created_at'}>作成日時</option>
                                <option value={'updated_at'}>更新日時</option>
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
                        <label>生年月日
                            <select name='birthday' value={params.sort.birthday} onChange={handleSort}>
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
                        <th><button onClick={() => { handleCheckAll(users) }}>全選択</button></th>
                        <th>ID</th>
                        <th>編集</th>
                        <th>氏名</th>
                        <th>氏名(カナ)</th>
                        <th>性別</th>
                        <th>生年月日</th>
                        <th>郵便番号</th>
                        <th>住所</th>
                        <th>配送先-郵便番号</th>
                        <th>配送先-住所</th>
                        <th>電話番号</th>
                        <th>メールアドレス</th>
                        <th>DM登録</th>
                        <th>作成日時</th>
                        <th>更新日時</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        // 最初にUserIndex() -> DataFetchApi() -> UserIndex() と呼び出されてる間でも先に描画が走るがdata.usersは空なのでエラーになってしまう
                        // なのでdata.usersがあれば表示すると条件をつければいい
                        users && !errorMessage &&
                        users.map((user) =>
                            <tr key={user.id}>
                                {/* ページネーションで別のページに遷移した際にチェックが外れてしまわないようにlist.includes()でステートの配列に含まれてる値IDとユーザーのIDが一致する時にチェックがつくようにセット */}
                                <td><input type='checkbox' onChange={handleCheck} value={user.id} checked={ checklist.includes(user.id) } /></td>
                                <td>{user.id}</td>
                                <td><Link to={`/admin/users/${user.id}/edit`}>編集</Link></td>
                                <td>{user.full_name}</td>
                                <td>{user.full_name_kana}</td>
                                <td>{user.gender_text}</td>
                                <td>{user.birthday}</td>
                                <td>{user.post_code_text}</td>
                                <td>{user.full_address}</td>
                                <td>{user.delivery_post_code_text}</td>
                                <td>{user.full_delivery_address}</td>
                                <td>{user.tel}</td>
                                <td>{user.email}</td>
                                <td>{user.is_received_text}</td>
                                <td>{user.created_at}</td>
                                <td>{user.updated_at}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
                { data.users &&
                    <>
                        <label>行数<input type='number' onBlur={handleTableRow} defaultValue={data.users.per_page} style={{'width': '40px'}} /></label>
                        <div>検索結果{data.users.total}</div>
                        <div>現在のページ{data.users.current_page}</div>
                        <Pagination
                            activePage={data.users.current_page}
                            itemsCountPerPage={data.users.per_page}
                            totalItemsCount={data.users.total}
                            pageRangeDisplayed={data.users.page_range_displayed}
                            onChange={handlePageChange}
                        />
                    </>
                }
            </>
        )
    );
}

export default UserIndex;



