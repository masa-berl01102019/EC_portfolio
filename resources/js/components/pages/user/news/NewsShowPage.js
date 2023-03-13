import React, { Suspense, useEffect, useState } from 'react';
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import { stateFromHTML } from 'draft-js-import-html';
import useFetchApiData from "../../../hooks/useFetchApiData";
import { CircularProgress } from "@material-ui/core";
import useHelper from "../../../hooks/useHelper";
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import Image from '../../../atoms/Image/Image';
import styles from '../styles.module.css';
import Breadcrumbs from '../../../organisms/user/Cotents/Breadcrumbs';
import useCreateParams from '../../../hooks/useCreateParams';
import BrowsingHistory from '../../../organisms/user/Cotents/BrowsingHistory';
import RelatedTagLists from '../../../organisms/user/Cotents/RelatedTagLists';
import { useTranslation } from 'react-i18next';

function NewsShowPage(props) {

  const baseUrl = `/api/user/news/${props.match.params.id}`;
  const model = 'NEWS';
  const { data, errorMessage } = useFetchApiData(baseUrl, model);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const { isJson } = useHelper();
  const news = data.news;
  const { params, setParams, handleBreadCrumbs, handleFilterCheckbox } = useCreateParams(model);
  const { t } = useTranslation();

  useEffect(() => {
    if (params.scope === null) {
      setParams({
        paginate: {},
        sort: { 'posted_at': '', 'modified_at': '' },
        filter: { 'search': '', 'tag': [], 'brand': [], 'gender_category': '' },
        scope: model
      });
    }
    if (news) {
      // Convert the body of news which is stored as JSON into contentState 
      // * Judge if it's HTML or JSON because demo data is stored as HTML 
      const contentState = isJson(news.body) ? convertFromRaw(JSON.parse(news.body)) : stateFromHTML(news.body);
      // Convert contentState into editorState
      const editorState = EditorState.createWithContent(contentState);
      // Set editorState to draft.js
      setEditorState(editorState);
    }
  }, []);

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        {news &&
          <div className={styles.blog_news_contents_area}>
            <Breadcrumbs
              brand={news.brand}
              gender={news.category}
              to={'/news'}
              filterMethod={handleBreadCrumbs}
              style={{ 'margin': '12px 0' }}
            />
            <Heading tag={'h1'} tag_style={'h1'} className={[styles.title, styles.mb_8, styles.mt_8].join(' ')}>
              {news.title}
            </Heading>
            <Text size='s' className={styles.mb_8}>
              {news.modified_at ? news.modified_at : news.posted_at}
            </Text>
            <Image src={news.thumbnail} type='blog_news' alt="blog image" className={[styles.w_100, styles.mb_8].join(' ')} />
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
            <Heading tag={'h2'} tag_style={'h1'} className={[styles.title, styles.mb_12, styles.mt_24].join(' ')}>
              {t('user.blog.related-tag')}
            </Heading>
            <RelatedTagLists
              tags={news.tags}
              to={'/news'}
              filterMethod={handleFilterCheckbox}
              className={styles.mb_24}
            />
            <BrowsingHistory />
          </div>
        }
      </Suspense>
    </main>
  );
}

export default NewsShowPage;
