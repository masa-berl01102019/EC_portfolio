import React from 'react';
import {Link} from "react-router-dom";
import DataFetchApi from "./DataFetchApi";
import {CircularProgress} from "@material-ui/core";

function UserShow(props) {

    // APIと接続して返り値を取得 * propsで渡ってきたIDを初期URLにセット
    const [{isLoading, errorMessage, data}] = DataFetchApi(`/api/admin/users/${props.match.params.id}`, 'get', []);
    // dataは{ key(APIサーバーからレスポンスを返す時に設定したkey名) : 値　}の形で返却されるので変数に代入しておく
    const user = data.user;

    // 描画のみを担当
    return (
        <div style={{'width': '50%', 'margin': '0 auto'}}>
            <h1>User詳細ページ</h1>
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
                user &&
                    <>
                        <ul>
                            <li>{user.last_name}{user.first_name}</li>
                            <li>{user.last_name_kana}{user.first_name_kana}</li>
                            <li>{user.gender}</li>
                            <li>{user.birthday}</li>
                            <li>〒{user.post_code}</li>
                            <li>{user.prefecture}{user.municipality}{user.street_name}{user.street_number}{user.building}</li>
                            <li>〒{user.delivery_post_code}</li>
                            <li>{user.delivery_prefecture}{user.delivery_municipality}{user.delivery_street_name}{user.delivery_street_number}{user.delivery_building}</li>
                            <li>{user.tel}</li>
                            <li>{user.email}</li>
                            <li>{user.is_received}</li>
                            <li>{user.created_at}</li>
                            <li>{user.updated_at}</li>
                        </ul>
                        <button><Link to={`/admin/users`}>一覧に戻る</Link></button>
                        <button><Link to={`/admin/users/${user.id}/edit`}>編集画面に進む</Link></button>
                    </>
            )}
        </div>
    );
}

export default UserShow;
