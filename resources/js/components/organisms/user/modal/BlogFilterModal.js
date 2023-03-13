import React, { memo } from 'react';
import useCreateParams from '../../../hooks/useCreateParams';
import InputText from '../../../atoms/InputText/InputText';
import Pulldown from '../../../molecules/Pullldown/Pulldown';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import Mask from '../../../atoms/Mask/Mask';
import Button from '../../../atoms/Button/Button';
import { useTranslation } from 'react-i18next';
import BrandFilter from '../../common/Filter/BrandFilter';
import ItemFilter from '../../common/Filter/ItemFilter';
import TagFilter from '../../common/Filter/TagFilter';

const BlogFilterModal = memo(({
  brands,
  gender_categories,
  items,
  tags,
  onClick,
  model
}) => {

  const { handleFilter, handleFilterCheckbox, params } = useCreateParams(model);
  const { t } = useTranslation();

  return (
    <Mask>
      <div className={styles.container}>

        <Text size='l' className={[styles.mb_24, styles.text_center].join(' ')}>{t('user.set-filter')}</Text>

        <div className={styles.mb_16}>
          <label htmlFor='search'>
            <Text className={styles.mb_8}>{t('user.keyword')}</Text>
          </label>
          <InputText
            type='text'
            name='search'
            onBlur={handleFilter}
            value={params.filter.search}
            placeholder={t('user.blog.keyword-ex')}
            className={styles.w_100}
          />
        </div>

        <BrandFilter
          brands={brands}
          params={params.filter.brand}
          onChange={handleFilterCheckbox}
          className={styles.mb_16}
        />

        <div className={styles.mb_16}>
          <Text className={styles.mb_8}>{t('user.blog.category')}</Text>
          {gender_categories &&
            <Pulldown
              name='gender_category'
              value={params.filter.gender_category}
              onChange={handleFilter}
              initialLabel={t('user.blog.gender-category-ex')}
            >
              {gender_categories.map((category) =>
                <option key={category.id} value={category.id}>{category.category_name}</option>
              )}
            </Pulldown>
          }
        </div>

        <ItemFilter
          items={items}
          params={params.filter.item}
          onChange={handleFilterCheckbox}
          className={styles.mb_16}
        />

        <TagFilter
          tags={tags}
          params={params.filter.tag}
          onChange={handleFilterCheckbox}
          className={styles.mb_16}
        />

        <Button className={styles.close_btn} onClick={onClick}>{t('user.close-btn')}</Button>

      </div>
    </Mask>
  );
});

export default BlogFilterModal;