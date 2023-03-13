import React, { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Text from '../../../atoms/Text/Text';
import InputCheckbox from '../../../atoms/InputCheckbox/InputCheckbox';
import FormInputText from '../../../molecules/Form/FormInputText';
import FormInputRadio from '../../../molecules/Form/FormInputRadio';
import FormDatePicker from '../../../molecules/Form/FormDatePicker';
import ValidationMsg from '../../../molecules/ErrorMessage/ValidationMsg';
import styles from './styles.module.css';
import { CONST } from '../../../constants/constants';

const UserForm = memo(({
  formData,
  handleFormData,
  handleFormDate,
  valid,
  validation,
  errorMessage,
  isEdit
}) => {

  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div>
      <Text className={styles.mb_8}>{t('admin.user.name')}</Text>
      <div className={[styles.flex, styles.mb_16].join(' ')}>
        <FormInputText
          name={'last_name'}
          onChange={handleFormData}
          value={formData.last_name}
          error={errorMessage}
          validation={validation}
          valid={valid}
          placeholder={t('admin.user.last-name-ex')}
          className={[styles.mr_24, styles.flex_basis_50].join(' ')}
        />
        <FormInputText
          name={'first_name'}
          onChange={handleFormData}
          value={formData.first_name}
          error={errorMessage}
          validation={validation}
          valid={valid}
          placeholder={t('admin.user.first-name-ex')}
          className={styles.flex_basis_50}
        />
      </div>
      <Text className={styles.mb_8}>{t('admin.user.name-kana')}</Text>
      <div className={[styles.flex, styles.mb_16].join(' ')}>
        <FormInputText
          name={'last_name_kana'}
          onChange={handleFormData}
          value={formData.last_name_kana}
          error={errorMessage}
          validation={validation}
          valid={valid}
          placeholder={t('admin.user.last-name-kana-ex')}
          className={[styles.mr_24, styles.flex_basis_50].join(' ')}
        />
        <FormInputText
          name={'first_name_kana'}
          onChange={handleFormData}
          value={formData.first_name_kana}
          error={errorMessage}
          validation={validation}
          valid={valid}
          placeholder={t('admin.user.first-name-kana-ex')}
          className={styles.flex_basis_50}
        />
      </div>
      <Text className={styles.mb_8}>{t('admin.user.gender')}</Text>
      <div className={styles.mb_16}>
        <div className={[styles.flex, styles.flex_wrap].join(' ')}>
          <FormInputRadio
            name='gender'
            value={CONST.GENDER.MAN}
            onChange={handleFormData}
            checked={formData.gender == CONST.GENDER.MAN}
            label={t('admin.user.gender-man')}
            className={[styles.mr_8, styles.mb_8].join(' ')}
            error={errorMessage}
          />
          <FormInputRadio
            name='gender'
            value={CONST.GENDER.WOMAN}
            onChange={handleFormData}
            checked={formData.gender == CONST.GENDER.WOMAN}
            label={t('admin.user.gender-woman')}
            className={[styles.mr_8, styles.mb_8].join(' ')}
            error={errorMessage}
          />
          <FormInputRadio
            name='gender'
            value={CONST.GENDER.OTHERS}
            onChange={handleFormData}
            checked={formData.gender == CONST.GENDER.OTHERS}
            label={t('admin.user.gender-other')}
            className={[styles.mr_8, styles.mb_8].join(' ')}
            error={errorMessage}
          />
          <FormInputRadio
            name='gender'
            value={CONST.GENDER.NO_ANSWER}
            onChange={handleFormData}
            checked={formData.gender == CONST.GENDER.NO_ANSWER}
            label={t('admin.user.gender-no-reply')}
            className={styles.mb_8}
            error={errorMessage}
          />
        </div>
        <ValidationMsg errKey={'gender'} valid={valid} validation={validation} />
        {errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.gender}</Text>}
      </div>
      <FormDatePicker
        name={'birthday'}
        value={formData.birthday}
        onChange={handleFormDate}
        label={t('admin.user.birthday')}
        className={styles.mb_16}
        error={errorMessage}
        validation={validation}
        valid={valid}
      />
      <FormInputText
        name={'post_code'}
        type={'number'}
        onChange={handleFormData}
        value={formData.post_code}
        label={t('admin.user.postcode')}
        error={errorMessage}
        validation={validation}
        valid={valid}
        placeholder={t('admin.user.postcode-ex')}
        className={styles.mb_16}
      />
      <FormInputText
        name={'prefecture'}
        onChange={handleFormData}
        value={formData.prefecture}
        label={t('admin.user.prefecture')}
        error={errorMessage}
        validation={validation}
        valid={valid}
        placeholder={t('admin.user.prefecture-ex')}
        className={styles.mb_16}
      />
      <FormInputText
        name={'municipality'}
        onChange={handleFormData}
        value={formData.municipality}
        label={t('admin.user.municipality')}
        error={errorMessage}
        validation={validation}
        valid={valid}
        placeholder={t('admin.user.municipality-ex')}
        className={styles.mb_16}
      />
      <FormInputText
        name={'street_name'}
        onChange={handleFormData}
        value={formData.street_name}
        label={t('admin.user.street-name')}
        error={errorMessage}
        validation={validation}
        valid={valid}
        placeholder={t('admin.user.street-name-ex')}
        className={styles.mb_16}
      />
      <FormInputText
        name={'street_number'}
        onChange={handleFormData}
        value={formData.street_number}
        label={t('admin.user.street-number')}
        error={errorMessage}
        validation={validation}
        valid={valid}
        placeholder={t('admin.user.street-number-ex')}
        className={styles.mb_16}
      />
      <FormInputText
        name={'building'}
        onChange={handleFormData}
        value={formData.building}
        label={t('admin.user.building')}
        error={errorMessage}
        validation={validation}
        valid={valid}
        placeholder={t('admin.user.building-ex')}
        className={styles.mb_16}
      />
      <label className={styles.delivery_address_check}>
        <InputCheckbox onChange={() => { setOpen(!open) }} checked={open} />
        <Text className={[styles.ml_8, styles.text_nowrap].join(' ')}>{t('admin.user.set-other-delivery-address')}</Text>
      </label>
      <div className={open ? styles.block : styles.hidden}>
        <FormInputText
          name={'delivery_post_code'}
          type={'number'}
          onChange={handleFormData}
          value={formData.delivery_post_code}
          label={t('admin.user.postcode')}
          error={errorMessage}
          validation={validation}
          valid={valid}
          placeholder={t('admin.user.postcode-ex')}
          className={styles.mb_16}
        />
        <FormInputText
          name={'delivery_prefecture'}
          onChange={handleFormData}
          value={formData.delivery_prefecture}
          label={t('admin.user.prefecture')}
          error={errorMessage}
          validation={validation}
          valid={valid}
          placeholder={t('admin.user.prefecture-ex')}
          className={styles.mb_16}
        />
        <FormInputText
          name={'delivery_municipality'}
          onChange={handleFormData}
          value={formData.delivery_municipality}
          label={t('admin.user.municipality')}
          error={errorMessage}
          validation={validation}
          valid={valid}
          placeholder={t('admin.user.municipality-ex')}
          className={styles.mb_16}
        />
        <FormInputText
          name={'delivery_street_name'}
          onChange={handleFormData}
          value={formData.delivery_street_name}
          label={t('admin.user.street-name')}
          error={errorMessage}
          validation={validation}
          valid={valid}
          placeholder={t('admin.user.street-name-ex')}
          className={styles.mb_16}
        />
        <FormInputText
          name={'delivery_street_number'}
          onChange={handleFormData}
          value={formData.delivery_street_number}
          label={t('admin.user.street-number')}
          error={errorMessage}
          validation={validation}
          valid={valid}
          placeholder={t('admin.user.street-number-ex')}
          className={styles.mb_16}
        />
        <FormInputText
          name={'delivery_building'}
          onChange={handleFormData}
          value={formData.delivery_building}
          label={t('admin.user.building')}
          error={errorMessage}
          validation={validation}
          valid={valid}
          placeholder={t('admin.user.building-ex')}
          className={styles.mb_16}
        />
      </div>
      <FormInputText
        name={'tel'}
        type='tel'
        onChange={handleFormData}
        value={formData.tel}
        label={t('admin.user.tel')}
        error={errorMessage}
        validation={validation}
        valid={valid}
        placeholder={t('admin.user.tel-ex')}
        className={styles.mb_16}
      />
      <FormInputText
        name={'email'}
        type={'email'}
        onChange={handleFormData}
        value={formData.email}
        label={t('admin.user.email')}
        error={errorMessage}
        validation={validation}
        valid={valid}
        placeholder={t('admin.user.email-ex')}
        className={styles.mb_16}
      />
      {!isEdit &&
        <FormInputText
          name={'password'}
          type={'password'}
          onChange={handleFormData}
          value={formData.password}
          label={t('admin.user.password')}
          error={errorMessage}
          validation={validation}
          valid={valid}
          placeholder={t('admin.user.password-ex')}
          className={styles.mb_16}
        />
      }
      <Text className={styles.mb_8}>{t('admin.user.dm-register')}</Text>
      <div className={styles.mb_40}>
        <div className={styles.flex}>
          <FormInputRadio
            name='is_received'
            value={CONST.IS_RECEIVED.REGISTERED}
            onChange={handleFormData}
            checked={formData.is_received == CONST.IS_RECEIVED.REGISTERED}
            label={t('admin.register')}
            error={errorMessage}
          />
          <FormInputRadio
            name='is_received'
            value={CONST.IS_RECEIVED.NOT_REGISTERED}
            onChange={handleFormData}
            checked={formData.is_received == CONST.IS_RECEIVED.NOT_REGISTERED}
            label={t('admin.not-register')}
            className={styles.ml_32}
            error={errorMessage}
          />
        </div>
        <ValidationMsg errKey={'is_received'} valid={valid} validation={validation} />
        {errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.is_received}</Text>}
      </div>
    </div>
  );
});

export default UserForm;