import React, {Suspense, useEffect, useState} from 'react';
import {EditorState, convertFromRaw} from 'draft-js';
import {Editor} from "react-draft-wysiwyg";
import {stateFromHTML} from 'draft-js-import-html';
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useHelper from "../../../hooks/useHelper";
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import Image from '../../../atoms/Image/Image';
import styles from '../styles.module.css';
import TopItemCard from '../../../molecules/Card/TopItemCard';

function BlogShowPage(props) {
    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/user/blogs/${props.match.params.id}`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'BLOG';
    // APIと接続して返り値を取得
    const {data, errorMessage} = useFetchApiData(baseUrl, model);
    // draft-js用のステート管理
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    // 便利関数の呼び出し
    const {isJson} = useHelper();
    // API接続の返却値を変数に格納
    const blog = data.blog;

    
    useEffect(() => {
        // 非同期で通信されるので初回読み込み時にblogが入ってこない場合があるので条件分岐してあげる
        if(blog) {
            // blogの本文はJSONで保存されてるのでcontentStateに変換 * デモデータはHTMLで保存されてるのでJSONか判定して違ったらHTMLをcontentStateに変換
            const contentState = isJson(blog.body) ? convertFromRaw(JSON.parse(blog.body)) : stateFromHTML(blog.body);
            // contentStateをeditorStateに変換
            const editorState = EditorState.createWithContent(contentState);
            // editorStateをdraft.jsにセット
            setEditorState(editorState);
        }
    },[]);

    
    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={styles.blog_news_contents_area}>
                    <Heading tag={'h1'} tag_style={'h1'} className={[styles.title, styles.mb_8, styles.mt_8].join(' ')}>
                        {blog.title}
                    </Heading>
                    <Text size='s' className={styles.mb_8}>
                        {blog.modified_at ? blog.modified_at : blog.posted_at}
                    </Text>
                    <Image src={blog.thumbnail} type='blog_news' alt="ブログ画像" style={{'width' : '100%', 'marginBottom': '8px'}} />
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
                        toolbarClassName={styles.hide_toolbar}
                    />
                    <Heading tag={'h2'} tag_style={'h2'} className={[styles.title, styles.mb_8, styles.mt_40].join(' ')}>
                        ブログ関連商品
                    </Heading>
                    {   data.blog.items &&
                        <div className={[styles.search_item_area, styles.mb_24].join(' ')}>
                            {                        
                                data.blog.items.map((item) =>
                                    <TopItemCard 
                                        key={item.id}
                                        src={item.top_image}
                                        to={`/items/${item.id}`}
                                        brand_name={item.brand_name}
                                        item_name={item.item_name}
                                        price={item.included_tax_price_text}
                                        className={styles.item_card}
                                    />
                                )
                            }
                        </div>
                    }
                </div>
            </Suspense>
        </main>
    );
}

export default BlogShowPage;
