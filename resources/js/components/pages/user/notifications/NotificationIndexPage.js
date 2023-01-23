import React from 'react';
import {Link} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";

function NotificationIndexPage() {

    // urlの設定
    const baseUrl = `/api/user/notifications`;
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}] = useFetchApiData(baseUrl, 'get', []);
    // APIから取得したデータを変数に格納
    const notifications = data.data? data.data: null;

    // 描画のみを担当
    return (
        isLoading ? (
            <CircularProgress disableShrink />
        ) : errorMessage && errorMessage.httpRequestError ? (
            <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p>
        ) : (
            <>
                <h1>お知らせ一覧</h1>

                {   notifications && !errorMessage &&
                    notifications.map((notification) =>
                        <div style={{'width': '50%'}} key={notification.id}>
                            <div style={{'background': '#bfbdbd'}}>
                                <p>{notification.modified_at ? notification.modified_at : notification.posted_at}</p>
                                <p>{notification.title}</p>
                            </div>
                            <div style={{'background': '#fff'}}>
                                <p>{notification.body}</p>
                            </div>
                        </div>
                    )
                }
            </>
        )
    );
}

export default NotificationIndexPage;



