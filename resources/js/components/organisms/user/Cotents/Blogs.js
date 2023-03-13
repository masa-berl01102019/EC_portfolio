import React, { memo } from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Heading from '../../../atoms/Heading/Heading';
import MediaCard from '../Card/MediaCard';
import styles from './styles.module.css';
import Text from '../../../atoms/Text/Text';

const Blogs = memo(({ media, className, ...props }) => {

  const { t } = useTranslation();

  return (
    <div className={className} {...props}>
      <div className={styles.heade_line_wrap}>
        <Heading tag={"h2"} tag_style={"h1"} className={styles.title}>
          {t("user.top.blog")}
        </Heading>
        <Link to="/blogs">{t("user.top.to-list-page")}</Link>
      </div>
      {media.length > 0 ? (
        media.map((blog) =>
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
        )
      ) : (
        <Text size='l' className={styles.not_found_msg}>{t('user.not-found')}</Text>
      )}
    </div >
  );
});

export default Blogs;