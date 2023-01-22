import React, {Suspense, useEffect, useState} from 'react';
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js';
import {Editor} from "react-draft-wysiwyg";
import {stateFromHTML} from 'draft-js-import-html';
import {useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import useObjectForm from "../../../hooks/useObjectForm";
import useHelper from "../../../hooks/useHelper";
import Heading from '../../../atoms/Heading/Heading';
import Button from '../../../atoms/Button/Button';
import FormSelectbox from '../../../molecules/Form/FormSelectbox';
import FormInputText from '../../../molecules/Form/FormInputText';
import Text from '../../../atoms/Text/Text';
import CheckboxTag from '../../../atoms/CheckboxTag/CheckboxTag';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import InputImage from '../../../atoms/InputImage/InputImage';
import useValidation from '../../../hooks/useValidation';
import { useTranslation } from 'react-i18next';

// TODO: Add preview fuction

function BlogEdit(props) {

    const baseUrl = `/api/admin/blogs/${props.match.params.id}/edit`;
    const model = 'BLOG';
    const {data, errorMessage, createData} = useFetchApiData(baseUrl, model)
    const {blog, brands, gender_categories, tags, items} = data;
    const [formData, {handleFormData, setFormData, handleFormCheckbox, handleFormFile}] = useForm(blog);
    const {valid, setValid, validation, errorObject} = useValidation(formData, 'admin', 'blog_edit');
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const {isJson} = useHelper();
    const {handleSendObjectForm} = useObjectForm(formData, setFormData, createData);
    const history = useHistory();
    const openAdminMenu = useRecoilValue(menuAdminState);
    const { t } = useTranslation();

    useEffect(() => {
        if(blog) {
            // Convert the body of news which is stored as JSON into contentState * Judge if it's HTML or JSON because demo data is stored as HTML
            const contentState = isJson(blog.body) ? convertFromRaw(JSON.parse(blog.body)) : stateFromHTML(blog.body);
            // Convert contentState into editorState
            const editorState = EditorState.createWithContent(contentState);
            // Set editorState to draft.js
            setEditorState(editorState);
        }
    },[]);

    const onEditorStateChange = (editorState) => {
        // Get contentState from editorState
        const contentState = editorState.getCurrentContent();
        // ContentState has to be store as JSON because some of styles don't be stored correctly if it's stored after converting HTML
        const content = JSON.stringify(convertToRaw(contentState));
        // Store contect variable to formData
        setFormData({
            ...formData,
            body : content
        });
        // Update editorState
        setEditorState(editorState);
    };

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>{t('admin.blog.edit-title')}</Heading>
                    <div className={styles.form_area}>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            if(validation.fails()) {
                                setValid(true);
                                return false;
                            }
                            handleSendObjectForm(
                                `/api/admin/blogs/${props.match.params.id}`, 
                                () => history.push('/admin/blogs')
                            );
                        }}>
                            <div className={[styles.flex, styles.mb_24, styles.flex_tb].join(' ')}>
                                <div className={styles.blog_area}>
                                    <FormInputText
                                        name={'title'}
                                        onChange={handleFormData}
                                        value={formData.title}
                                        label={t('admin.blog.title')}
                                        error={errorMessage}
                                        validation={validation}
                                        valid={valid}
                                        placeholder={t('admin.blog.title-ex')}
                                        className={styles.mb_16}
                                    />
                                    <div className={styles.flex_1}>
                                        <Text className={styles.mb_8}>{t('admin.blog.body')}</Text>
                                        <div className={styles.edit_area}>
                                            <Editor
                                                editorState={editorState}
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                onEditorStateChange={onEditorStateChange}
                                            />
                                        </div>
                                        { valid && validation.fails() && validation.errors.first('body') && 
                                            <Text size='s' role='error' className={[styles.mt_8, styles.front_validation].join(' ')} >
                                                {validation.errors.first('body')}
                                            </Text> 
                                        }
                                        { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.body}</Text> }
                                    </div>
                                </div>
                                <div className={styles.sidebar_box}>
                                    <div className={styles.sidebar_card}>
                                        <div className={styles.title_box}>
                                            <Text size='l'>{t('admin.set-published-status')}</Text>
                                        </div>
                                        <div className={styles.pa_16}>
                                            <FormSelectbox
                                                name='is_published'
                                                value={formData.is_published}
                                                onChange={handleFormData}
                                                error={errorMessage}
                                                validation={validation}
                                                valid={valid}
                                            >
                                                <option value={0}>{t('admin.unpublished')}</option>
                                                <option value={1}>{t('admin.published')}</option>
                                            </FormSelectbox>
                                        </div>
                                    </div>
                                    <div className={styles.sidebar_card}>
                                        <div className={styles.title_box}>
                                            <Text size='l'>{t('admin.blog.thumbnail')}</Text>
                                        </div>
                                        <div className={styles.pa_16}>
                                            <InputImage
                                                src={formData.thumbnail}
                                                name="thumbnail"
                                                onChange={e => handleFormFile(e)}
                                            />
                                            { valid && validation.fails() && validation.errors.first('thumbnail') && 
                                                <Text size='s' role='error' className={[styles.mt_8, styles.front_validation].join(' ')} >
                                                    {validation.errors.first('thumbnail')}
                                                </Text> 
                                            }
                                            { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.file}</Text> }
                                            { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.thumbnail}</Text> }
                                        </div>
                                    </div>
                                    <div className={styles.sidebar_card}>
                                        <div className={styles.title_box}>
                                            <Text size='l'>{t('admin.blog.category')}</Text>
                                        </div>
                                        <div className={styles.pa_16}>
                                            <FormSelectbox
                                                name='brand_id'
                                                value={formData.brand_id}
                                                onChange={handleFormData}
                                                label={t('admin.blog.brand-category')}
                                                error={errorMessage}
                                                validation={validation}
                                                valid={valid}
                                                className={styles.mb_16}
                                            >
                                                <option value={''}>{t('admin.not-set')}</option>
                                                { brands && brands.map( brand => ( <option key={brand.id} value={brand.id}>{brand.brand_name}</option>))}
                                            </FormSelectbox>
                                            <FormSelectbox
                                                name='category_id'
                                                value={formData.category_id}
                                                onChange={handleFormData}
                                                label={t('admin.blog.gender-category')}
                                                error={errorMessage}
                                                validation={validation}
                                                valid={valid}
                                            >
                                                <option value={''}>{t('admin.not-set')}</option>
                                                { gender_categories && gender_categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option> )}
                                            </FormSelectbox>
                                        </div>
                                    </div>
                                    <div className={styles.sidebar_card}>
                                        <div className={styles.title_box}>
                                            <Text size='l'>{t('admin.blog.related-item')}</Text>
                                        </div>
                                        <div className={styles.pa_16}>
                                            <div className={styles.scroll_area}>
                                            {   items &&
                                                items.map((item) =>
                                                    <div key={item.id} className={[styles.block, styles.mb_4].join(' ')}>
                                                        <CheckboxTag
                                                            name='items_id' 
                                                            value={item.id} 
                                                            onChange={handleFormCheckbox} 
                                                            checked={formData.items_id.includes(item.id)} 
                                                            label={item.product_number}
                                                        />
                                                    </div>
                                                )
                                            }
                                            </div>
                                            { valid && validation.fails() && errorObject && 
                                                Object.entries(errorObject).map(([key, value]) => {
                                                    if(key.includes('items_id')) {
                                                        return (
                                                            <div key={key}>
                                                                <Text size='s' role='error' className={[styles.mt_8, styles.front_validation].join(' ')} >
                                                                    {value}
                                                                </Text> 
                                                            </div>
                                                        )
                                                    }
                                                }) 
                                            }
                                            { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.items_id}</Text> }
                                        </div>
                                    </div>
                                    <div className={styles.sidebar_card}>
                                        <div className={styles.title_box}>
                                            <Text size='l'>{t('admin.blog.related-tag')}</Text>
                                        </div>
                                        <div className={styles.pa_16}>
                                            <div className={styles.scroll_area}>
                                            {   tags &&
                                                tags.map((tag) =>
                                                <div key={tag.id} className={[styles.block, styles.mb_4].join(' ')}>
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
                                            { valid && validation.fails() && errorObject && 
                                                Object.entries(errorObject).map(([key, value]) => {
                                                    if(key.includes('tags_id')) {
                                                        return (
                                                            <div key={key}>
                                                                <Text size='s' role='error' className={[styles.mt_8, styles.front_validation].join(' ')} >
                                                                    {value}
                                                                </Text> 
                                                            </div>
                                                        )
                                                    }
                                                }) 
                                            }
                                            { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.tags_id}</Text> }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={[styles.flex, styles.align_center, styles.justify_center].join(' ')}>
                                <LinkBtn to={`/admin/blogs`} size='l' className={styles.mr_12} style={{'width': '100%'}}>{t('admin.back-btn')}</LinkBtn>
                                <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>{t('admin.update')}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default BlogEdit;