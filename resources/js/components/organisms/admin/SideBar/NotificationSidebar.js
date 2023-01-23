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

const NotificationSidebar = ({model, onClick}) => {

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
                  placeholder={'タイトルを検索'}
                  className={styles.w_100}
              />
          </div>
          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>公開状況</Text>
            <Pulldown name='is_published' value={params.filter.is_published} onChange={handleFilter} > 
                <option value={'0'}>非公開</option>
                <option value={'1'}>公開中</option>
            </Pulldown>
          </div>
          <div className={styles.mb_32}>
            <DateRangeFilter params={params.filter} model={model}>
                <option value={'expired_at'}>掲載終了日</option>
                <option value={'posted_at'}>投稿日</option>
                <option value={'modified_at'}>更新日</option>
            </DateRangeFilter>
          </div>

          <Text size='l' className={styles.sec_title}>ソート条件</Text>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>掲載終了日</Text>
            <Pulldown name='expired_at' value={params.sort.expired_at} onChange={handleSort}>
                <option value={'desc'}>降順</option>
                <option value={'asc'}>昇順</option>
            </Pulldown>
          </div>
          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>投稿日</Text>
            <Pulldown name='posted_at' value={params.sort.posted_at} onChange={handleSort}>
                <option value={'desc'}>降順</option>
                <option value={'asc'}>昇順</option>
            </Pulldown>
          </div>
          <div>
            <Text className={styles.mb_8}>更新日</Text>
            <Pulldown name='modified_at' value={params.sort.modified_at} onChange={handleSort}>
                <option value={'desc'}>降順</option>
                <option value={'asc'}>昇順</option>
            </Pulldown>
          </div>

          <Button className={styles.close_btn} onClick={onClick} >閉じる</Button>
        </div>
      </div>
    );

};

export default NotificationSidebar;