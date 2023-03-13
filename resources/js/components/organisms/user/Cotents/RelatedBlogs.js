import React, { memo } from 'react';
import { useTranslation } from "react-i18next";
import Heading from '../../../atoms/Heading/Heading';
import MediaCard from '../Card/MediaCard';
import styles from './styles.module.css';

const RelatedBlogs = memo(({ media, className, ...props }) => {

  const { t } = useTranslation();

  return (
    <div className={className} {...props}>
      <Heading tag={'h2'} tag_style={'h1'} className={[styles.title, styles.mb_16].join(' ')}>
        {t('user.item.related-blog')}
      </Heading>
      {media.map((blog) =>
        <MediaCard
          key={blog.id}
          src={blog.thumbnail}
          to={`/blogs/${blog.id}`}
          title={blog.title}
          brand_name={blog.brand_name}
          posted_at={blog.posted_at}
          modified_at={blog.modified_at}
          related_tags={blog.tags}
        />
      )}
    </div >
  );
});

export default RelatedBlogs;