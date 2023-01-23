import React from 'react';
import { Link } from 'react-router-dom';

function TestNavBar() {
    return (
        <nav>
            <ul className="nav">
                <Link to="/">
                    <li className="ml-2">Top</li>
                </Link>
                <Link to="/about">
                    <li className="ml-2">About</li>
                </Link>
                <Link to="/user">
                    <li className="ml-2">User</li>
                </Link>
            </ul>
        </nav>
    )
}

export default TestNavBar;
