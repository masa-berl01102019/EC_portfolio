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

// TODO: Create breadcrumb lists
// TODO: Add related tag lists
// TODO: Add browser history lists

function NewsShowPage(props) {

    const baseUrl = `/api/user/news/${props.match.params.id}`;
    const model = 'NEWS';
    const {data, errorMessage} = useFetchApiData(baseUrl, model);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const {isJson} = useHelper();
    const news = data.news;

    useEffect(() => {
        if(news) {
            // Convert the body of news which is stored as JSON into contentState * Judge if it's HTML or JSON because demo data is stored as HTML 
            const contentState = isJson(news.body) ? convertFromRaw(JSON.parse(news.body)) : stateFromHTML(news.body);
            // Convert contentState into editorState
            const editorState = EditorState.createWithContent(contentState);
            // Set editorState to draft.js
            setEditorState(editorState);
        }
    },[]);
    
    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {   news &&
                <div className={styles.blog_news_contents_area}>
                    <Heading tag={'h1'} tag_style={'h1'} className={[styles.title, styles.mb_8, styles.mt_8].join(' ')}>
                        {news.title}
                    </Heading>
                    <Text size='s' className={styles.mb_8}>
                        {news.modified_at ? news.modified_at : news.posted_at}
                    </Text>
                    <Image src={news.thumbnail} type='blog_news' alt="blog image" className={[styles.w_100, styles.mb_8].join(' ')}/>
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
                </div>
            }
            </Suspense>
        </main>
    );
}

export default NewsShowPage;
