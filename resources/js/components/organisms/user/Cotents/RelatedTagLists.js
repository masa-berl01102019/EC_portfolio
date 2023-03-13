import React, { memo } from 'react';
import FlexWrapper from '../../../atoms/layout/FlexWrapper';
import styles from './styles.module.css';
import { useHistory } from 'react-router-dom';
import CheckboxTag from '../../../atoms/CheckboxTag/CheckboxTag'


const RelatedTagLists = memo(({ tags = [], to, filterMethod, className, ...props }) => {

  const history = useHistory();

  return (
    <FlexWrapper className={className} {...props}>
      {tags.map((tag) =>
        <CheckboxTag
          key={tag.id}
          name='tag'
          value={tag.id}
          onChange={e => {
            filterMethod(e);
            history.push(to);
          }}
          checked={true}
          label={'#' + tag.tag_name}
          className={styles.ma_4}
        />
      )}
    </FlexWrapper>
  );
});

export default RelatedTagLists;