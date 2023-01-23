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
import useI18next from '../../../context/I18nextContext';

const UserSidebar = ({model, onClick}) => {

    const params = useRecoilValue(paramState(model));
    const{handleFilter, handleFilterCheckbox, handleSort} = useCreateParams(model);
    const i18next = useI18next();

    return (
      <div className={styles.sidebar}>
        <div className={styles.container}>

          <Text size='l' className={styles.sec_title}>{i18next.t('admin.filter')}</Text>

          <div className={styles.mb_16}>
            <label htmlFor='search'>
                <Text className={styles.mb_8}>{i18next.t('admin.keyword')}</Text>
            </label>
            <InputText
                type='text' 
                name='search' 
                onBlur={handleFilter} 
                value={params.filter.search} 
                placeholder={i18next.t('admin.user.keyword-ex')}
                className={styles.w_100}
            />
          </div>

          <div className={[styles.mb_16, styles.flex_column].join(' ')}>
              <Text className={styles.mb_8}>{i18next.t('admin.user.gender')}</Text>
              <CheckboxTag
                  name='gender' 
                  value={0} 
                  onChange={handleFilterCheckbox} 
                  checked={params.filter.gender.includes(0)} 
                  label={i18next.t('admin.user.gender-man')}
                  style={{'marginBottom' : '4px' }}
              />
              <CheckboxTag
                  name='gender' 
                  value={1} 
                  onChange={handleFilterCheckbox} 
                  checked={params.filter.gender.includes(1)} 
                  label={i18next.t('admin.user.gender-woman')}
                  style={{'marginBottom' : '4px' }}
              />
              <CheckboxTag
                  name='gender' 
                  value={2} 
                  onChange={handleFilterCheckbox} 
                  checked={params.filter.gender.includes(2)} 
                  label={i18next.t('admin.user.gender-other')}
                  style={{'marginBottom' : '4px' }}
              />
              <CheckboxTag
                  name='gender' 
                  value={3} 
                  onChange={handleFilterCheckbox} 
                  checked={params.filter.gender.includes(3)} 
                  label={i18next.t('admin.user.gender-no-reply')}
              />
          </div>
          
          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>{i18next.t('admin.user.dm-status')}</Text>
              <Pulldown name='is_received' value={params.filter.is_received} onChange={handleFilter} defaultOption={i18next.t('admin.not-set')}>
                  <option value={'0'}>{i18next.t('admin.user.register-yet')}</option>
                  <option value={'1'}>{i18next.t('admin.user.register-done')}</option>
              </Pulldown>
          </div>
          <div className={styles.mb_32}>
              <DateRangeFilter params={params.filter} model={model}>
                  <option value={'birthday'}>{i18next.t('admin.user.birthday')}</option>
                  <option value={'created_at'}>{i18next.t('admin.created-date')}</option>
                  <option value={'updated_at'}>{i18next.t('admin.updated-date')}</option>
              </DateRangeFilter>
          </div>

          <Text size='l' className={styles.sec_title}>{i18next.t('admin.sort')}</Text>

          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>{i18next.t('admin.user.name-kana')}</Text>
              <Pulldown name='last_name_kana' value={params.sort.last_name_kana} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}>
                  <option value={'desc'}>{i18next.t('admin.desc-alpha')}</option>
                  <option value={'asc'}>{i18next.t('admin.asc-alpha')}</option>
              </Pulldown>
          </div>
          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>{i18next.t('admin.user.birthday')}</Text>
              <Pulldown name='birthday' value={params.sort.birthday} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}>
                  <option value={'desc'}>{i18next.t('admin.desc-date')}</option>
                  <option value={'asc'}>{i18next.t('admin.asc-date')}</option>
              </Pulldown>
          </div>
          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>{i18next.t('admin.created-date')}</Text>
              <Pulldown name='created_at' value={params.sort.created_at} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}>
                  <option value={'desc'}>{i18next.t('admin.desc-date')}</option>
                  <option value={'asc'}>{i18next.t('admin.asc-date')}</option>
              </Pulldown>
          </div>
          <div>
              <Text className={styles.mb_8}>{i18next.t('admin.updated-date')}</Text>
              <Pulldown name='updated_at' value={params.sort.updated_at} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}>
                  <option value={'desc'}>{i18next.t('admin.desc-date')}</option>
                  <option value={'asc'}>{i18next.t('admin.asc-date')}</option>
              </Pulldown>
          </div>

          <Button className={styles.close_btn} onClick={onClick}>{i18next.t('admin.close-btn')}</Button>

         
        </div>
      </div>
    );

};

export default UserSidebar;