import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Text from '../../../atoms/Text/Text';
import Pulldown from '../../../molecules/Pullldown/Pulldown';
import styles from './styles.module.css';

const CategoryFilter = memo(({
  gender_categories,
  main_categories,
  sub_categories,
  params,
  onChange,
  className = '',
  ...props
}) => {

  const { t } = useTranslation();

  return (
    <div className={className} {...props}>
      <Text className={styles.mb_8}>{t('user.item.category')}</Text>
      <Pulldown
        name='gender_category'
        value={params.gender_category}
        onChange={onChange}
        initialLabel={t('user.item.gender-category-ex')}
        className={styles.mb_8}
      >
        {gender_categories.map((category) =>
          <option key={category.id} value={category.id}>{category.category_name}</option>
        )}
      </Pulldown>
      <Pulldown
        name='main_category'
        value={params.main_category}
        onChange={onChange}
        initialLabel={t('user.item.main-category-ex')}
        className={styles.mb_8}
      >
        {main_categories.filter((category) => Number(params.gender_category) === category.parent_id).map((category) => (
          <option key={category.id} value={category.id}>{category.category_name}</option>
        ))}
      </Pulldown>
      <Pulldown
        name='sub_category'
        value={params.sub_category}
        onChange={onChange}
        initialLabel={t('user.item.sub-category-ex')}
      >
        {sub_categories.filter((category) => Number(params.main_category) === category.parent_id).map((category) => (
          <option key={category.id} value={category.id}>{category.category_name}</option>
        ))}
      </Pulldown>
    </div>
  );

});

export default CategoryFilter;