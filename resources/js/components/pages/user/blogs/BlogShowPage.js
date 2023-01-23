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
import { useTranslation } from 'react-i18next';

// TODO: Create breadcrumb lists
// TODO: Add related tag lists
// TODO: Add browser history lists

function BlogShowPage(props) {

    const baseUrl = `/api/user/blogs/${props.match.params.id}`;
    const model = 'BLOG';
    const {data, errorMessage} = useFetchApiData(baseUrl, model);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const {isJson} = useHelper();
    const blog = data.blog;
    const { t } = useTranslation();

    
    useEffect(() => {
        if(blog) {
            // Convert the body of blog which is stored as JSON into contentState * Judge if it's HTML or JSON because demo data is stored as HTML 
            const contentState = isJson(blog.body) ? convertFromRaw(JSON.parse(blog.body)) : stateFromHTML(blog.body);
            // Convert contentState into editorState
            const editorState = EditorState.createWithContent(contentState);
            // Set editorState to draft.js
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
                    <Image src={blog.thumbnail} type='blog_news' alt="blog image" style={{'width' : '100%', 'marginBottom': '8px'}} />
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
                        {t('user.blog.item')}
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
