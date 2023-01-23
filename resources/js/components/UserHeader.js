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

    );

    const AfterLoginHeader = (
        <>
            <nav>
                <ul style={{'background': '#fff','display': 'flex', 'padding': '20px','boxShadow': '0px 3px 4px #0000001a', 'marginBottom': '16px'}}>
                    <Link to="/user/users" style={{'marginRight': 'auto'}}>
                        <li>LARAVEL</li>
                    </Link>
                    {props.authName && <li>{props.authName}</li>}
                    <li onClick={handleLogout} style={{'marginLeft': '8px'}}>ログアウト</li>
                </ul>
            </nav>
            <nav>
                <ul style={{'display': 'flex', 'justifyContent': 'space-evenly'}}>
                    <Link to="/user/users">
                        <li>TEST会員一覧</li>
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
