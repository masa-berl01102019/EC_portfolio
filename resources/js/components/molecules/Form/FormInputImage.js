import React, { memo } from 'react';
import Image from '../../atoms/Image/Image';
import InputImage from '../../atoms/InputImage/InputImage';
import styles from './styles.module.css';

const FormInputImage = ({
  src,
  name,
  type,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <label>
      <Image src={src} type={type} className={[styles.insert_img, className].join(' ')} {...props} />
      <InputImage
        name={name}
        onChange={onChange}
        className={styles.hidden}
      />
    </label>
  );
};

export default FormInputImage;