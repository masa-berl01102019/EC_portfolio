import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../atoms/Image/Image';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import Icon from '../../../atoms/Icon/Icon';

const MediaCard = memo(({
  src,
  to,
  title,
  brand_name,
  posted_at,
  modified_at,
  related_tags = [],
  className = '',
  ...props
}) => {

  return (
    <div className={styles.info_card} {...props}>
      <Link to={to} className={[styles.link_fill, styles.flex].join(' ')}>
        <div className={[styles.mr_8, styles.img_contents].join(' ')}>
          <Image src={src} type='blog_news' alt="thumbnail image" className={styles.info_img} />
        </div>
        <div className={styles.media_text_contents}>
          <Text size='l' className={[styles.mb_8, styles.card_text, styles.font_bold].join(' ')}>{title}</Text>
          <Text className={[styles.mb_8, styles.card_text].join(' ')}>{brand_name}</Text>
          <Text className={[styles.mb_8, styles.card_text, styles.hash_tag].join(' ')}>
            {related_tags && related_tags.map((tag) => '#' + tag).join(' ')}
          </Text>
          <div className={styles.date_area}>
            {posted_at &&
              <div className={[styles.mr_4, styles.card_text].join(' ')}>
                <Icon src={'/img/posted_at_icon.svg'} className={styles.time_icon} />
                <Text size='s' className={styles.time_text}>{posted_at}</Text>
              </div>
            }
            {modified_at &&
              <div className={styles.card_text}>
                <Icon src={'/img/updated_at_icon.svg'} className={styles.time_icon} />
                <Text size='s' className={styles.time_text}>{modified_at}</Text>
              </div>
            }
          </div>
        </div>
        <Icon src={'/img/arrow_right_icon.svg'} className={styles.icon} />
      </Link>
    </div>
  );

});

export default MediaCard;