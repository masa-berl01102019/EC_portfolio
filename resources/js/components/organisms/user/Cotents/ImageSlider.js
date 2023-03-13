import React, { memo, useState, useEffect } from 'react';
import Icon from '../../../atoms/Icon/Icon';
import Image from '../../../atoms/Image/Image';
import styles from './styles.module.css';

const ImageSlider = memo(({ images = [], topImage, className, ...props }) => {

  const [pickedIndex, setPickedIndex] = useState(0);

  const imgArray = images.map(list => list.image);

  useEffect(() => {
    if (imgArray) {
      imgArray.map((img, key) => {
        if (img === topImage) {
          setPickedIndex(key);
        }
      })
    }
  }, [topImage]);

  const handleChangeImage = (num) => {
    if (pickedIndex + num > imgArray.length - 1) {
      setPickedIndex(0)
    } else if (pickedIndex + num < 0) {
      setPickedIndex(imgArray.length - 1)
    } else {
      setPickedIndex(pickedIndex + num)
    }
  }

  return (
    <div className={[styles.item_img_area, className].join(' ')} {...props}>
      <div className={styles.flame}>
        <Image src={imgArray[pickedIndex]} alt="item image" className={styles.item_top_img} />
        <Icon src={'/img/circle_left_icon.svg'} className={styles.left_icon} onClick={() => handleChangeImage(-1)} />
        <Icon src={'/img/circle_right_icon.svg'} className={styles.right_icon} onClick={() => handleChangeImage(1)} />
      </div>
      <div className={styles.item_thumbnail_area}>
        {imgArray.map((img, index) =>
          <Image
            key={index}
            src={img ? img : '/img/no_image.png'}
            alt="item image"
            style={{ 'width': '16%' }}
            onClick={() => {
              setPickedIndex(index);
            }}
            className={index === pickedIndex ? styles.focus : ''}
          />
        )}
      </div>
    </div >
  );
});

export default ImageSlider;