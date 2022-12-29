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

const BlogSortModal = ({
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
            <Text className={styles.mb_8}>{i18next.t('user.posted-date')}</Text>
            <Pulldown name='posted_at' value={params.sort.posted_at} onChange={handleSort} defaultOption={i18next.t('admin.not-set')}>
                <option value={'desc'}>{i18next.t('user.desc-date')}</option>
                <option value={'asc'}>{i18next.t('user.asc-date')}</option>
            </Pulldown>
          </div>

          <Button className={styles.close_btn} onClick={onClick}>{i18next.t('user.close-btn')}</Button>

        </div>
      </Mask>
    );

};

export default BlogSortModal;