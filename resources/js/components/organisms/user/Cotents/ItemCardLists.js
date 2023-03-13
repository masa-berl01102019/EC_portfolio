import React, { memo } from 'react';
import FlexWrapper from '../../../atoms/layout/FlexWrapper';
import ItemCard from '../Card/ItemCard';
import { useTranslation } from "react-i18next";
import styles from './styles.module.css';
import Text from '../../../atoms/Text/Text';

const ItemCardLists = memo(({ items = [], className, ...props }) => {

  const { t } = useTranslation();

  return (
    <>
      {items.length !== 0 ? (
        <FlexWrapper className={className} {...props}>
          {items.map((item) =>
            <ItemCard
              key={item.id}
              item={item}
              className={styles.item_card}
            />
          )}
        </FlexWrapper>
      ) : (
        <Text size='l' className={styles.not_found_msg}>
          {t('user.not-found')}
        </Text>
      )}
    </>
  );
})

export default ItemCardLists;