import React, { memo } from 'react';
import Text from "../../../atoms/Text/Text";
import { useHistory } from 'react-router-dom';
import styles from './styles.module.css';
import FlexWrapper from '../../../atoms/layout/FlexWrapper';

const Breadcrumbs = memo(({ brand, gender, main, sub, to, filterMethod, className, ...props }) => {

  const history = useHistory();

  return (
    <FlexWrapper className={className} {...props}>
      {brand &&
        <Text
          role='primary'
          className={styles.text_nowrap}
          onClick={() => {
            filterMethod('brand', brand.id);
            history.push(to);
          }}
        >
          {brand.brand_name}
        </Text>
      }
      {gender &&
        <>
          <Text role='primary' className={styles.text_nowrap}>&gt;</Text>
          <Text
            role='primary'
            className={styles.text_nowrap}
            onClick={() => {
              filterMethod('gender_category', brand.id, gender.id);
              history.push(to);
            }}
          >
            {gender.category_name}
          </Text>
        </>
      }
      {main &&
        <>
          <Text role='primary' className={styles.text_nowrap}>&gt;</Text>
          <Text
            role='primary'
            className={styles.text_nowrap}
            onClick={() => {
              filterMethod('main_category', brand.id, gender.id, main.id);
              history.push(to);
            }}
          >
            {main.category_name}
          </Text>
        </>
      }
      {sub &&
        <>
          <Text role='primary' className={styles.text_nowrap}>&gt;</Text>
          <Text
            role='primary'
            className={styles.text_nowrap}
            onClick={() => {
              filterMethod('sub_category', brand.id, gender.id, main.id, sub.id);
              history.push(to);
            }}
          >
            {sub.category_name}
          </Text>
        </>
      }
    </FlexWrapper>
  );
});

export default Breadcrumbs;