import React, {memo} from 'react';
import { useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import useCreateParams from '../../../hooks/useCreateParams';
import Pulldown from '../../../atoms/Pullldown/Pulldown';
import Text from '../../../atoms/Text/Text';
import DateRangeFilter from '../../../molecules/DateRangeFilter/DateRangeFilter';
import styles from './styles.module.css';
import Button from '../../../atoms/Button/Button';
import useI18next from '../../../context/I18nextContext';
import InputText from '../../../atoms/InputText/InputText';

const OrderSidebar = ({model, onClick}) => {

    const params = useRecoilValue(paramState(model));
    const{handleFilter, handleSort} = useCreateParams(model);
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
                  placeholder={i18next.t('admin.order.keyword-ex')}
                  className={styles.w_100}
              />
          </div>
          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('admin.order.payment-method')}</Text>
            <Pulldown name='payment_method' value={params.filter.payment_method} onChange={handleFilter} defaultOption={i18next.t('admin.not-set')}> 
                <option value={'0'}>{i18next.t('admin.order.payment-credit')}</option>
                <option value={'1'}>{i18next.t('admin.order.payment-cache')}</option>
            </Pulldown>
          </div>
          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('admin.order.payment-status')}</Text>
            <Pulldown name='is_paid' value={params.filter.is_paid} onChange={handleFilter} defaultOption={i18next.t('admin.not-set')}> 
                <option value={'0'}>{i18next.t('admin.order.not-paid')}</option>
                <option value={'1'}>{i18next.t('admin.order.paid')}</option>
            </Pulldown>
          </div>
          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('admin.order.delivery-status')}</Text>
            <Pulldown name='is_shipped' value={params.filter.is_shipped} onChange={handleFilter} defaultOption={i18next.t('admin.not-set')}>
                <option value={'0'}>{i18next.t('admin.order.not-delivered')}</option>
                <option value={'1'}>{i18next.t('admin.order.delivered')}</option>
            </Pulldown>
          </div>
          <div className={styles.mb_32}>
              <DateRangeFilter params={params.filter} model={model}>
                <option value={'created_at'}>{i18next.t('admin.order.purchase-date')}</option>
                <option value={'delivery_date'}>{i18next.t('admin.order.preferred-delivery-day')}</option>
                <option value={'updated_at'}>{i18next.t('admin.updated-date')}</option>
              </DateRangeFilter>
          </div>

          <Text size='l' className={styles.sec_title}>{i18next.t('admin.sort')}</Text>

          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>{i18next.t('admin.order.purchase-amount')}</Text>
              <Pulldown name='total_amount' value={params.sort.total_amount} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}>
                  <option value={'desc'}>{i18next.t('admin.desc-num')}</option>
                  <option value={'asc'}>{i18next.t('admin.asc-num')}</option>
              </Pulldown>
          </div>
          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>{i18next.t('admin.order.purchase-date')}</Text>
              <Pulldown name='created_at' value={params.sort.created_at} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}> 
                  <option value={'desc'}>{i18next.t('admin.desc-date')}</option>
                  <option value={'asc'}>{i18next.t('admin.asc-date')}</option>
              </Pulldown>
          </div>
          <div className={styles.mb_16}>
              <Text className={styles.mb_8}>{i18next.t('admin.order.preferred-delivery-day')}</Text>
              <Pulldown name='delivery_date' value={params.sort.delivery_date} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}>
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

export default OrderSidebar;