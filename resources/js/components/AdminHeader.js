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
            <ul className="nav" style={{'width': '100%','height': '40px','background': '#fff','display': 'flex', 'padding': '10px','boxShadow': '0px 3px 4px #0000001a', 'marginBottom': '16px'}}>
                <Link to="/" style={{'marginRight': 'auto'}}>
                    <li className="ml-2">LARAVEL</li>
                </Link>
                <Link to="/admin/login">
                    <li className="ml-2">ログイン</li>
                </Link>
            </ul>
        </nav>

    );

    const AfterLoginHeader = (
        <>
            <nav>
                <ul className="nav" style={{'width': '100%','height': '40px','background': '#fff','display': 'flex', 'padding': '10px','boxShadow': '0px 3px 4px #0000001a', 'marginBottom': '16px'}}>
                    <Link to="/admin/dashboard" style={{'marginRight': 'auto'}}>
                        <li className="ml-2">LARAVEL</li>
                    </Link>
                    {props.authName && <li>{props.authName}</li>}
                    <li className="ml-2" onClick={handleLogout}>ログアウト</li>
                </ul>
            </nav>
            <nav>
                <ul className="nav">
                    <Link to="/admin/dashboard">
                        <li className="ml-2">ダッシュボード</li>
                    </Link>
                    <Link to="/admin/users">
                        <li className="ml-2">会員一覧</li>
                    </Link>
                    <Link to="/admin/users/create">
                        <li className="ml-2">会員新規登録</li>
                    </Link>
                    <Link to="/admin/admins">
                        <li className="ml-2">管理者一覧</li>
                    </Link>
                    <Link to="/admin/admins/create">
                        <li className="ml-2">管理者新規登録</li>
                    </Link>
                    <Link to="/admin/notifications">
                        <li className="ml-2">お知らせ一覧</li>
                    </Link>
                    <Link to="/admin/notifications/create">
                        <li className="ml-2">お知らせ新規登録</li>
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
