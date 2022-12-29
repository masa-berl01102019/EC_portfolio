import React, {memo} from 'react';
import { useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import useCreateParams from '../../../hooks/useCreateParams';
import Pulldown from '../../../atoms/Pullldown/Pulldown';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import Mask from '../../../atoms/Mask/Mask';
import Button from '../../../atoms/Button/Button';
import useI18next from '../../../context/I18nextContext';

const BookmarkSortModal = ({
        onClick,
        model
    }) => {

    const params = useRecoilValue(paramState(model));
    const {handleSort} = useCreateParams(model);
    const i18next = useI18next();

    return (
      <Mask>
        <div className={styles.container}>

          <Text size='l' className={[styles.mb_24, styles.text_center].join(' ')}>{i18next.t('user.set-sort')}</Text>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('user.bookmark.item-name')}</Text>
            <Pulldown name='item_name' value={params.sort.item_name} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}>
                <option value={'desc'}>{i18next.t('user.desc-alpha')}</option>
                <option value={'asc'}>{i18next.t('user.asc-alpha')}</option>
            </Pulldown>
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{i18next.t('user.bookmark.price')}</Text>
            <Pulldown name='price' value={params.sort.price} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}>
                <option value={'desc'}>{i18next.t('user.desc-num')}</option>
                <option value={'asc'}>{i18next.t('user.asc-num')}</option>
            </Pulldown>
          </div>

          <div>
            <Text className={styles.mb_8}>{i18next.t('user.bookmark.register-date')}</Text>
            <Pulldown name='updated_at' value={params.sort.updated_at} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}>
                <option value={'desc'}>{i18next.t('user.desc-date')}</option>
                <option value={'asc'}>{i18next.t('user.asc-date')}</option>
            </Pulldown>
          </div>

          <Button className={styles.close_btn} onClick={onClick}>{i18next.t('user.close-btn')}</Button>
          
        </div>
      </Mask>
    );

};

export default BookmarkSortModal;