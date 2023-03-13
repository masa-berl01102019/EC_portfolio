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

const TagFilter = memo(({
  tags,
  name = 'tag',
  labelDisplay = true,
  params = [],
  onChange,
  className = '',
  ...props
}) => {

  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className={className} {...props}>
      {labelDisplay && <Text className={styles.mb_8}>{t('admin.blog.related-tag')}</Text>}
      <Accordion tabName={t('admin.blog.related-tag-ex')}>
        <InputText
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder={t('admin.blog.related-tag-ex')}
          className={styles.mb_8}
        />
        <ScrollWrapper>
          {tags?.filter(list => (searchInput && list.tag_name.startsWith(searchInput)) || searchInput === '').map((tag) =>
            <FormInputCheckbox
              key={tag.id}
              name={name}
              value={tag.id}
              onChange={onChange}
              checked={params.includes(tag.id)}
              label={tag.tag_name}
              className={styles.ma_4}
            />
          )}
        </ScrollWrapper>
      </Accordion>
      {params.length > 0 &&
        <FlexWrapper>
          {tags?.filter(list => params.includes(list.id)).map((tag) =>
            <CheckboxTag
              key={tag.id}
              name={name}
              value={tag.id}
              onChange={onChange}
              checked={params.includes(tag.id)}
              label={tag.tag_name}
              className={styles.ma_4}
            />
          )}
        </FlexWrapper>
      }
    </div>
  );

});

export default TagFilter;