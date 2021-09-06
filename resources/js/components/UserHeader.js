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
            <ul className="nav" style={{'width': '100%','height': '40px','background': '#fff','display': 'flex', 'padding': '10px','boxShadow': '0px 3px 4px #0000001a', 'marginBottom': '16px'}}>
                <Link to="/" style={{'marginRight': 'auto'}}>
                    <li className="ml-2">LARAVEL</li>
                </Link>
                <Link to="/user/login">
                    <li className="ml-2">ログイン</li>
                </Link>
            </ul>
        </nav>

    );

    const AfterLoginHeader = (
        <>
            <nav>
                <ul className="nav" style={{'width': '100%','height': '40px','background': '#fff','display': 'flex', 'padding': '10px','boxShadow': '0px 3px 4px #0000001a', 'marginBottom': '16px'}}>
                    <Link to="/user/users" style={{'marginRight': 'auto'}}>
                        <li className="ml-2">LARAVEL</li>
                    </Link>
                    {props.authName && <li>{props.authName}</li>}
                    <li className="ml-2" onClick={handleLogout}>ログアウト</li>
                </ul>
            </nav>
            <nav>
                <ul className="nav">
                    <Link to="/user/users">
                        <li className="ml-2">TEST会員一覧</li>
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
