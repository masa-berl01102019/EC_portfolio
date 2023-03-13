import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../atoms/Image/Image';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import { useTranslation } from 'react-i18next';

const ItemCard = memo(({
  item,
  className = '',
  ...props
}) => {

  const { t } = useTranslation();

  return (
    <div className={className} {...props}>
      <Link to={`/items/${item.id}`} className={styles.link_fill}>
        <div className={[styles.img_box, styles.mb_8].join(' ')}>
          <Image src={item.top_image} alt="item image" className={styles.top_item_img} />
        </div>
        <Text size='s' className={[styles.mb_4, styles.card_text, styles.font_bold].join(' ')}>{item.brand_name}</Text>
        <Text className={[styles.mb_4, styles.card_text].join(' ')}>{item.item_name}</Text>
        <Text className={[styles.card_text].join(' ')}>{item.included_tax_price_text} ({t('user.tax-including')})</Text>
      </Link>
    </div>
  );

});

export default ItemCard;