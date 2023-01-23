import React from 'react';
import {Link} from 'react-router-dom';
import useAuth from "./hooks/useAuth";
import {useAuthContext} from "./context/AuthContext";

function UserHeader(props) {
    // Auth名の設定
    const auth = 'user'
    // Auth hooksの呼び出し
    const {handleLogout} = useAuth(auth);
    // login状態のステータスを取得
    const {isUserLogin} = useAuthContext();

    const BeforeLoginHeader = (

        <>
            <nav>
                <ul style={{'background': '#fff','display': 'flex', 'padding': '20px','boxShadow': '0px 3px 4px #0000001a', 'marginBottom': '16px'}}>
                    <Link to="/" style={{'marginRight': 'auto'}}>
                        <li>LARAVEL</li>
                    </Link>
                    <Link to="/user/login">
                        <li>ログイン</li>
                    </Link>
                </ul>
            </nav>
            <nav>
                <ul style={{'display': 'flex', 'justifyContent': 'space-evenly'}}>
                    <Link to="/items">
                        <li>商品一覧</li>
                    </Link>
                    <Link to="/blogs">
                        <li>ブログ一覧</li>
                    </Link>
                    <Link to="/news">
                        <li>ニュース一覧</li>
                    </Link>
                    <Link to="/notifications">
                        <li>お知らせ一覧</li>
                    </Link>
                    <Link to="/carts">
                        <li>カート一覧</li>
                    </Link>
                    <Link to="/bookmarks">
                        <li>お気に入り一覧</li>
                    </Link>
                    <Link to="/histories">
                        <li>閲覧履歴</li>
                    </Link>
                    <Link to="/users/create">
                        <li>会員登録</li>
                    </Link>
                    <Link to="/contacts">
                        <li>お問い合わせ</li>
                    </Link>
                </ul>
            </nav>
        </>

    );

    const AfterLoginHeader = (
        <>
            <nav>
                <ul style={{'background': '#fff','display': 'flex', 'padding': '20px','boxShadow': '0px 3px 4px #0000001a', 'marginBottom': '16px'}}>
                    <Link to="/" style={{'marginRight': 'auto'}}>
                        <li>LARAVEL</li>
                    </Link>
                    {props.authName && <li>{props.authName}</li>}
                    <li onClick={handleLogout} style={{'marginLeft': '8px'}}>ログアウト</li>
                </ul>
            </nav>
            <nav>
                <ul style={{'display': 'flex', 'justifyContent': 'space-evenly'}}>
                    <Link to="/items">
                        <li>商品一覧</li>
                    </Link>
                    <Link to="/blogs">
                        <li>ブログ一覧</li>
                    </Link>
                    <Link to="/news">
                        <li>ニュース一覧</li>
                    </Link>
                    <Link to="/notifications">
                        <li>お知らせ一覧</li>
                    </Link>
                    <Link to="/carts">
                        <li>カート一覧</li>
                    </Link>
                    <Link to="/bookmarks">
                        <li>お気に入り一覧</li>
                    </Link>
                    <Link to="/histories">
                        <li>閲覧履歴</li>
                    </Link>
                    <Link to="/orders">
                        <li>購入履歴</li>
                    </Link>
                    <Link to="/users/edit">
                        <li>会員編集</li>
                    </Link>
                    <Link to="/contacts">
                        <li>お問い合わせ</li>
                    </Link>
                </ul>
            </nav>
        </>
    );

    if(!isUserLogin) {
        return BeforeLoginHeader
    } else {
        return AfterLoginHeader
    }
}

export default UserHeader;
