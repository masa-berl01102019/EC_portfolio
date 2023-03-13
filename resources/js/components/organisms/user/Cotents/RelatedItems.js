import React, { memo } from 'react';
import Heading from '../../../atoms/Heading/Heading';
import ItemCard from '../Card/ItemCard';
import { useTranslation } from "react-i18next";
import styles from './styles.module.css';

const RelatedItems = memo(({ relatedItems, className, ...props }) => {

  const { t } = useTranslation();

  return (
    <div className={className} {...props}>
      <Heading tag={'h2'} tag_style={'h1'} className={[styles.title, styles.mb_16].join(' ')}>
        {t('user.item.related-item')}
      </Heading>
      <div className={styles.related_card_area}>
        {relatedItems.map((item) =>
          <ItemCard
            key={item.id}
            item={item}
            className={styles.related_item_card}
          />
        )}
      </div>
    </div>
  );
});

export default RelatedItems;