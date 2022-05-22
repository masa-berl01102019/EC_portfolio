import React, {useEffect, useState} from 'react';
import {EditorState, convertFromRaw} from 'draft-js';
import {Editor} from "react-draft-wysiwyg";
import {stateFromHTML} from 'draft-js-import-html';
import {Link} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useHelper from "../../../hooks/useHelper";

function NewsShowPage(props) {

    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/user/news/${props.match.params.id}`;
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}] = useFetchApiData(baseUrl, 'get', []);
    // draft-js用のステート管理
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    // 便利関数の呼び出し
    const {isJson} = useHelper();
    // API接続の返却値を変数に格納
    const news = data.news;

    useEffect(() => {
        // 非同期で通信されるので初回読み込み時にnewsが入ってこない場合があるので条件分岐してあげる
        if(news) {
            // newsの本文はJSONで保存されてるのでcontentStateに変換 * デモデータはHTMLで保存されてるのでJSONか判定して違ったらHTMLをcontentStateに変換
            const contentState = isJson(news.body) ? convertFromRaw(JSON.parse(news.body)) : stateFromHTML(news.body);
            // contentStateをeditorStateに変換
            const editorState = EditorState.createWithContent(contentState);
            // editorStateをdraft.jsにセット
            setEditorState(editorState);
        }
    },[data]);

    // 描画のみを担当
    return (
        isLoading ? (
            <CircularProgress disableShrink />
        ) : errorMessage && errorMessage.httpRequestError ? (
            <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p>
        ) : (
            <>
            {   news &&
                <div style={{'width': '50%', 'margin': '0 auto'}}>
                    <h1>{news.title}</h1>
                    <p>{news.modified_at ? news.modified_at : news.posted_at}</p>
                    <div>
                        <img src={news.thumbnail} alt="news image" style={{'width' : '100%'}} />
                    </div>
                    <div>
                        <Editor
                            editorState={editorState}
                            readOnly={true}
                            toolbar={{
                                options: [],
                                inline: {
                                options: [],
                                },
                                list: {
                                options: [],
                                }
                            }}
                        />
                    </div>
                    <Link to={`/news`}>一覧に戻る</Link>
                </div>
            }
            </>
        )
    );
}

export default NewsShowPage;
