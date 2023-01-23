import React, {memo} from 'react';
import { useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import useCreateParams from '../../../hooks/useCreateParams';
import InputText from '../../../atoms/InputText/InputText';
import Pulldown from '../../../atoms/Pullldown/Pulldown';
import Text from '../../../atoms/Text/Text';
import DateRangeFilter from '../../../molecules/DateRangeFilter/DateRangeFilter';
import styles from './styles.module.css';
import Button from '../../../atoms/Button/Button';

const AdminSidebar = ({model, onClick}) => {

    // グローバルステート呼び出し
    const params = useRecoilValue(paramState(model));
    // URLパラメータ変更のフックの呼び出し
    const{handleFilter, handleSort} = useCreateParams(model);

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
          <div className={styles.mb_32}>
              <DateRangeFilter params={params.filter} model={model}>
                  <option value={'created_at'}>作成日時</option>
                  <option value={'updated_at'}>更新日時</option>
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
              <Text className={styles.mb_8}>作成日時</Text>
              <Pulldown name='created_at' value={params.sort.created_at} onChange={handleSort}>
                  <option value={'desc'}>降順</option>
                  <option value={'asc'}>昇順</option>
              </Pulldown>
          </div>
          <div>
              <Text className={styles.mb_8}>更新日時</Text>
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

export default AdminSidebar;