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

const BrandFilter = memo(({
  brands,
  params = [],
  onChange,
  className = '',
  ...props
}) => {

  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className={className} {...props}>
      <Text className={styles.mb_8}>{t('admin.blog.brand')}</Text>
      <Accordion tabName={t('admin.blog.brand-ex')}>
        <InputText
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder={t('admin.brand.brand-ex')}
          className={styles.mb_8}
        />
        <ScrollWrapper>
          {brands?.filter(list => (searchInput && list.brand_name.startsWith(searchInput)) || searchInput === '').map((brand) =>
            <FormInputCheckbox
              key={brand.id}
              name='brand'
              value={brand.id}
              onChange={onChange}
              checked={params.includes(brand.id)}
              label={brand.brand_name}
              className={styles.ma_4}
            />
          )}
        </ScrollWrapper>
      </Accordion>
      {params.length > 0 &&
        <FlexWrapper>
          {brands?.filter(list => params.includes(list.id)).map((brand) =>
            <CheckboxTag
              key={brand.id}
              name='brand'
              value={brand.id}
              onChange={onChange}
              checked={params.includes(brand.id)}
              label={brand.brand_name}
              className={styles.ma_4}
            />
          )}
        </FlexWrapper>
      }
    </div>
  );

});

export default BrandFilter;