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
import { useTranslation } from 'react-i18next';
import BrowsingHistory from '../../../organisms/user/Cotents/BrowsingHistory';
import ItemCardLists from '../../../organisms/user/Cotents/ItemCardLists'
import useCreateParams from '../../../hooks/useCreateParams';
import Breadcrumbs from '../../../organisms/user/Cotents/Breadcrumbs';
import RelatedTagLists from '../../../organisms/user/Cotents/RelatedTagLists';

function BlogShowPage(props) {

  const baseUrl = `/api/user/blogs/${props.match.params.id}`;
  const model = 'BLOG';
  const { handleFilterCheckbox, params, setParams, handleBreadCrumbs } = useCreateParams(model);
  const { data, errorMessage } = useFetchApiData(baseUrl, model);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const { isJson } = useHelper();
  const blog = data.blog;
  const { t } = useTranslation();

  useEffect(() => {
    if (params.scope === null) {
      setParams({
        paginate: {},
        sort: { 'posted_at': '', 'modified_at': '' },
        filter: { 'search': '', 'tag': [], 'brand': [], 'item': [], 'gender_category': '' },
        scope: model
      });
    }
    if (blog) {
      // Convert the body of blog which is stored as JSON into contentState * Judge if it's HTML or JSON because demo data is stored as HTML 
      const contentState = isJson(blog.body) ? convertFromRaw(JSON.parse(blog.body)) : stateFromHTML(blog.body);
      // Convert contentState into editorState
      const editorState = EditorState.createWithContent(contentState);
      // Set editorState to draft.js
      setEditorState(editorState);
    }
  }, []);

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <div className={styles.blog_news_contents_area}>
          <Breadcrumbs
            brand={blog.brand}
            gender={blog.category}
            to={'/blogs'}
            filterMethod={handleBreadCrumbs}
            style={{ 'margin': '12px 0' }}
          />
          <Heading tag={'h1'} tag_style={'h1'} className={[styles.title, styles.mb_8, styles.mt_8].join(' ')}>
            {blog.title}
          </Heading>
          <Text size='s' className={styles.mb_8}>
            {blog.modified_at ? blog.modified_at : blog.posted_at}
          </Text>
          <Image src={blog.thumbnail} type='blog_news' alt="blog image" style={{ 'width': '100%', 'marginBottom': '8px' }} />
          <Editor
            editorState={editorState}
            readOnly={true}
            toolbar={{
              options: [],
              inline: { options: [] },
              list: { options: [] }
            }}
            toolbarClassName={styles.hide_toolbar}
          />
          <Heading tag={'h2'} tag_style={'h1'} className={[styles.title, styles.mb_12, styles.mt_24].join(' ')}>
            {t('user.blog.related-tag')}
          </Heading>
          <RelatedTagLists
            tags={blog.tags}
            to={'/blogs'}
            filterMethod={handleFilterCheckbox}
          />
          <Heading tag={'h2'} tag_style={'h1'} className={[styles.title, styles.mb_16, styles.mt_32].join(' ')}>
            {t('user.blog.item')}
          </Heading>
          {blog.items && <ItemCardLists items={blog.items} className={styles.mb_24} />}
          <BrowsingHistory />
        </div>
      </Suspense>
    </main >
  );
}

export default BlogShowPage;
