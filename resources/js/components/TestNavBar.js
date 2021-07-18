import React from 'react';
import { Link } from 'react-router-dom';

function TestNavBar() {
    return (
        <nav>
            <ul className="nav">
                <Link to="/">
                    <li className="ml-2">Top</li>
                </Link>
                <Link to="/admin/users">
                    <li className="ml-2">User 一覧</li>
                </Link>
                <Link to="/admin/users/create">
                    <li className="ml-2">User 新規作成</li>
                </Link>
            </ul>
        </nav>
    )
}

export default TestNavBar;
