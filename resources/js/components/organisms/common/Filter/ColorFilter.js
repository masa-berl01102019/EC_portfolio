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

const ColorFilter = memo(({
  colors,
  params = [],
  onChange,
  className = '',
  ...props
}) => {

  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className={className} {...props}>
      <Text className={styles.mb_8}>{t('admin.item.color')}</Text>
      <Accordion tabName={t('admin.item.color-ex')}>
        <InputText
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder={t('admin.item.color-ex')}
          className={styles.mb_8}
        />
        <ScrollWrapper>
          {colors?.filter(list => (searchInput && list.color_name.startsWith(searchInput)) || searchInput === '').map((color) =>
            <FormInputCheckbox
              key={color.id}
              name='color'
              value={color.id}
              onChange={onChange}
              checked={params.includes(color.id)}
              label={color.color_name}
              className={styles.ma_4}
            />
          )}
        </ScrollWrapper>
      </Accordion>
      {params.length > 0 &&
        <FlexWrapper>
          {colors?.filter(list => params.includes(list.id)).map((color) =>
            <CheckboxTag
              key={color.id}
              name='color'
              value={color.id}
              onChange={onChange}
              checked={params.includes(color.id)}
              label={color.color_name}
              className={styles.ma_4}
            />
          )}
        </FlexWrapper>
      }
    </div>
  );

});

export default ColorFilter;