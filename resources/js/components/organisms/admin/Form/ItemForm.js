import React, { memo } from 'react';
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import useForm from "../../../hooks/useForm";
import useHelper from '../../../hooks/useHelper';
import useObjectForm from "../../../hooks/useObjectForm";
import useValidation from '../../../hooks/useValidation';
import useNotify from '../../../context/NotifyContext';
import Text from '../../../atoms/Text/Text';
import Badge from '../../../atoms/Badge/Badge';
import Button from '../../../atoms/Button/Button';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import CheckboxTag from '../../../atoms/CheckboxTag/CheckboxTag';
import FormSelectbox from '../../../molecules/Form/FormSelectbox';
import FormInputText from '../../../molecules/Form/FormInputText';
import FormInputTextarea from '../../../molecules/Form/FormInputTextarea';
import ValidationMsg from '../../../molecules/ErrorMessage/ValidationMsg';
import ItemSkuTable from '../../../organisms/admin/Table/ItemSkuTable';
import ItemImageTable from '../../../organisms/admin/Table/ItemImageTable';
import ItemMeasurementTable from '../../../organisms/admin/Table/ItemMeasurementTable';
import styles from './styles.module.css';
import { CONST } from '../../../constants/constants';

const ItemForm = memo(({
  data,
  mutation,
  serverErrorMsg,
  targetId = null,
  isEdit,
  className = '',
  ...props
}) => {

  const intialFormData = {
    'product_number': '',
    'item_name': '',
    'price': '',
    'cost': '',
    'made_in': '',
    'mixture_ratio': '',
    'description': '',
    'is_published': CONST.IS_PUBLISHED.NOT_PUBLISHED,
    'brand_id': '',
    'gender_category': '',
    'main_category': '',
    'sub_category': '',
    'tags_id': [],
    'skus': [{ color_id: '', size_id: '', quantity: '' }],
    'images': [{ image: '', image_category: '', color_id: '' }],
    'measurements': [{ size_id: '', width: '', shoulder_width: '', raglan_sleeve_length: '', sleeve_length: '', length: '', waist: '', hip: '', rise: '', inseam: '', thigh_width: '', outseam: '', sk_length: '', hem_width: '', weight: '' }]
  }
  const { item, brands, gender_categories, main_categories, sub_categories, sizes, colors, tags } = data;
  const [formData, { setFormData, handleFormData, handleFormCheckbox, handleFormCategory }] = useForm(isEdit ? item : intialFormData);
  const { valid, setValid, validation, errorObject } = useValidation(formData, 'admin', isEdit ? 'item_edit' : 'item_create');
  const { handleSendObjectForm, handleInsertObjectForm, handleDeleteObjectForm, handleChangeObjectForm } = useObjectForm(formData, setFormData, mutation);
  const requestUrl = isEdit ? `/api/admin/items/${targetId}` : '/api/admin/items';
  const { isDuplicated } = useHelper();
  const history = useHistory();
  const alert = useNotify();
  const { t } = useTranslation();

  const handleFormSubmit = () => {
    if (validation.fails()) {
      setValid(true);
      return false;
    }
    const skus_size = formData.skus.map(item => item.size_id);
    const skus_color = formData.skus.map(item => item.color_id);
    const measurements_size = formData.measurements.map(item => item.size_id);
    const images_color = formData.images.map(item => item.color_id);
    const images_category = formData.images.map(item => item.image_category);
    const arr = formData.skus.map(item => {
      const { size_id, color_id } = item;
      return JSON.stringify({ size: size_id, color: color_id });
    });
    if (isDuplicated(arr)) {
      alert({ body: t('admin.item.alert-msg1'), type: 'alert' });
      return false;
    }
    if (isDuplicated(measurements_size)) {
      alert({ body: t('admin.item.alert-msg2'), type: 'alert' });
      return false;
    }
    if (skus_size.filter(el => !measurements_size.includes(el)).length > 0 || measurements_size.filter(el => !skus_size.includes(el)).length > 0) {
      alert({ body: t('admin.item.alert-msg3'), type: 'alert' });
      return false;
    }
    if (skus_color.filter(el => !images_color.includes(el)).length > 0 || images_color.filter(el => !skus_color.includes(el)).length > 0) {
      alert({ body: t('admin.item.alert-msg4'), type: 'alert' });
      return false;
    }
    if (!images_category.includes(CONST.IMAGE_CATEGORY.MAIN)) {
      alert({ body: t('admin.item.alert-msg5'), type: 'alert' });
      return false;
    }
    handleSendObjectForm(
      requestUrl,
      () => history.push('/admin/items')
    );
  }

  return (
    <div className={[styles.form_area, className].join(' ')} {...props}>
      <div className={styles.mb_32}>
        <ItemTitleHeader badge_num='1' text={t('admin.item.basic-info')} />
        <div className={[styles.flex, styles.flex_tb].join(' ')}>
          <div className={[styles.flex_basis_50, styles.mr_24, styles.mb_16_tb].join(' ')}>
            <FormInputText
              name={'product_number'}
              onChange={handleFormData}
              value={formData.product_number}
              label={t('admin.item.product-number')}
              error={serverErrorMsg}
              validation={validation}
              valid={valid}
              placeholder={t('admin.item.product-number-ex')}
              className={styles.mb_16}
            />
            <FormInputText
              name={'item_name'}
              onChange={handleFormData}
              value={formData.item_name}
              label={t('admin.item.item-name')}
              error={serverErrorMsg}
              validation={validation}
              valid={valid}
              placeholder={t('admin.item.item-name-ex')}
              className={styles.mb_16}
            />
            <FormInputText
              name={'price'}
              type={'number'}
              onChange={handleFormData}
              value={formData.price}
              label={t('admin.item.price')}
              error={serverErrorMsg}
              validation={validation}
              valid={valid}
              placeholder={t('admin.item.price-ex')}
              className={styles.mb_16}
            />
            <FormInputText
              name={'cost'}
              type={'number'}
              onChange={handleFormData}
              value={formData.cost}
              label={t('admin.item.cost')}
              error={serverErrorMsg}
              validation={validation}
              valid={valid}
              placeholder={t('admin.item.cost-ex')}
              className={styles.mb_16}
            />
            <div className={styles.cost_rate}>
              <Text>{t('admin.item.cost-rate')}</Text>
              <Text>
                {formData.cost && formData.price &&
                  Math.floor(formData.cost / formData.price * 10000) / 100
                }%
              </Text>
            </div>
            <FormInputText
              name={'made_in'}
              onChange={handleFormData}
              value={formData.made_in}
              label={t('admin.item.made-in')}
              error={serverErrorMsg}
              validation={validation}
              valid={valid}
              placeholder={t('admin.item.made-in-ex')}
            />
          </div>
          <div className={styles.flex_basis_50}>
            <FormInputTextarea
              name={'mixture_ratio'}
              value={formData.mixture_ratio}
              label={t('admin.item.mixture-ratio')}
              onChange={handleFormData}
              placeholder={t('admin.item.mixture-ratio-ex')}
              error={serverErrorMsg}
              validation={validation}
              valid={valid}
              className={styles.mb_16}
              style={{ 'minHeight': '148px' }}
            />
            <FormInputTextarea
              name={'description'}
              value={formData.description}
              label={t('admin.item.description')}
              onChange={handleFormData}
              placeholder={t('admin.item.description-ex')}
              error={serverErrorMsg}
              validation={validation}
              valid={valid}
              style={{ 'minHeight': '148px' }}
            />
          </div>
        </div>
      </div>

      <div className={[styles.flex, styles.mb_32, styles.flex_tb].join(' ')}>
        <div className={[styles.flex_basis_50, styles.mr_24, styles.mb_16_tb].join(' ')}>
          <ItemTitleHeader badge_num='2' text={t('admin.item.category')} />
          <FormSelectbox
            name='brand_id'
            value={formData.brand_id}
            onChange={handleFormData}
            label={t('admin.item.brand')}
            error={serverErrorMsg}
            validation={validation}
            valid={valid}
            className={styles.mb_16}
          >
            <option value={''}>{t('admin.not-set')}</option>
            {brands && brands.map(brand => (<option key={brand.id} value={brand.id}>{brand.brand_name}</option>))}
          </FormSelectbox>
          <FormSelectbox
            name='gender_category'
            value={formData.gender_category}
            onChange={handleFormCategory}
            label={t('admin.item.gender')}
            error={serverErrorMsg}
            validation={validation}
            valid={valid}
            className={styles.mb_16}
          >
            <option value={''}>{t('admin.not-set')}</option>
            {gender_categories && gender_categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option>)}
          </FormSelectbox>
          <FormSelectbox
            name='main_category'
            value={formData.main_category}
            onChange={handleFormCategory}
            label={t('admin.item.main')}
            error={serverErrorMsg}
            validation={validation}
            valid={valid}
            className={styles.mb_16}
          >
            <option value={''}>{t('admin.not-set')}</option>
            {main_categories && main_categories.filter((category) => Number(formData.gender_category) === category.parent_id).map((category) => (
              <option key={category.id} value={category.id}>{category.category_name}</option>
            ))}
          </FormSelectbox>
          <FormSelectbox
            name='sub_category'
            value={formData.sub_category}
            onChange={handleFormCategory}
            label={t('admin.item.sub')}
            error={serverErrorMsg}
            validation={validation}
            valid={valid}
          >
            <option value={''}>{t('admin.not-set')}</option>
            {sub_categories && sub_categories.filter((category) => Number(formData.main_category) === category.parent_id).map((category) => (
              <option key={category.id} value={category.id}>{category.category_name}</option>
            ))}
          </FormSelectbox>
        </div>
        <div className={styles.flex_basis_50}>
          <ItemTitleHeader badge_num='3' text={t('admin.item.tag')} />
          <div>
            <div className={styles.tag_area}>
              {tags &&
                tags.map((tag) =>
                  <div key={tag.id} className={[styles.inline_block, styles.mr_8, styles.mb_8].join(' ')}>
                    <CheckboxTag
                      name='tags_id'
                      value={tag.id}
                      onChange={handleFormCheckbox}
                      checked={formData.tags_id.includes(tag.id)}
                      label={tag.tag_name}
                    />
                  </div>
                )
              }
            </div>
            <ValidationMsg errKey={'tags_id'} valid={valid} errorObject={errorObject} />
            {serverErrorMsg && <Text role='error' size='s' className={styles.mt_8}>{serverErrorMsg.tags_id}</Text>}
          </div>
        </div>
      </div>

      <div className={styles.mb_32}>
        <ItemTitleHeader badge_num='4' text={t('admin.item.sku')} />
        <div className={styles.mb_16}>
          <div className={styles.scroll_x}>
            <ItemSkuTable
              skus={formData.skus}
              colors={colors}
              sizes={sizes}
              deleteMethod={handleDeleteObjectForm}
              handleFormMethod={handleChangeObjectForm}
            />
          </div>
          <ValidationMsg errKey={'skus'} valid={valid} errorObject={errorObject} />
          {serverErrorMsg && serverErrorMsg.skus &&
            Object.values(serverErrorMsg.skus).map((value, index) => {
              return <Text role='error' size='s' key={index} className={styles.mt_8}>{value}</Text>
            })
          }
        </div>
        <Button
          onClick={() => handleInsertObjectForm('skus', ['item_id'])}
          className={[styles.block, styles.ml_auto].join(' ')}
        >
          {t('admin.item.add-form')}
        </Button>
      </div>

      <div className={styles.mb_32}>
        <ItemTitleHeader badge_num='5' text={t('admin.item.image')} />
        <div className={styles.mb_16}>
          <div className={styles.scroll_x}>
            <ItemImageTable
              images={formData.images}
              colors={colors}
              deleteMethod={handleDeleteObjectForm}
              handleFormMethod={handleChangeObjectForm}
            />
          </div>
          <ValidationMsg errKey={'images'} valid={valid} errorObject={errorObject} />
          {serverErrorMsg && serverErrorMsg.images &&
            Object.values(serverErrorMsg.images).map((value, index) => {
              return <Text role='error' size='s' key={index} className={styles.mt_8}>{value}</Text>
            })
          }
        </div>
        <Button
          onClick={() => handleInsertObjectForm('images', ['item_id'])}
          className={[styles.block, styles.ml_auto].join(' ')}
        >
          {t('admin.item.add-form')}
        </Button>
      </div>

      <div className={styles.mb_32}>
        <ItemTitleHeader badge_num='6' text={t('admin.item.measurement')} />
        <div className={styles.mb_16}>
          <div className={styles.scroll_x}>
            <ItemMeasurementTable
              measurements={formData.measurements}
              sizes={sizes}
              deleteMethod={handleDeleteObjectForm}
              handleFormMethod={handleChangeObjectForm}
            />
          </div>
          <ValidationMsg errKey={'measurements'} valid={valid} errorObject={errorObject} />
          {serverErrorMsg && serverErrorMsg.measurements &&
            Object.values(serverErrorMsg.measurements).map((value, index) => {
              return <Text role='error' size='s' key={index} className={styles.mt_8}>{value}</Text>
            })
          }
        </div>
        <Button
          onClick={() => handleInsertObjectForm('measurements', ['item_id'])}
          className={[styles.block, styles.ml_auto].join(' ')}
        >
          {t('admin.item.add-form')}
        </Button>
      </div>

      <FormSelectbox
        name='is_published'
        value={formData.is_published}
        onChange={handleFormData}
        label={t('admin.set-published-status')}
        error={serverErrorMsg}
        validation={validation}
        valid={valid}
        className={styles.mb_40}
      >
        <option value={CONST.IS_PUBLISHED.NOT_PUBLISHED}>{t('admin.unpublished')}</option>
        <option value={CONST.IS_PUBLISHED.PUBLISHED}>{t('admin.published')}</option>
      </FormSelectbox>

      <div className={[styles.flex, styles.justify_center].join(' ')}>
        <LinkBtn to={`/admin/items`} size='l' className={styles.mr_12} style={{ 'width': '100%' }}>
          {t('admin.back-btn')}
        </LinkBtn>
        <Button size='l' color='primary' onClick={handleFormSubmit} className={[styles.ml_12, styles.w_100].join(' ')}>
          {isEdit ? t('admin.update') : t('admin.register')}
        </Button>
      </div>
    </div>
  );
});

const ItemTitleHeader = ({ badge_num, text }) => {
  return (
    <div className={[styles.flex, styles.align_center, styles.mb_16].join(' ')}>
      <Badge text={badge_num} type={'number'} className={styles.mr_8} />
      <Heading tag={'h2'} tag_style={'h2'} className={styles.item_heading}>{text}</Heading>
      <div className={styles.heading_border}></div>
    </div>
  )
}

export default ItemForm;