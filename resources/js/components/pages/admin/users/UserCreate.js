import React, {Suspense, useState} from 'react';
import {useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import FormInputText from '../../../molecules/Form/FormInputText';
import Button from '../../../atoms/Button/Button';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import Heading from '../../../atoms/Heading/Heading';
import InputCheckbox from '../../../atoms/InputCheckbox/InputCheckbox';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import FormInputRadio from '../../../molecules/Form/FormInputRadio';
import FormDatePicker from '../../../molecules/Form/FormDatePicker';
import useValidation from '../../../hooks/useValidation';
import { useTranslation } from 'react-i18next';

function UserCreate() {

    const baseUrl = '/api/admin/users/create';
    const model = 'USER';
    const {data, errorMessage, createData} = useFetchApiData(baseUrl, model);
    const [open, setOpen] = useState(false);
    const [formData, {handleFormData, handleFormDate}] = useForm({
        'last_name': null,
        'first_name': null,
        'last_name_kana': null,
        'first_name_kana': null,
        'gender': null, // 0:man 1:woman 2:others 3:no answer
        'birthday': null,
        'post_code': null,
        'prefecture': null,
        'municipality': null,
        'street_name': null,
        'street_number': null,
        'building': null,
        'delivery_post_code': null,
        'delivery_prefecture': null,
        'delivery_municipality': null,
        'delivery_street_name': null,
        'delivery_street_number': null,
        'delivery_building': null,
        'tel': null,
        'email': null,
        'password': null,
        'is_received': null, // 0: not register 1: register
    });
    const {valid, setValid, validation} = useValidation(formData, 'admin', 'user_create');
    const history = useHistory();
    const openAdminMenu = useRecoilValue(menuAdminState);
    const { t } = useTranslation();

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>{t('admin.user.create-title')}</Heading>
                    <div className={styles.form_area}>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            if(validation.fails()) {
                                setValid(true);
                            } else {
                                createData({ 
                                    form: formData, 
                                    url:'/api/admin/users',
                                    callback: () => history.push('/admin/users')
                                });
                            }
                        }}>
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
                                        value={0} 
                                        onChange={handleFormData}
                                        checked={formData.gender == 0}
                                        label={t('admin.user.gender-man')}
                                        className={[styles.mr_8, styles.mb_8].join(' ')}
                                        error={errorMessage}
                                    />
                                    <FormInputRadio
                                        name='gender' 
                                        value={1} 
                                        onChange={handleFormData}
                                        checked={formData.gender == 1}
                                        label={t('admin.user.gender-woman')}
                                        className={[styles.mr_8, styles.mb_8].join(' ')}
                                        error={errorMessage}
                                    />
                                    <FormInputRadio
                                        name='gender' 
                                        value={2} 
                                        onChange={handleFormData}
                                        checked={formData.gender == 2}
                                        label={t('admin.user.gender-other')}
                                        className={[styles.mr_8, styles.mb_8].join(' ')}
                                        error={errorMessage}
                                    />
                                    <FormInputRadio
                                        name='gender' 
                                        value={3} 
                                        onChange={handleFormData}
                                        checked={formData.gender == 3}
                                        label={t('admin.user.gender-no-reply')}
                                        className={styles.mb_8}
                                        error={errorMessage}
                                    />
                                </div>
                                { (valid && validation.fails() && validation.errors.first('gender')) && 
                                    <Text size='s' role='error' className={[styles.mt_8, styles.front_validation].join(' ')} >
                                        {validation.errors.first('gender')}
                                    </Text> 
                                }
                                { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.gender}</Text> }
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
                                <InputCheckbox onChange={() => { setOpen(!open)}} checked={open} />
                                <Text className={[styles.ml_8, styles.text_nowrap].join(' ')}>{t('admin.user.set-other-delivery-address')}</Text>
                            </label>
                            <div className={open? styles.block : styles.hidden}>
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
                            <Text className={styles.mb_8}>{t('admin.user.dm-register')}</Text>
                            <div className={styles.mb_40}>
                                <div className={styles.flex}>
                                    <FormInputRadio
                                        name='is_received' 
                                        value={1} 
                                        onChange={handleFormData}
                                        checked={formData.is_received == 1}
                                        label={t('admin.register')}
                                        error={errorMessage}
                                    />
                                    <FormInputRadio
                                        name='is_received' 
                                        value={0} 
                                        onChange={handleFormData}
                                        checked={formData.is_received == 0}
                                        label={t('admin.not-register')}
                                        className={styles.ml_32}
                                        error={errorMessage}
                                    />
                                </div>
                                { (valid && validation.fails() && validation.errors.first('is_received')) && 
                                    <Text size='s' role='error' className={[styles.mt_8, styles.front_validation].join(' ')} >
                                        {validation.errors.first('is_received')}
                                    </Text> 
                                }
                                { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.is_received}</Text> }
                            </div>
                            <div className={[styles.flex, styles.justify_center].join(' ')}>
                                <LinkBtn to={`/admin/users`} size='l' className={styles.mr_12} style={{'width': '100%'}}>{t('admin.back-btn')}</LinkBtn>
                                <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>{t('admin.register')}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default UserCreate;