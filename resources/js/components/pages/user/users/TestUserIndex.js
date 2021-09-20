import React from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";

// マルチ認証テスト用　コンポーネント
function TestUserIndex() {

    // urlの設定
    const baseUrl = `/api/user/users`;
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);
    // APIから取得したデータを変数に格納
    const users = data !== undefined ? data.users : null;

    // 描画のみを担当
    return (
        <div style={{'overflowX': 'hidden', 'width': '90%', 'margin': '0 auto'}}>
            <h1>TEST会員一覧</h1>
            { errorMessage && errorMessage.httpRequestError && <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p> }
            {   isLoading ? (
                    <CircularProgress disableShrink />
                ): (
                    <>
                        <table border="1" style={{'display': 'block', 'overflowX': 'scroll', 'borderCollapse': 'collapse', 'whiteSpace': 'nowrap'}}>
                            <thead>
                            <tr>
                                <th>ID</th>
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
                                users && !errorMessage &&
                                users.map((user) =>
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.last_name} {user.first_name}</td>
                                        <td>{user.last_name_kana} {user.first_name_kana}</td>
                                        <td>{user.ac_gender}</td>
                                        <td>{user.birthday}</td>
                                        <td>{user.ac_post_code}</td>
                                        <td>{user.prefecture}{user.municipality}{user.street_name}{user.street_number} {user.building}</td>
                                        <td>{user.ac_delivery_post_code}</td>
                                        <td>{user.delivery_prefecture}{user.delivery_municipality}{user.delivery_street_name}{user.delivery_street_number} {user.delivery_building}</td>
                                        <td>{user.tel}</td>
                                        <td>{user.email}</td>
                                        <td>{user.ac_is_received}</td>
                                        <td>{user.created_at}</td>
                                        <td>{user.updated_at}</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </>
                )
            }
        </div>
    );
}

export default TestUserIndex;



