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

const UserSidebar = ({model, onClick}) => {

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
              <Text className={styles.mb_8}>性別</Text>
              <CheckboxTag
                  name='gender' 
                  value={0} 
                  onChange={handleFilterCheckbox} 
                  checked={params.filter.gender.includes(0)} 
                  label={'男性'}
                  style={{'marginBottom' : '4px' }}
              />
              <CheckboxTag
                  name='gender' 
                  value={1} 
                  onChange={handleFilterCheckbox} 
                  checked={params.filter.gender.includes(1)} 
                  label={'女性'}
                  style={{'marginBottom' : '4px' }}
              />
              <CheckboxTag
                  name='gender' 
                  value={2} 
                  onChange={handleFilterCheckbox} 
                  checked={params.filter.gender.includes(2)} 
                  label={'その他'}
                  style={{'marginBottom' : '4px' }}
              />
              <CheckboxTag
                  name='gender' 
                  value={3} 
                  onChange={handleFilterCheckbox} 
                  checked={params.filter.gender.includes(3)} 
                  label={'未回答'}
              />
          </div>
          
          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>DM登録状況</Text>
              <Pulldown name='is_received' value={params.filter.is_received} onChange={handleFilter}>
                  <option value={''}>未設定</option>
                  <option value={'0'}>未登録</option>
                  <option value={'1'}>登録済</option>
              </Pulldown>
          </div>
          <div className={styles.mb_32}>
              <DateRangeFilter params={params.filter} model={model}>
                  <option value={''}>フィールド選択</option>
                  <option value={'birthday'}>生年月日</option>
                  <option value={'created_at'}>作成日</option>
                  <option value={'updated_at'}>更新日</option>
              </DateRangeFilter>
          </div>

          <Text size='l' className={styles.sec_title}>ソート条件</Text>

          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>氏名(カナ)</Text>
              <Pulldown name='last_name_kana' value={params.sort.last_name_kana} onChange={handleSort}>
                  <option value={''}>未設定</option>
                  <option value={'desc'}>降順</option>
                  <option value={'asc'}>昇順</option>
              </Pulldown>
          </div>
          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>生年月日</Text>
              <Pulldown name='birthday' value={params.sort.birthday} onChange={handleSort}>
                  <option value={''}>未設定</option>
                  <option value={'desc'}>降順</option>
                  <option value={'asc'}>昇順</option>
              </Pulldown>
          </div>
          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>作成日時</Text>
              <Pulldown name='created_at' value={params.sort.created_at} onChange={handleSort}>
                  <option value={''}>未設定</option>
                  <option value={'desc'}>降順</option>
                  <option value={'asc'}>昇順</option>
              </Pulldown>
          </div>
          <div>
              <Text className={styles.mb_8}>更新日時</Text>
              <Pulldown name='updated_at' value={params.sort.updated_at} onChange={handleSort}>
                  <option value={''}>未設定</option>
                  <option value={'desc'}>降順</option>
                  <option value={'asc'}>昇順</option>
              </Pulldown>
          </div>

          <Button className={styles.close_btn} onClick={onClick} >閉じる</Button>

         
        </div>
      </div>
    );

};

export default UserSidebar;