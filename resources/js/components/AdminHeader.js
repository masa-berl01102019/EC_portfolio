import React from 'react';
import {Link} from 'react-router-dom';
import useAuth from "./hooks/useAuth";
import {useAuthContext} from "./context/AuthContext";

function AdminHeader(props) {
    // Auth名の設定
    const auth = 'admin'
    // Auth hooksの呼び出し
    const {handleLogout} = useAuth(auth);
    // login状態のステータスを取得
    const {isAdminLogin} = useAuthContext();

    const BeforeLoginHeader = (
        <nav>
            <ul className="nav" style={{'background': '#fff','display': 'flex', 'padding': '20px','boxShadow': '0px 3px 4px #0000001a', 'marginBottom': '16px'}}>
                <Link to="/" style={{'marginRight': 'auto'}}>
                    <li>LARAVEL</li>
                </Link>
                <Link to="/admin/login">
                    <li>ログイン</li>
                </Link>
            </ul>
        </nav>

    );

    const AfterLoginHeader = (
        <>
            <nav>
                <ul className="nav" style={{'background': '#fff','display': 'flex', 'padding': '20px','boxShadow': '0px 3px 4px #0000001a', 'marginBottom': '16px'}}>
                    <Link to="/admin/dashboard" style={{'marginRight': 'auto'}}>
                        <li>LARAVEL</li>
                    </Link>
                    {props.authName && <li>{props.authName}</li>}
                    <li onClick={handleLogout} style={{'marginLeft': '8px'}}>ログアウト</li>
                </ul>
            </nav>
            <nav>
                <ul style={{'display': 'flex', 'justifyContent': 'space-evenly'}}>
                    <Link to="/admin/dashboard">
                        <li>ダッシュボード</li>
                    </Link>
                    <Link to="/admin/users">
                        <li>会員一覧</li>
                    </Link>
                    <Link to="/admin/users/create">
                        <li>会員新規登録</li>
                    </Link>
                    <Link to="/admin/admins">
                        <li>管理者一覧</li>
                    </Link>
                    <Link to="/admin/admins/create">
                        <li>管理者新規登録</li>
                    </Link>
                    <Link to="/admin/notifications">
                        <li>お知らせ一覧</li>
                    </Link>
                    <Link to="/admin/notifications/create">
                        <li>お知らせ新規登録</li>
                    </Link>
                    <Link to="/admin/items">
                        <li>商品一覧</li>
                    </Link>
                    <Link to="/admin/items/create">
                        <li>商品新規登録</li>
                    </Link>
                    <Link to="/admin/blogs">
                        <li>ブログ一覧</li>
                    </Link>
                    <Link to="/admin/blogs/create">
                        <li>ブログ新規登録</li>
                    </Link>
                    <Link to="/admin/contacts">
                        <li>お問い合わせ一覧</li>
                    </Link>
                </ul>
            </nav>
        </>
    );

    if(!isAdminLogin) {
        return BeforeLoginHeader
    } else {
        return AfterLoginHeader
    }
}

export default AdminHeader;
