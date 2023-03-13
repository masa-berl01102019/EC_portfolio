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

const SizeFilter = memo(({
  sizes,
  params = [],
  onChange,
  className = '',
  ...props
}) => {

  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className={className} {...props}>
      <Text className={styles.mb_8}>{t('admin.item.size')}</Text>
      <Accordion tabName={t('admin.item.size-ex')}>
        <InputText
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder={t('admin.item.size-ex')}
          className={styles.mb_8}
        />
        <ScrollWrapper>
          {sizes?.filter(list => (searchInput && list.size_name.startsWith(searchInput)) || searchInput === '').map((size) =>
            <FormInputCheckbox
              key={size.id}
              name='size'
              value={size.id}
              onChange={onChange}
              checked={params.includes(size.id)}
              label={size.size_name}
              className={styles.ma_4}
            />
          )}
        </ScrollWrapper>
      </Accordion>
      {params.length > 0 &&
        <FlexWrapper>
          {sizes?.filter(list => params.includes(list.id)).map((size) =>
            <CheckboxTag
              key={size.id}
              name='size'
              value={size.id}
              onChange={onChange}
              checked={params.includes(size.id)}
              label={size.size_name}
              className={styles.ma_4}
            />
          )}
        </FlexWrapper>
      }
    </div>
  );

});

export default SizeFilter;