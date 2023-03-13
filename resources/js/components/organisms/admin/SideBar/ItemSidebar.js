import React, { memo } from 'react';
import { useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import useCreateParams from '../../../hooks/useCreateParams';
import InputText from '../../../atoms/InputText/InputText';
import Pulldown from '../../../molecules/Pullldown/Pulldown';
import Text from '../../../atoms/Text/Text';
import DateRangeFilter from '../../../molecules/DateRangeFilter/DateRangeFilter';
import styles from './styles.module.css';
import Button from '../../../atoms/Button/Button';
import { useTranslation } from 'react-i18next';
import TagFilter from '../../common/Filter/TagFilter';
import BrandFilter from '../../common/Filter/BrandFilter';
import SizeFilter from '../../common/Filter/SizeFilter';
import ColorFilter from '../../common/Filter/ColorFilter';
import { CONST } from '../../../constants/constants';
import CategoryFilter from '../../common/Filter/CategoryFilter';

const ItemSidebar = memo(({
  brands,
  gender_categories,
  main_categories,
  sub_categories,
  sizes,
  colors,
  tags,
  model,
  onClick
}) => {

  const params = useRecoilValue(paramState(model));
  const { handleFilter, handleFilterCheckbox, handleFilterCategory, handleSort } = useCreateParams(model);
  const { t } = useTranslation();

  return (
    <div className={styles.sidebar}>
      <div className={styles.container}>

        <Text size='l' className={styles.sec_title}>{t('admin.filter')}</Text>

        <div className={styles.mb_16}>
          <label htmlFor='search'>
            <Text className={styles.mb_8}>{t('admin.keyword')}</Text>
          </label>
          <InputText
            type='text'
            name='search'
            onBlur={handleFilter}
            value={params.filter.search}
            placeholder={t('admin.item.keyword-ex')}
          />
        </div>

        <BrandFilter
          brands={brands}
          params={params.filter.brand}
          onChange={handleFilterCheckbox}
          className={styles.mb_16}
        />

        <CategoryFilter
          gender_categories={gender_categories}
          main_categories={main_categories}
          sub_categories={sub_categories}
          params={params.filter}
          onChange={handleFilterCategory}
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

        <TagFilter
          tags={tags}
          params={params.filter.tag}
          onChange={handleFilterCheckbox}
          className={styles.mb_16}
        />

        <div className={styles.mb_16}>
          <Text className={styles.mb_8}>{t('admin.published-status')}</Text>
          <Pulldown
            name='is_published'
            value={params.filter.is_published}
            onChange={handleFilter}
            initialLabel={t('admin.not-set')}
          >
            <option value={CONST.IS_PUBLISHED.NOT_PUBLISHED}>{t('admin.unpublished')}</option>
            <option value={CONST.IS_PUBLISHED.PUBLISHED}>{t('admin.published')}</option>
          </Pulldown>
        </div>

        <DateRangeFilter params={params.filter} model={model} className={styles.mb_16}>
          <option value={'posted_at'}>{t('admin.posted-date')}</option>
          <option value={'modified_at'}>{t('admin.updated-date')}</option>
        </DateRangeFilter>

        <div className={styles.mb_16}>
          <Text className={styles.mb_8}>{t('admin.item.stock-status')}</Text>
          <Pulldown
            name='stock_status'
            value={params.filter.stock_status}
            onChange={handleFilter}
            initialLabel={t('admin.not-set')}
          >
            <option value={CONST.STOCK_OPTION.ALL}>{t('admin.item.all')}</option>
            <option value={CONST.STOCK_OPTION.STOCK_ONLY}>{t('admin.item.stock-only')}</option>
          </Pulldown>
        </div>

        <div className={styles.mb_32}>
          <label htmlFor='price_from'>
            <Text className={styles.mb_8}>{t('admin.item.price-range')}</Text>
          </label>
          <div className={[styles.flex_row, styles.align_center].join(' ')}>
            <InputText
              type='number'
              name='price_from'
              onBlur={handleFilter}
              value={params.filter.price_from}
              placeholder={t('admin.item.price-low-ex')}
              className={styles.w_100}
            />
            <Text className={styles.ma}>~</Text>
            <InputText
              type='number'
              name='price_to'
              onBlur={handleFilter}
              value={params.filter.price_to}
              placeholder={t('admin.item.price-high-ex')}
              className={styles.w_100}
            />
          </div>
        </div>

        <Text size='l' className={styles.sec_title}>{t('admin.sort')}</Text>

        <div className={styles.mb_16}>
          <Text className={styles.mb_8}>{t('admin.item.product-number')}</Text>
          <Pulldown
            name='product_number'
            value={params.sort.product_number}
            onChange={handleSort}
            initialLabel={t('admin.not-set')}
          >
            <option value={'desc'}>{t('admin.desc-alpha')}</option>
            <option value={'asc'}>{t('admin.asc-alpha')}</option>
          </Pulldown>
        </div>

        <div className={styles.mb_16}>
          <Text className={styles.mb_8}>{t('admin.item.item-name')}</Text>
          <Pulldown
            name='item_name'
            value={params.sort.item_name}
            onChange={handleSort}
            initialLabel={t('admin.not-set')}
          >
            <option value={'desc'}>{t('admin.desc-alpha')}</option>
            <option value={'asc'}>{t('admin.asc-alpha')}</option>
          </Pulldown>
        </div>

        <div className={styles.mb_16}>
          <Text className={styles.mb_8}>{t('admin.item.price')}</Text>
          <Pulldown
            name='price'
            value={params.sort.price}
            onChange={handleSort}
            initialLabel={t('admin.not-set')}
          >
            <option value={'desc'}>{t('admin.desc-num')}</option>
            <option value={'asc'}>{t('admin.asc-num')}</option>
          </Pulldown>
        </div>

        <div className={styles.mb_16}>
          <Text className={styles.mb_8}>{t('admin.item.cost')}</Text>
          <Pulldown
            name='cost'
            value={params.sort.cost}
            onChange={handleSort}
            initialLabel={t('admin.not-set')}
          >
            <option value={'desc'}>{t('admin.desc-num')}</option>
            <option value={'asc'}>{t('admin.asc-num')}</option>
          </Pulldown>
        </div>

        <div className={styles.mb_16}>
          <Text className={styles.mb_8}>{t('admin.posted-date')}</Text>
          <Pulldown
            name='posted_at'
            value={params.sort.posted_at}
            onChange={handleSort}
            initialLabel={t('admin.not-set')}
          >
            <option value={'desc'}>{t('admin.desc-date')}</option>
            <option value={'asc'}>{t('admin.asc-date')}</option>
          </Pulldown>
        </div>

        <div>
          <Text className={styles.mb_8}>{t('admin.updated-date')}</Text>
          <Pulldown
            name='modified_at'
            value={params.sort.modified_at}
            onChange={handleSort}
            initialLabel={t('admin.not-set')}
          >
            <option value={'desc'}>{t('admin.desc-date')}</option>
            <option value={'asc'}>{t('admin.asc-date')}</option>
          </Pulldown>
        </div>

        <Button className={styles.close_btn} onClick={onClick}>{t('admin.close-btn')}</Button>
      </div>
    </div>
  );
});

export default ItemSidebar;