import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import useForm from "../../../hooks/useForm";
import useObjectForm from "../../../hooks/useObjectForm";
import useValidation from '../../../hooks/useValidation';
import Text from '../../../atoms/Text/Text';
import Button from '../../../atoms/Button/Button';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import MediaEditor from '../../../molecules/Editor/MediaEditor';
import FormSelectbox from '../../../molecules/Form/FormSelectbox';
import FormInputText from '../../../molecules/Form/FormInputText';
import FormInputImage from '../../../molecules/Form/FormInputImage';
import ValidationMsg from '../../../molecules/ErrorMessage/ValidationMsg';
import TagFilter from '../../common/Filter/TagFilter';
import styles from './styles.module.css';
import { CONST } from '../../../constants/constants';

const NewsForm = memo(({
  data,
  mutation,
  serverErrorMsg,
  targetId = null,
  isEdit,
  className = '',
  ...props
}) => {

  const intialFormData = {
    'title': '',
    'body': '',
    'brand_id': '',
    'category_id': '',
    'tags_id': [],
    'is_published': CONST.IS_PUBLISHED.NOT_PUBLISHED,
    'thumbnail': '/img/no_image.png'
  }
  const { news, brands, gender_categories, tags } = data;
  const [formData, { handleFormData, setFormData, handleFormCheckbox, handleFormFile }] = useForm(isEdit ? news : intialFormData);
  const { valid, setValid, validation, errorObject } = useValidation(formData, 'admin', isEdit ? 'news_edit' : 'news_create');
  const requestUrl = isEdit ? `/api/admin/news/${targetId}` : `/api/admin/news`;
  const { handleSendObjectForm } = useObjectForm(formData, setFormData, mutation);
  const history = useHistory();
  const { t } = useTranslation();

  const handleFormSubmit = e => {
    e.preventDefault();
    if (validation.fails()) {
      setValid(true);
      return false;
    }
    handleSendObjectForm(
      requestUrl,
      () => history.push('/admin/news')
    );
  }

  return (
    <div className={[styles.form_area, className].join(' ')}>
      <form onSubmit={handleFormSubmit} {...props}>
        <div className={[styles.flex, styles.mb_40, styles.flex_tb].join(' ')}>
          <FormInputText
            name={'title'}
            onChange={handleFormData}
            value={formData.title}
            label={t('admin.news.title')}
            error={serverErrorMsg}
            validation={validation}
            valid={valid}
            placeholder={t('admin.news.title-ex')}
            className={styles.mb_16}
          />
          <Text className={styles.mb_8}>{t('admin.news.body')}</Text>
          <MediaEditor
            initialValue={isEdit ? news.body : formData.body}
            onChange={content => setFormData({ ...formData, body: content })}
            className={styles.edit_area}
          />
          <ValidationMsg errKey={'body'} valid={valid} validation={validation} />
          {serverErrorMsg && <Text role='error' size='s' className={styles.mt_8}>{serverErrorMsg.body}</Text>}
          <div className={styles.sidebar_box}>
            <div className={[styles.sidebar_card, styles.mb_24].join(' ')}>
              <div className={styles.title_box}>
                <Text size='l'>{t('admin.set-published-status')}</Text>
              </div>
              <div className={styles.pa_16}>
                <FormSelectbox
                  name='is_published'
                  value={formData.is_published}
                  onChange={handleFormData}
                  error={serverErrorMsg}
                  validation={validation}
                  valid={valid}
                >
                  <option value={CONST.IS_PUBLISHED.NOT_PUBLISHED}>{t('admin.unpublished')}</option>
                  <option value={CONST.IS_PUBLISHED.PUBLISHED}>{t('admin.published')}</option>
                </FormSelectbox>
              </div>
            </div>
            <div className={[styles.sidebar_card, styles.mb_24].join(' ')}>
              <div className={styles.title_box}>
                <Text size='l'>{t('admin.news.thumbnail')}</Text>
              </div>
              <div className={styles.pa_16}>
                <FormInputImage
                  src={formData.thumbnail}
                  name="thumbnail"
                  type="blog_news"
                  onChange={e => handleFormFile(e)}
                  className={styles.blog_news_img}
                />
                <ValidationMsg errKey={'file'} valid={valid} validation={validation} />
                <ValidationMsg errKey={'thumbnail'} valid={valid} validation={validation} />
                {serverErrorMsg && <Text role='error' size='s' className={styles.mt_8}>{serverErrorMsg.file}</Text>}
                {serverErrorMsg && <Text role='error' size='s' className={styles.mt_8}>{serverErrorMsg.thumbnail}</Text>}
              </div>
            </div>
            <div className={[styles.sidebar_card, styles.mb_24].join(' ')}>
              <div className={styles.title_box}>
                <Text size='l'>{t('admin.news.category')}</Text>
              </div>
              <div className={styles.pa_16}>
                <FormSelectbox
                  name='brand_id'
                  value={formData.brand_id}
                  onChange={handleFormData}
                  label={t('admin.news.brand-category')}
                  error={serverErrorMsg}
                  validation={validation}
                  valid={valid}
                  className={styles.mb_16}
                >
                  <option value={''}>{t('admin.not-set')}</option>
                  {brands && brands.map(brand => (<option key={brand.id} value={brand.id}>{brand.brand_name}</option>))}
                </FormSelectbox>
                <FormSelectbox
                  name='category_id'
                  value={formData.category_id}
                  onChange={handleFormData}
                  label={t('admin.blog.gender-category')}
                  error={serverErrorMsg}
                  validation={validation}
                  valid={valid}
                >
                  <option value={''}>{t('admin.not-set')}</option>
                  {gender_categories && gender_categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option>)}
                </FormSelectbox>
              </div>
            </div>
            <div className={styles.sidebar_card}>
              <div className={styles.title_box}>
                <Text size='l'>{t('admin.news.related-tag')}</Text>
              </div>
              <div className={styles.pa_16}>
                <TagFilter
                  tags={tags}
                  name='tags_id'
                  labelDisplay={false}
                  params={formData.tags_id}
                  onChange={handleFormCheckbox}
                />
                <ValidationMsg errKey={'tags_id'} valid={valid} errorObject={errorObject} />
                {serverErrorMsg && <Text role='error' size='s' className={styles.mt_8}>{serverErrorMsg.tags_id}</Text>}
              </div>
            </div>
          </div>
        </div>
        <div className={[styles.flex, styles.align_center, styles.justify_center].join(' ')}>
          <LinkBtn to={`/admin/news`} size='l' className={styles.mr_12} style={{ 'width': '100%' }}>
            {t('admin.back-btn')}
          </LinkBtn>
          <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>
            {isEdit ? t('admin.update') : t('admin.register')}
          </Button>
        </div>
      </form>
    </div>
  );
});

export default NewsForm;