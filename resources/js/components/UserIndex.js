import React,{useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import Pagination from 'react-js-pagination'; // パラメータ https://www.npmjs.com/package/react-js-pagination
import DataFetchApi from "./DataFetchApi";

// TODO 性別とDM送付の出力形式を変更
// TODO 誕生日/郵便番号/電話番号の入出力の仕方を決める
// TODO 絞り込み機能の実装
// TODO 表示順序の変更

// 注意事項　API通信で取得したデータもform部品から値を取得する時は文字列で渡ってくるのでデータ型をキャストしないと想定外の挙動になるので注意する　＊typesScriptの導入要検討

function UserIndex() {

    // paginationのステータス管理
    const [paginate, setPaginate] = useState({
        data: null, // 取得したデータ
        current_page: 1, // 現在のページ
        per_page: 10, // 1ページ当たりの取得件数
        total: 0, // 総件数
        page_range_displayed: 5// ページネーションの表示個数
    });

    // 一括操作用にIDを配列で管理
    const [list, setList] = useState([]);

    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = DataFetchApi(`/api/admin/users?perPage=${paginate.per_page}`, 'get', []);
    // APIから取得したデータを変数に格納
    const users = data.users? data.users.data: null;

    useEffect(() => {
        // ユーザー削除に成功した場合にdelete:trueが帰ってくるので条件分岐
        if(data.delete && data.delete === true) {
            // ページネーションの設定を保持して再度読み込み
            dispatch({ type: 'READ', url: `/api/admin/users?page=${paginate.current_page}&perPage=${paginate.per_page}` });
            // ステートの配列を初期化
            setList([]);
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

    // 各ページネーションをクリックすると数字が渡ってくるのでパラメータをつけてリクエストを飛ばす
    const handlePageChange = (pageNumber) => dispatch({type: 'READ', url: `/api/admin/users?page=${pageNumber}&perPage=${paginate.per_page}` });

    //　行数の指定をした場合にパラメータを渡して１ページ当たりの取得件数を変更してリクエストを飛ばす
    const handleTableRow = (e) => dispatch({type: 'READ', url: `/api/admin/users?page=${paginate.current_page}&perPage=${e.target.value}`});

    const handleCheckbox = (e) => {
        // APIから渡ってくるデータは数値型だが、e.target.valueで値を取得する際はstringに型変換されて渡ってくるので数値型にキャストする
        const value = Number(e.target.value);
        // include()でcheckedされたIDがステートに含まれてるか判断 * include()の戻り値は常にtrue or false
        if(list.includes(value)) {
            // 既に含まれてる場合はcheckedを外したいのでfilter関数で該当IDは含まれない配列を生成してstateを更新
            setList(list.filter(item => item !== value ));
        } else {
            // 含まれてない場合は分割代入後に配列に追加
            setList([...list, value] );
        }
    };

    const handleCheckAll = () => {
        // 配列の初期化
        const arr = [];
        // APIから取得したデータはusersに格納されてるのでfor文で展開
        for(let i = 0; i < users.length; i++ ) {
            // 取得した各ユーザーのIDがステートに含まれていないかチェックしてtrueの時にarrに代入していく
            if(!list.includes(users[i].id)) {
                arr.push(users[i].id);
            }
        }
        // arrに含まれてるIDを分割代入で展開してステートを更新することで再描画が走るのでcheckboxがチェックされた状態で再描画される
        setList([...list, ...arr] );
    }

    // ステートの配列を初期化
    const handleUnCheckAll = () => setList([]);

    // 描画のみを担当
    return (
        <div style={{'overflowX': 'hidden', 'width': '90%', 'margin': '0 auto'}}>
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
                    <button onClick={() => {
                        let answer = confirm(`選択項目${list.length}件を解除しますか？`);
                        answer && handleUnCheckAll();
                    }}>選択解除</button>
                    <button onClick={ () => {
                        let answer = confirm(`選択項目${list.length}件を削除しますか？`);
                        answer && dispatch({type:'DELETE', url:`/api/admin/users/delete`, data:list });
                    }}>一括削除</button>
                    <button onClick={ () => {
                            dispatch({ type:'CREATE', url:`/api/admin/users/csv`, form:list })
                    }}>CSV出力</button>
                    <table border="1" style={{'display': 'block', 'overflowX': 'scroll', 'borderCollapse': 'collapse', 'whiteSpace': 'nowrap'}}>
                        <thead>
                        <tr>
                            <th><button onClick={handleCheckAll}>全選択</button></th>
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
                                    <td><input type='checkbox' onChange={handleCheckbox} value={user.id} checked={ list.includes(user.id) } /></td>
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
            )}
        </div>
    );
}

export default UserIndex;



