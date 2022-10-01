import React, {memo} from 'react';
import {Link} from 'react-router-dom';
import Image from '../../atoms/Image/Image';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const TopItemCard = ({
    src,
    to, 
    brand_name, 
    item_name, 
    price, 
    className = '',
    ...props
  }) => {

  return (
    <div className={className} {...props}>
        <Link to={to} className={styles.link_fill}>
            <Image src={src} alt="商品画像" className={[styles.top_item_img, styles.mb_8].join(' ')} />
            <Text size='s' className={[styles.mb_4, styles.card_text, styles.font_bold].join(' ')}>{brand_name}</Text>
            <Text className={[styles.mb_4, styles.card_text].join(' ')}>{item_name}</Text>
            <Text className={[styles.card_text].join(' ')}>{price} (税込)</Text>
        </Link>
    </div>
  );

};

export default TopItemCard;