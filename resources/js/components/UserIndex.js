import React,{useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import Pagination from 'react-js-pagination'; // パラメータ https://www.npmjs.com/package/react-js-pagination
import DataFetchApi from "./DataFetchApi";

// TODO 性別とDM送付の出力形式を変更
// TODO 誕生日/郵便番号/電話番号の入出力の仕方を決める
// TODO 削除ボタンの制御 * 確認のポップアップ表示
// TODO CSV出力の実装
// TODO 絞り込み機能の実装
// TODO 選択項目の一括削除
// TODO 表示順序の変更

function UserIndex() {

    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = DataFetchApi('/api/admin/users', 'get', []);

    const users = data.users? data.users.data: null;

    // paginationのステータス管理
    const [paginate, setPaginate] = useState({
        data: null, // 取得したデータ
        current_page: 1, // 現在のページ
        per_page: 10, // 1ページ当たりの取得件数
        total: 0, // 総件数
        page_range_displayed: 5// ページネーションの表示個数
    });

    useEffect(() => {
        console.log(checkbox);
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

    const handlePageChange = (pageNumber) => {
        // 各ページネーションをクリックすると数字が渡ってくるのでパラメータをつけてリクエストを飛ばす
        dispatch({type: 'READ', url: `/api/admin/users?page=${pageNumber}` });
    };

    const inputHandler = (e) => {
        //　行数の指定をした場合にパラメータを渡して１ページ当たりの取得件数を変更
        dispatch({type: 'READ', url: `/api/admin/users?perPage=${e.target.value}`});
    };

    // 描画のみを担当
    return (
        <div style={{'overflowX': 'scroll', 'width': '90%', 'margin': '0 auto'}}>
            <h1>User一覧</h1>
            { errorMessage &&
                <ul style={{'color': 'red', 'listStyle': 'none'}}>
                    {
                        errorMessage.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))
                    }
                </ul>
            }
            { isLoading ? (
                <CircularProgress disableShrink />
            ):(
                <>
                    <table border="1" style={{'borderCollapse': 'collapse', 'whiteSpace': 'nowrap'}}>
                        <thead>
                            <tr>
                                <th>削除</th>
                                <th>ID</th>
                                <th>詳細</th>
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
                                        <td><button onClick={() => dispatch({type: 'DELETE', url: `/api/admin/users/${user.id}`})}>削除</button></td>
                                        <td>{user.id}</td>
                                        <td><Link to={`/admin/users/${user.id}`}>詳細</Link></td>
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
                        <label>行数<input type='number' onBlur={inputHandler} defaultValue={paginate.per_page} style={{'width': '40px'}} /></label>
                        <Pagination
                            activePage={paginate.current_page}
                            itemsCountPerPage={paginate.per_page}
                            totalItemsCount={paginate.total}
                            pageRangeDisplayed={paginate.page_range_displayed}
                            onChange={handlePageChange}
                        />
                </>
            )}
        </div>
    );
}

export default UserIndex;



