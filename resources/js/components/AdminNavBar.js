import React from 'react';
import { Link } from 'react-router-dom';

function AdminNavBar() {
    return (
        <nav>
            <ul className="nav">
                <Link to="/">
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
            </ul>
        </nav>
    )
}

export default AdminNavBar;
