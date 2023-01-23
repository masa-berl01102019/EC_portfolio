import React, {memo} from 'react';
import { useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import useCreateParams from '../../../hooks/useCreateParams';
import Pulldown from '../../../atoms/Pullldown/Pulldown';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import Mask from '../../../atoms/Mask/Mask';
import Button from '../../../atoms/Button/Button';
import { useTranslation } from 'react-i18next';

const ItemSortModal = ({
        onClick,
        model
    }) => {

    const params = useRecoilValue(paramState(model));
    const {handleSort} = useCreateParams(model);
    const { t } = useTranslation();

    return (
      <Mask>
        <div className={styles.container}>

          <Text size='l' className={[styles.mb_24, styles.text_center].join(' ')}>{t('user.set-sort')}</Text>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{t('user.item.price')}</Text>
            <Pulldown name='price' value={params.sort.price} onChange={handleSort} defaultOption={t('user.not-set')}>
                <option value={'desc'}>{t('user.desc-num')}</option>
                <option value={'asc'}>{t('user.asc-num')}</option>
            </Pulldown>
          </div>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{t('user.posted-date')}</Text>
            <Pulldown name='posted_at' value={params.sort.posted_at} onChange={handleSort} defaultOption={t('user.not-set')}>
                <option value={'desc'}>{t('user.desc-date')}</option>
                <option value={'asc'}>{t('user.asc-date')}</option>
            </Pulldown>
          </div>

          <Button className={styles.close_btn} onClick={onClick}>{t('user.close-btn')}</Button>

        </div>
      </Mask>
    );

};

export default ItemSortModal;