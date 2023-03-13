import React, { memo } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';

const AddressField = memo(({
  user,
  isConfirmed,
  className,
  ...props
}) => {

  const { t } = useTranslation();

  return (
    <fieldset className={[styles.field_area, className].join(' ')} {...props}>
      <legend className={styles.flex}>
        <Text role='title' className={styles.filed_title}>{t('user.cart.delivery-place')}</Text>
        {!isConfirmed && <Text className={styles.pr_8}>(　<Link to={`/users/edit`}>{t('user.edit-link')}</Link>　)</Text>}
      </legend>
      <Text className={styles.mb_8}>{user.delivery_post_code_text ? user.delivery_post_code_text : user.post_code_text}</Text>
      <Text className={styles.mb_8}>{user.full_delivery_address ? user.full_delivery_address : user.full_address}</Text>
      <Text className={styles.mb_8}>{user.tel}</Text>
      <Text>{user.full_name}</Text>
    </fieldset>
  );

});

export default AddressField;