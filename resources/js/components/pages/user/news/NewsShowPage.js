import React, {Suspense, useEffect, useState} from 'react';
import {EditorState, convertFromRaw} from 'draft-js';
import {Editor} from "react-draft-wysiwyg";
import {stateFromHTML} from 'draft-js-import-html';
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
import {CircularProgress} from "@material-ui/core";
import useHelper from "../../../hooks/useHelper";
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import Image from '../../../atoms/Image/Image';
import styles from '../styles.module.css';

function NewsShowPage(props) {
    // urlの設定
    const baseUrl = `/api/user/news/${props.match.params.id}`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'NEWS';
    // APIと接続して返り値を取得
    const {data, errorMessage} = useFetchApiData2(baseUrl, model);
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
    },[]);

    
    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text role='error'>{errorMessage.httpRequestError}</Text>
                ) : (
                    <>
                        {   news &&
                            <div className={styles.blog_news_contents_area}>
                                <Heading tag={'h1'} tag_style={'h1'} className={[styles.title, styles.mb_8, styles.mt_8].join(' ')}>
                                    {news.title}
                                </Heading>
                                <Text size='s' className={styles.mb_8}>
                                    {news.modified_at ? news.modified_at : news.posted_at}
                                </Text>
                                <Image src={news.thumbnail} alt="ブログ画像" className={[styles.w_100, styles.mb_8].join(' ')}/>
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
                        }
                    </>
                )
            }
            </Suspense>
        </main>
    );
}

export default NewsShowPage;
