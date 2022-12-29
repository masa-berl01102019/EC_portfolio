import React, {Suspense, useState} from 'react';
import {EditorState, convertToRaw} from 'draft-js';
import {Editor} from "react-draft-wysiwyg";
import {useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import useObjectForm from "../../../hooks/useObjectForm";
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
import useI18next from '../../../context/I18nextContext';

function NewsCreate() {

    const baseUrl = '/api/admin/news/create';
    const model = 'NEWS';
    const {data, errorMessage, createData} = useFetchApiData(baseUrl, model);
    const [formData, {handleFormData, setFormData, handleFormCheckbox, handleFormFile}] = useForm({
        'title': '',
        'body': '',
        'brand_id': '',
        'category_id': '',
        'tags_id': [],
        'is_published': 0, // 0: 非公開 1: 公開中
        'thumbnail': '/img/no_image.png'
    });
    const {valid, setValid, validation, errorObject} = useValidation(formData, 'admin', 'news_create');
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const {handleSendObjectForm} = useObjectForm(formData, setFormData, createData);
    const history = useHistory();
    const {brands, gender_categories, tags, items} = data;
    const openAdminMenu = useRecoilValue(menuAdminState);
    const i18next = useI18next();


    const onEditorStateChange = (editorState) => {
        // 現在のeditorStateからcontentStateを取得 
        const contentState = editorState.getCurrentContent();
        // HTMLに変換して保存すると一部のスタイルが消えてしまうのでcontentStateをJSON形式で保存
        const content = JSON.stringify(convertToRaw(contentState));
        // formDataのbodyに保存
        setFormData({
            ...formData,
            body : content
        });
        // editorStateを更新
        setEditorState(editorState);
    };

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>{i18next.t('admin.news.create-title')}</Heading>
                    <div className={styles.form_area}>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            if(validation.fails()) {
                                setValid(true);
                                return false;
                            }
                            handleSendObjectForm(
                                '/api/admin/news',
                                () => history.push('/admin/news')
                            );
                        }}>
                            <div className={[styles.flex, styles.mb_24, styles.flex_tb].join(' ')}>
                                <div className={[styles.blog_area, styles.flex_1].join(' ')}>
                                    <FormInputText
                                        name={'title'}
                                        onChange={handleFormData}
                                        value={formData.title}
                                        label={i18next.t('admin.news.title')}
                                        error={errorMessage}
                                        validation={validation}
                                        valid={valid}
                                        placeholder={i18next.t('admin.news.title-ex')}
                                        className={styles.mb_16}
                                    />
                                    <div className={styles.flex_1}>
                                        <Text className={styles.mb_8}>{i18next.t('admin.news.body')}</Text>
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
                                            <Text size='l'>{i18next.t('admin.published-status')}</Text>
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
                                                <option value={0}>{i18next.t('admin.unpublished')}</option>
                                                <option value={1}>{i18next.t('admin.published')}</option>
                                            </FormSelectbox>
                                        </div>
                                    </div>
                                    <div className={styles.sidebar_card}>
                                        <div className={styles.title_box}>
                                            <Text size='l'>{i18next.t('admin.news.thumbnail')}</Text>
                                        </div>
                                        <div className={styles.pa_16}>
                                            <InputImage
                                                src={formData.thumbnail}
                                                name="thumbnail"
                                                onChange={e => handleFormFile(e)}
                                            />
                                            { valid && validation.fails() && validation.errors.first('file') && 
                                                <div>
                                                    <Text size='s' role='error' className={[styles.mt_8, styles.front_validation].join(' ')} >
                                                        {validation.errors.first('file')}
                                                    </Text> 
                                                </div>
                                            }
                                            { valid && validation.fails() && validation.errors.first('thumbnail') && 
                                                <div>
                                                    <Text size='s' role='error' className={[styles.mt_8, styles.front_validation].join(' ')} >
                                                        {validation.errors.first('thumbnail')}
                                                    </Text> 
                                                </div>
                                            }
                                            { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.file}</Text> }
                                            { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.thumbnail}</Text> }
                                        </div>
                                    </div>
                                    <div className={styles.sidebar_card}>
                                        <div className={styles.title_box}>
                                            <Text size='l'>{i18next.t('admin.news.category')}</Text>
                                        </div>
                                        <div className={styles.pa_16}>
                                            <FormSelectbox
                                                name='brand_id'
                                                value={formData.brand_id}
                                                onChange={handleFormData}
                                                label={i18next.t('admin.news.brand-category')}
                                                error={errorMessage}
                                                validation={validation}
                                                valid={valid}
                                                className={styles.mb_16}
                                            >
                                                <option value={''}>{i18next.t('admin.not-set')}</option>
                                                { brands && brands.map( brand => ( <option key={brand.id} value={brand.id}>{brand.brand_name}</option>))}
                                            </FormSelectbox>
                                            <FormSelectbox
                                                name='category_id'
                                                value={formData.category_id}
                                                onChange={handleFormData}
                                                label={i18next.t('admin.blog.gender-category')}
                                                error={errorMessage}
                                                validation={validation}
                                                valid={valid}
                                            >
                                                <option value={''}>{i18next.t('admin.not-set')}</option>
                                                { gender_categories && gender_categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option> )}
                                            </FormSelectbox>
                                        </div>
                                    </div>
                                    <div className={styles.sidebar_card}>
                                        <div className={styles.title_box}>
                                            <Text size='l'>{i18next.t('admin.news.related-tag')}</Text>
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
                                <LinkBtn to={`/admin/news`} size='l' className={styles.mr_12} style={{'width': '100%'}}>{i18next.t('admin.back-btn')}</LinkBtn>
                                <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>{i18next.t('admin.register')}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default NewsCreate;