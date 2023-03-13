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
import { CONST } from '../../../constants/constants';

const NotificationSidebar = memo(({ model, onClick }) => {

  const params = useRecoilValue(paramState(model));
  const { handleFilter, handleSort } = useCreateParams(model);
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
            placeholder={t('admin.notification.keyword-ex')}
            className={styles.w_100}
          />
        </div>
        <div className={styles.mb_16}>
          <Text className={styles.mb_8}>{t('admin.published-status')}</Text>
          <Pulldown name='is_published' value={params.filter.is_published} onChange={handleFilter} initialLabel={t('admin.not-set')}>
            <option value={CONST.IS_PUBLISHED.NOT_PUBLISHED}>{t('admin.unpublished')}</option>
            <option value={CONST.IS_PUBLISHED.PUBLISHED}>{t('admin.published')}</option>
          </Pulldown>
        </div>

        <DateRangeFilter params={params.filter} model={model} className={styles.mb_32}>
          <option value={'expired_at'}>{t('admin.notification.expired-date')}</option>
          <option value={'posted_at'}>{t('admin.posted-date')}</option>
          <option value={'modified_at'}>{t('admin.updated-date')}</option>
        </DateRangeFilter>

        <Text size='l' className={styles.sec_title}>{t('admin.sort')}</Text>

        <div className={styles.mb_16}>
          <Text className={styles.mb_8}>{t('admin.notification.expired-date')}</Text>
          <Pulldown name='expired_at' value={params.sort.expired_at} onChange={handleSort} initialLabel={t('admin.not-set')}>
            <option value={'desc'}>{t('admin.desc-date')}</option>
            <option value={'asc'}>{t('admin.asc-date')}</option>
          </Pulldown>
        </div>
        <div className={styles.mb_16}>
          <Text className={styles.mb_8}>{t('admin.posted-date')}</Text>
          <Pulldown name='posted_at' value={params.sort.posted_at} onChange={handleSort} initialLabel={t('admin.not-set')}>
            <option value={'desc'}>{t('admin.desc-date')}</option>
            <option value={'asc'}>{t('admin.asc-date')}</option>
          </Pulldown>
        </div>
        <div>
          <Text className={styles.mb_8}>{t('admin.updated-date')}</Text>
          <Pulldown name='modified_at' value={params.sort.modified_at} onChange={handleSort} initialLabel={t('admin.not-set')}>
            <option value={'desc'}>{t('admin.desc-date')}</option>
            <option value={'asc'}>{t('admin.asc-date')}</option>
          </Pulldown>
        </div>

        <Button className={styles.close_btn} onClick={onClick}>{t('admin.close-btn')}</Button>
      </div>
    </div>
  );

});

export default NotificationSidebar;