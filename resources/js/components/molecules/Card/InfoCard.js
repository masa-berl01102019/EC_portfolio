import React, {memo} from 'react';
import {Link} from 'react-router-dom';
import Image from '../../atoms/Image/Image';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import Icon from '../../atoms/Icon/Icon';

const InfoCard = ({
    src,
    to, 
    title, 
    brand_name, 
    posted_at,
    modified_at, 
    className = '',
    ...props
  }) => {

  return (
    <div className={styles.info_card} {...props}>
        <Link to={to} className={[styles.link_fill, styles.flex].join(' ')}>
            <div className={[styles.mr_8, styles.img_contents].join(' ')}>
              <Image src={src} type='info_list' alt="サムネイル画像" className={styles.info_img} />
            </div>
            <div className={[styles.text_contents].join(' ')}>
              <Text size='l' className={[styles.mb_8, styles.card_text].join(' ')}>{title}</Text>
              <Text className={[styles.mb_8, styles.card_text].join(' ')}>{brand_name}</Text>
              <Text className={[styles.card_text].join(' ')}>{modified_at ? modified_at : posted_at}</Text>
            </div>
            <Icon src={'/img/arrow_right_icon.svg'} className={styles.icon} />
        </Link>
    </div>
  );

};

export default InfoCard;