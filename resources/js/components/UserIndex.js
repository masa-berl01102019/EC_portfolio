import React, {useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import Pagination from 'react-js-pagination'; // パラメータ https://www.npmjs.com/package/react-js-pagination
import useFetchApiData from "./hooks/useFetchApiData";
import useInputCheckBox from "./hooks/useInputCheckBox";
import usePaginate from "./hooks/usePaginate";
import useSort from "./hooks/useSort";
import {useCreateUrl} from "./hooks/useCreateUrl";
import {shareParams} from './App';
import ShowErrorMsg from "./ShowErrorMsg";

// TODO 性別とDM送付の出力形式を変更
// TODO 誕生日/郵便番号/電話番号の入出力の仕方を決める
// TODO 絞り込み機能の実装
// TODO CSV出力内容修正　＊性別等がDBと同じで数値で出力されてる
// TODO globalでもつべき値について影響範囲を考える
// 注意事項　API通信で取得したデータもform部品から値を取得する時は文字列で渡ってくるのでデータ型をキャストしないと想定外の挙動になるので注意する　＊typesScriptの導入要検討

function UserIndex() {

    // urlの設定
    const baseUrl = `/api/admin/users`;
    // paginateフックの呼び出しと初期値をセット
    const [paginate, {setPaginate, handlePageChange, handleTableRow}] = usePaginate({
        data: null, // 取得したデータ
        current_page: 1, // 現在のページ
        per_page: 10, // 1ページ当たりの取得件数
        total: 0, // 総件数
        page_range_displayed: 5// ページネーションの表示個数
    });
    // sortフックの呼び出しと初期値をセット
    const [sort, {handleSort}] = useSort({ 'last_name_kana' : '', 'birthday' : '', 'created_at' : '', 'updated_at' : ''});
    // checkboxフックの呼び出し
    const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();
    // useContext呼び出し
    const {params} = useContext(shareParams);
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);
    // APIから取得したデータを変数に格納
    const users = data.users? data.users.data: null;

    useEffect(() => {
        // ユーザー削除に成功した場合にdelete:trueが帰ってくるので条件分岐
        if(data.delete && data.delete === true) {
            // ページネーションの設定を保持して再度読み込み
            dispatch({ type: 'READ', url: useCreateUrl(baseUrl, params) });
            // ステートの配列を初期化
            setChecklist([]);
        }
        // 非同期での通信の為dataにusersが含まれてるかチェック
        if(data.users) {
            setPaginate({
                data: data.users.data,
                current_page: data.users.current_page,
                per_page: data.users.per_page,
                total: data.users.total,
                page_range_displayed: 5
            });
        }
    },[data]);

    // 描画のみを担当
    return (
        <div style={{'overflowX': 'hidden', 'width': '90%', 'margin': '0 auto'}}>
            <h1>User一覧</h1>
            {   isLoading ? (
                    <CircularProgress disableShrink />
                ):
                errorMessage ? (
                    <ShowErrorMsg errorMessage={errorMessage} />
                ): (
                    <>
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
                        <div style={{'marginTop': '10px'}}>
                            <label>名前
                                <select name='last_name_kana' value={params.sort && params.sort.last_name_kana} onChange={handleSort}>
                                    <option value={''}>未選択</option>
                                    <option value={'desc'}>降順</option>
                                    <option value={'asc'}>昇順</option>
                                </select>
                            </label>
                            <label>生年月日
                                <select name='birthday' value={params.sort && params.sort.birthday} onChange={handleSort}>
                                    <option value={''}>未選択</option>
                                    <option value={'desc'}>降順</option>
                                    <option value={'asc'}>昇順</option>
                                </select>
                            </label>
                            <label>作成日
                                <select name='created_at' value={params.sort && params.sort.created_at} onChange={handleSort}>
                                    <option value={''}>未選択</option>
                                    <option value={'desc'}>降順</option>
                                    <option value={'asc'}>昇順</option>
                                </select>
                            </label>
                            <label>更新日
                                <select name='updated_at' value={params.sort && params.sort.updated_at} onChange={handleSort}>
                                    <option value={''}>未選択</option>
                                    <option value={'desc'}>降順</option>
                                    <option value={'asc'}>昇順</option>
                                </select>
                            </label>
                        </div>
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
                                <th>配送先郵便番号</th>
                                <th>配送先住所</th>
                                <th>電話番号</th>
                                <th>メールアドレス</th>
                                <th>DM送付有無</th>
                                <th>作成日</th>
                                <th>更新日</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                // 最初にUserIndex() -> DataFetchApi() -> UserIndex() と呼び出されてる間でも先に描画が走るがdata.usersは空なのでエラーになってしまう
                                // なのでdata.usersがあれば表示すると条件をつければいい
                                users &&
                                users.map((user) =>
                                    <tr key={user.id}>
                                        {/* ページネーションで別のページに遷移した際にチェックが外れてしまわないようにlist.includes()でステートの配列に含まれてる値IDとユーザーのIDが一致する時にチェックがつくようにセット */}
                                        <td><input type='checkbox' onChange={handleCheck} value={user.id} checked={ checklist.includes(user.id) } /></td>
                                        <td>{user.id}</td>
                                        <td><Link to={`/admin/users/${user.id}/edit`}>編集</Link></td>
                                        <td>{user.last_name}{user.first_name}</td>
                                        <td>{user.last_name_kana}{user.first_name_kana}</td>
                                        <td>{user.gender}</td>
                                        <td>{user.birthday}</td>
                                        <td>〒{user.post_code}</td>
                                        <td>{user.prefecture}{user.municipality}{user.street_name}{user.street_number}{user.building}</td>
                                        <td>〒{user.delivery_post_code}</td>
                                        <td>{user.delivery_prefecture}{user.delivery_municipality}{user.delivery_street_name}{user.delivery_street_number}{user.delivery_building}</td>
                                        <td>{user.tel}</td>
                                        <td>{user.email}</td>
                                        <td>{user.is_received}</td>
                                        <td>{user.created_at}</td>
                                        <td>{user.updated_at}</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                        <label>行数<input type='number' onBlur={handleTableRow} defaultValue={paginate.per_page} style={{'width': '40px'}} /></label>
                        <p>現在のページ{paginate.current_page}</p>
                        <Pagination
                            activePage={paginate.current_page}
                            itemsCountPerPage={paginate.per_page}
                            totalItemsCount={paginate.total}
                            pageRangeDisplayed={paginate.page_range_displayed}
                            onChange={handlePageChange}
                        />
                    </>
                )
            }
        </div>
    );
}

export default UserIndex;



