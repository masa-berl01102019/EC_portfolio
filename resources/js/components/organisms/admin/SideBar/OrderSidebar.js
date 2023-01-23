import React, {memo} from 'react';
import { useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import useCreateParams from '../../../hooks/useCreateParams';
import Pulldown from '../../../atoms/Pullldown/Pulldown';
import Text from '../../../atoms/Text/Text';
import DateRangeFilter from '../../../molecules/DateRangeFilter/DateRangeFilter';
import styles from './styles.module.css';
import Button from '../../../atoms/Button/Button';

const OrderSidebar = ({model, onClick}) => {

    // グローバルステート呼び出し
    const params = useRecoilValue(paramState(model));
    // URLパラメータ変更のフックの呼び出し
    const{handleFilter, handleSort} = useCreateParams(model);

    return (
      <div className={styles.sidebar}>
        <div className={styles.container}>

          <Text size='l' className={styles.sec_title}>フィルター条件</Text>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>支払方法</Text>
            <Pulldown name='payment_method' value={params.filter.payment_method} onChange={handleFilter} > 
                <option value={''}>未設定</option>
                <option value={'0'}>クレジットカード</option>
                <option value={'1'}>代引き</option>
            </Pulldown>
          </div>
          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>入金状況</Text>
            <Pulldown name='is_paid' value={params.filter.is_paid} onChange={handleFilter} > 
                <option value={''}>未設定</option>
                <option value={'0'}>未入金</option>
                <option value={'1'}>入金済</option>
            </Pulldown>
          </div>
          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>出荷状況</Text>
            <Pulldown name='is_shipped' value={params.filter.is_shipped} onChange={handleFilter} >
                <option value={''}>未設定</option>
                <option value={'0'}>未配送</option>
                <option value={'1'}>配送済</option>
            </Pulldown>
          </div>
          <div className={styles.mb_32}>
              <DateRangeFilter params={params.filter} model={model}>
                <option value={''}>フィールド選択</option>
                <option value={'created_at'}>購入日</option>
                <option value={'delivery_date'}>配達希望日</option>
                <option value={'updated_at'}>ステータス更新日</option>
              </DateRangeFilter>
          </div>

          <Text size='l' className={styles.sec_title}>ソート条件</Text>

          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>合計金額</Text>
              <Pulldown name='total_amount' value={params.sort.total_amount} onChange={handleSort} >
                  <option value={''}>未設定</option>
                  <option value={'desc'}>降順</option>
                  <option value={'asc'}>昇順</option>
              </Pulldown>
          </div>
          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>購入日</Text>
              <Pulldown name='created_at' value={params.sort.created_at} onChange={handleSort} > 
                  <option value={''}>未設定</option>
                  <option value={'desc'}>降順</option>
                  <option value={'asc'}>昇順</option>
              </Pulldown>
          </div>
          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>配達希望日</Text>
              <Pulldown name='delivery_date' value={params.sort.delivery_date} onChange={handleSort} >
                  <option value={''}>未設定</option>
                  <option value={'desc'}>降順</option>
                  <option value={'asc'}>昇順</option>
              </Pulldown>
          </div>
          <div>
              <Text className={styles.mb_8}>ステータス更新日</Text>
              <Pulldown name='updated_at' value={params.sort.updated_at} onChange={handleSort} >
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

export default OrderSidebar;