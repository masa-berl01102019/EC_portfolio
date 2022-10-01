import React, {memo} from 'react';
import { useRecoilValue } from 'recoil';
import { paramState } from '../../../store/paramState';
import useCreateParams from '../../../hooks/useCreateParams';
import Pulldown from '../../../atoms/Pullldown/Pulldown';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import Mask from '../../../atoms/Mask/Mask';
import Button from '../../../atoms/Button/Button';

const BlogSortModal = ({
        onClick,
        model
    }) => {

    // グローバルステート呼び出し
    const params = useRecoilValue(paramState(model));
    // URLパラメータ変更のフックの呼び出し
    const {handleSort} = useCreateParams(model);

    return (
      <Mask>
        <div className={styles.container}>

          <Text size='l' className={[styles.mb_24, styles.text_center].join(' ')}>並び替え設定</Text>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>投稿日</Text>
            <Pulldown name='posted_at' value={params.sort.posted_at} onChange={handleSort}>
                <option value={''}>未設定</option>
                <option value={'desc'}>降順</option>
                <option value={'asc'}>昇順</option>
            </Pulldown>
          </div>

          <Button className={styles.close_btn} onClick={onClick}>閉じる</Button>

        </div>
      </Mask>
    );

};

export default BlogSortModal;