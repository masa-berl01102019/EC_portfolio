import React, { memo } from 'react';
import { useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import useCreateParams from '../../../hooks/useCreateParams';
import CheckboxTag from '../../../atoms/CheckboxTag/CheckboxTag';
import InputText from '../../../atoms/InputText/InputText';
import Pulldown from '../../../molecules/Pullldown/Pulldown';
import Text from '../../../atoms/Text/Text';
import DateRangeFilter from '../../../molecules/DateRangeFilter/DateRangeFilter';
import styles from './styles.module.css';
import Button from '../../../atoms/Button/Button';
import { useTranslation } from 'react-i18next';
import { CONST } from '../../../constants/constants';

const UserSidebar = memo(({ model, onClick }) => {

  const params = useRecoilValue(paramState(model));
  const { handleFilter, handleFilterCheckbox, handleSort } = useCreateParams(model);
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
            placeholder={t('admin.user.keyword-ex')}
            className={styles.w_100}
          />
        </div>

        <div className={[styles.mb_16, styles.flex_column].join(' ')}>
          <Text className={styles.mb_8}>{t('admin.user.gender')}</Text>
          <CheckboxTag
            name='gender'
            value={CONST.GENDER.MAN}
            onChange={handleFilterCheckbox}
            checked={params.filter.gender.includes(CONST.GENDER.MAN)}
            label={t('admin.user.gender-man')}
            style={{ 'marginBottom': '4px' }}
          />
          <CheckboxTag
            name='gender'
            value={CONST.GENDER.WOMAN}
            onChange={handleFilterCheckbox}
            checked={params.filter.gender.includes(CONST.GENDER.WOMAN)}
            label={t('admin.user.gender-woman')}
            style={{ 'marginBottom': '4px' }}
          />
          <CheckboxTag
            name='gender'
            value={CONST.GENDER.OTHERS}
            onChange={handleFilterCheckbox}
            checked={params.filter.gender.includes(CONST.GENDER.OTHERS)}
            label={t('admin.user.gender-other')}
            style={{ 'marginBottom': '4px' }}
          />
          <CheckboxTag
            name='gender'
            value={CONST.GENDER.NO_ANSWER}
            onChange={handleFilterCheckbox}
            checked={params.filter.gender.includes(CONST.GENDER.NO_ANSWER)}
            label={t('admin.user.gender-no-reply')}
          />
        </div>

        <div className={styles.mb_16}>
          <Text className={styles.mb_8}>{t('admin.user.dm-status')}</Text>
          <Pulldown name='is_received' value={params.filter.is_received} onChange={handleFilter} initialLabel={t('admin.not-set')}>
            <option value={CONST.IS_RECEIVED.NOT_REGISTERED}>{t('admin.user.register-yet')}</option>
            <option value={CONST.IS_RECEIVED.REGISTERED}>{t('admin.user.register-done')}</option>
          </Pulldown>
        </div>

        <DateRangeFilter params={params.filter} model={model} className={styles.mb_32}>
          <option value={'birthday'}>{t('admin.user.birthday')}</option>
          <option value={'created_at'}>{t('admin.created-date')}</option>
          <option value={'updated_at'}>{t('admin.updated-date')}</option>
        </DateRangeFilter>

        <Text size='l' className={styles.sec_title}>{t('admin.sort')}</Text>

        <div className={styles.mb_16}>
          <Text className={styles.mb_8}>{t('admin.user.name-kana')}</Text>
          <Pulldown name='last_name_kana' value={params.sort.last_name_kana} onChange={handleSort} initialLabel={t('admin.not-set')}>
            <option value={'desc'}>{t('admin.desc-alpha')}</option>
            <option value={'asc'}>{t('admin.asc-alpha')}</option>
          </Pulldown>
        </div>
        <div className={styles.mb_16}>
          <Text className={styles.mb_8}>{t('admin.user.birthday')}</Text>
          <Pulldown name='birthday' value={params.sort.birthday} onChange={handleSort} initialLabel={t('admin.not-set')}>
            <option value={'desc'}>{t('admin.desc-date')}</option>
            <option value={'asc'}>{t('admin.asc-date')}</option>
          </Pulldown>
        </div>
        <div className={styles.mb_16}>
          <Text className={styles.mb_8}>{t('admin.created-date')}</Text>
          <Pulldown name='created_at' value={params.sort.created_at} onChange={handleSort} initialLabel={t('admin.not-set')}>
            <option value={'desc'}>{t('admin.desc-date')}</option>
            <option value={'asc'}>{t('admin.asc-date')}</option>
          </Pulldown>
        </div>
        <div>
          <Text className={styles.mb_8}>{t('admin.updated-date')}</Text>
          <Pulldown name='updated_at' value={params.sort.updated_at} onChange={handleSort} initialLabel={t('admin.not-set')}>
            <option value={'desc'}>{t('admin.desc-date')}</option>
            <option value={'asc'}>{t('admin.asc-date')}</option>
          </Pulldown>
        </div>

        <Button className={styles.close_btn} onClick={onClick}>{t('admin.close-btn')}</Button>
      </div>
    </div>
  );

});

export default UserSidebar;