import React, {memo} from 'react';
import { useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import useCreateParams from '../../../hooks/useCreateParams';
import CheckboxTag from '../../../atoms/CheckboxTag/CheckboxTag';
import InputText from '../../../atoms/InputText/InputText';
import Pulldown from '../../../atoms/Pullldown/Pulldown';
import Text from '../../../atoms/Text/Text';
import DateRangeFilter from '../../../molecules/DateRangeFilter/DateRangeFilter';
import styles from './styles.module.css';
import Button from '../../../atoms/Button/Button';
import { useTranslation } from 'react-i18next';

const ContactSidebar = ({model, onClick}) => {

    const params = useRecoilValue(paramState(model));
    const{handleFilter, handleFilterCheckbox, handleSort} = useCreateParams(model);
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
                  placeholder={t('admin.contact.name')}
                  className={styles.w_100}
              />
          </div>
          <div className={[styles.mb_16, styles.flex_column].join(' ')}>
              <Text className={styles.mb_8}>{t('admin.contact.response-status')}</Text>
              <CheckboxTag
                  name='response_status' 
                  value={0} 
                  onChange={handleFilterCheckbox} 
                  checked={params.filter.response_status.includes(0)} 
                  label={t('admin.contact.response-yet')}
                  style={{'marginBottom' : '4px' }}
              />
              <CheckboxTag
                  name='response_status' 
                  value={1} 
                  onChange={handleFilterCheckbox} 
                  checked={params.filter.response_status.includes(1)} 
                  label={t('admin.contact.response-during')}
                  style={{'marginBottom' : '4px' }}
              />
              <CheckboxTag
                  name='response_status' 
                  value={2} 
                  onChange={handleFilterCheckbox} 
                  checked={params.filter.response_status.includes(2)} 
                  label={t('admin.contact.response-done')}
              />
          </div>

          <div className={styles.mb_32}>
              <DateRangeFilter params={params.filter} model={model}>
                <option value={'created_at'}>{t('admin.contact.contacted-date')}</option>
                <option value={'updated_at'}>{t('admin.updated-date')}</option>
              </DateRangeFilter>
          </div>

          <Text size='l' className={styles.sec_title}>{t('admin.sort')}</Text>

          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>{t('admin.contact.name-kana')}</Text>
              <Pulldown name='last_name_kana' value={params.sort.last_name_kana} onChange={handleSort} defaultOption={t('admin.not-set')}>
                  <option value={'desc'}>{t('admin.desc-alpha')}</option>
                  <option value={'asc'}>{t('admin.asc-alpha')}</option>
              </Pulldown>
          </div>
          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>{t('admin.contact.contacted-date')}</Text>
              <Pulldown name='created_at' value={params.sort.created_at} onChange={handleSort} defaultOption={t('admin.not-set')}>
                <option value={'desc'}>{t('admin.desc-date')}</option>
                <option value={'asc'}>{t('admin.asc-date')}</option>
              </Pulldown>
          </div>
          <div>
              <Text className={styles.mb_8}>{t('admin.updated-date')}</Text>
              <Pulldown name='updated_at' value={params.sort.updated_at} onChange={handleSort} defaultOption={t('admin.not-set')}>
                <option value={'desc'}>{t('admin.desc-date')}</option>
                <option value={'asc'}>{t('admin.asc-date')}</option>
              </Pulldown>
          </div>

          <Button className={styles.close_btn} onClick={onClick}>{t('admin.close-btn')}</Button>
        </div>
      </div>
    );

};

export default ContactSidebar;