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

const ContactSidebar = ({model, onClick}) => {

    // グローバルステート呼び出し
    const params = useRecoilValue(paramState(model));
    // URLパラメータ変更のフックの呼び出し
    const{handleFilter, handleFilterCheckbox, handleSort} = useCreateParams(model);

    return (
      <div className={styles.sidebar}>
        <div className={styles.container}>

          <Text size='l' className={styles.sec_title}>フィルター条件</Text>

          <div className={styles.mb_16}>
              <label htmlFor='search'>
                  <Text className={styles.mb_8}>キーワード検索</Text>
              </label>
              <InputText
                  type='text' 
                  name='search' 
                  onBlur={handleFilter} 
                  value={params.filter.search} 
                  placeholder={'名前を検索'}
                  className={styles.w_100}
              />
          </div>
          <div className={[styles.mb_16, styles.flex_column].join(' ')}>
              <Text className={styles.mb_8}>対応状況</Text>
              <CheckboxTag
                  name='response_status' 
                  value={0} 
                  onChange={handleFilterCheckbox} 
                  checked={params.filter.response_status.includes(0)} 
                  label={'未対応'}
                  style={{'marginBottom' : '4px' }}
              />
              <CheckboxTag
                  name='response_status' 
                  value={1} 
                  onChange={handleFilterCheckbox} 
                  checked={params.filter.response_status.includes(1)} 
                  label={'対応中'}
                  style={{'marginBottom' : '4px' }}
              />
              <CheckboxTag
                  name='response_status' 
                  value={2} 
                  onChange={handleFilterCheckbox} 
                  checked={params.filter.response_status.includes(2)} 
                  label={'対応済'}
              />
          </div>

          <div className={styles.mb_32}>
              <DateRangeFilter params={params.filter} model={model}>
                    <option value={'created_at'}>お問い合わせ日</option>
                    <option value={'updated_at'}>対応日</option>
              </DateRangeFilter>
          </div>

          <Text size='l' className={styles.sec_title}>ソート条件</Text>

          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>氏名(カナ)</Text>
              <Pulldown name='last_name_kana' value={params.sort.last_name_kana} onChange={handleSort}>
                  <option value={'desc'}>降順</option>
                  <option value={'asc'}>昇順</option>
              </Pulldown>
          </div>
          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>お問い合わせ日</Text>
              <Pulldown name='created_at' value={params.sort.created_at} onChange={handleSort}>
                  <option value={'desc'}>降順</option>
                  <option value={'asc'}>昇順</option>
              </Pulldown>
          </div>
          <div>
              <Text className={styles.mb_8}>対応日</Text>
              <Pulldown name='updated_at' value={params.sort.updated_at} onChange={handleSort}>
                  <option value={'desc'}>降順</option>
                  <option value={'asc'}>昇順</option>
              </Pulldown>
          </div>

          <Button className={styles.close_btn} onClick={onClick} >閉じる</Button>
        </div>
      </div>
    );

};

export default ContactSidebar;