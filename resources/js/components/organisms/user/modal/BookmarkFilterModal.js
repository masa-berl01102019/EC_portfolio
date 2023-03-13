import React, { memo } from 'react';
import { useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import useCreateParams from '../../../hooks/useCreateParams';
import InputText from '../../../atoms/InputText/InputText';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import Mask from '../../../atoms/Mask/Mask';
import Button from '../../../atoms/Button/Button';
import { useTranslation } from 'react-i18next';
import BrandFilter from '../../common/Filter/BrandFilter';
import SizeFilter from '../../common/Filter/SizeFilter';
import ColorFilter from '../../common/Filter/ColorFilter';

const BookmarkFilterModal = memo(({
  brands,
  sizes,
  colors,
  onClick,
  model
}) => {

  const params = useRecoilValue(paramState(model));
  const { handleFilter, handleFilterCheckbox } = useCreateParams(model);
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
            placeholder={t('user.bookmark.keyword-ex')}
            className={styles.w_100}
          />
        </div>

        <BrandFilter
          brands={brands}
          params={params.filter.brand}
          onChange={handleFilterCheckbox}
          className={styles.mb_16}
        />

        <SizeFilter
          sizes={sizes}
          params={params.filter.size}
          onChange={handleFilterCheckbox}
          className={styles.mb_16}
        />

        <ColorFilter
          colors={colors}
          params={params.filter.color}
          onChange={handleFilterCheckbox}
          className={styles.mb_16}
        />

        <Button className={styles.close_btn} onClick={onClick}>{t('user.close-btn')}</Button>

      </div>
    </Mask>
  );
});

export default BookmarkFilterModal;