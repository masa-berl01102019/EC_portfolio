import React, { memo } from 'react';
import { useTranslation } from "react-i18next";
import styles from './styles.module.css';
import Text from '../../../atoms/Text/Text';

const ItemDetailInfo = memo(({ item, className, ...props }) => {

  const { t } = useTranslation();

  const itemInfo = [
    { info_category: t('user.item.color'), content: item.color_variation.join(' / ') },
    { info_category: t('user.item.size'), content: item.size_variation.join(' / ') },
    { info_category: t('user.item.gender'), content: item.gender_category },
    { info_category: t('user.item.category'), content: item.main_category + ' > ' + item.sub_category },
    { info_category: t('user.item.material'), content: item.mixture_ratio },
    { info_category: t('user.item.made-in'), content: item.made_in },
    { info_category: t('user.item.product-number'), content: item.product_number },
  ];

  return (
    <div className={className} {...props}>
      <ul className={styles.detail_info_list}>
        {itemInfo.map((list, index) => (
          <li key={index} className={[styles.flex, styles.mb_8].join(' ')}>
            <Text className={[styles.bold, styles.flex_basis_140p].join(' ')}>
              {list.info_category}
            </Text>
            <Text className={styles.flex_1}>{list.content}</Text>
          </li>
        ))}
      </ul>
    </div >
  );
});

export default ItemDetailInfo;