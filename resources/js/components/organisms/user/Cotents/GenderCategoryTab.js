import React, { memo } from 'react';
import { CONST } from '../../../constants/constants';
import RadioBoxTab from '../../../molecules/RadioBoxTab/RadioBoxTab';
import styles from './styles.module.css';

const GenderCategoryTab = memo(({ genderCategory, onChange, className, ...props }) => {
  return (
    <div className={[styles.flex, className].join(' ')} {...props}>
      <RadioBoxTab
        name="gender_category"
        value={undefined}
        onChange={onChange}
        checked={genderCategory == undefined}
        label={"ALL"}
        style={{ "flex": "1" }}
      />
      <RadioBoxTab
        name="gender_category"
        value={CONST.GENDER_CATEGORY.MEN}
        onChange={onChange}
        checked={genderCategory == CONST.GENDER_CATEGORY.MEN}
        label={"MENS"}
        style={{ "flex": "1" }}
      />
      <RadioBoxTab
        name="gender_category"
        value={CONST.GENDER_CATEGORY.WOMEN}
        onChange={onChange}
        checked={genderCategory == CONST.GENDER_CATEGORY.WOMEN}
        label={"WOMEN"}
        style={{ "flex": "1" }}
      />
    </div>
  );
});

export default GenderCategoryTab;