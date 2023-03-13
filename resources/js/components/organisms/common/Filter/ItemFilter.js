import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CheckboxTag from '../../../atoms/CheckboxTag/CheckboxTag';
import FlexWrapper from '../../../atoms/layout/FlexWrapper';
import ScrollWrapper from '../../../atoms/layout/ScrollWrapper';
import FormInputCheckbox from '../../../molecules/Form/FormInputCheckbox';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import InputText from '../../../atoms/InputText/InputText';
import Accordion from '../../../molecules/Accordion/Accordion';

const ItemFilter = memo(({
  items,
  name = 'item',
  params = [],
  labelDisplay = true,
  onChange,
  className = '',
  ...props
}) => {

  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className={className} {...props}>
      {labelDisplay && <Text className={styles.mb_8}>{t('admin.blog.related-item')}</Text>}
      <Accordion tabName={t('admin.blog.related-item-ex')}>
        <InputText
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder={t('admin.blog.related-item-ex')}
          className={styles.mb_8}
        />
        <ScrollWrapper>
          {items?.filter(list => (searchInput && list.product_number.startsWith(searchInput)) || searchInput === '').map((item) =>
            <FormInputCheckbox
              key={item.id}
              name={name}
              value={item.id}
              onChange={onChange}
              checked={params.includes(item.id)}
              label={item.product_number}
              className={styles.ma_4}
            />
          )}
        </ScrollWrapper>
      </Accordion>
      {params.length > 0 &&
        <FlexWrapper>
          {items?.filter(list => params.includes(list.id)).map((item) =>
            <CheckboxTag
              key={item.id}
              name={name}
              value={item.id}
              onChange={onChange}
              checked={params.includes(item.id)}
              label={item.product_number}
              className={styles.ma_4}
            />
          )}
        </FlexWrapper>
      }
    </div>
  );

});

export default ItemFilter;