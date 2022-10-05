import React, {Suspense, useEffect, useState} from 'react';
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js';
import {Editor} from "react-draft-wysiwyg";
import {stateFromHTML} from 'draft-js-import-html';
import {useHistory} from "react-router-dom";
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
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

// TODO ブログ本文で保存された画像をどうするか考える

function BlogEdit(props) {
    // urlの設定
    const baseUrl = `/api/admin/blogs/${props.match.params.id}/edit`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'BLOG';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData} = useFetchApiData2(baseUrl, model)
    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData, setFormData, handleFormCheckbox, handleFormFile}] = useForm({
        'title': '',
        'body': '',
        'brand_id': '',
        'category_id': '',
        'items_id': [],
        'tags_id': [],
        'is_published': 0, // 0: 非公開 1: 公開中
        'thumbnail': '/img/no_image.png'
    });
    // draft-js用のステート管理
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    // 便利関数の呼び出し
    const {isJson} = useHelper();
    // file送信用にフォームのラッパー関数呼び出し
    const {handleSendObjectForm} = useObjectForm(formData, setFormData, createData);
    // リダイレクト用の関数呼び出し
    const history = useHistory();
    // API接続の返却値を変数に格納
    const blog = data.blog;
    const brands = data.brands? data.brands: null;
    const gender_categories = data.gender_categories? data.gender_categories: null;
    const tags = data.tags? data.tags: null;
    const items = data.items? data.items: null;
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);

    useEffect(() => {
        // 非同期で通信されるので初回読み込み時にblogが入ってこない場合があるので条件分岐してあげる
        if(blog) {
            // フォームのデフォルト値を設定するためにsetFormDataで値をセット
            setFormData({...blog});
            // blogの本文はJSONで保存されてるのでcontentStateに変換 * デモデータはHTMLで保存されてるのでJSONか判定して違ったらHTMLをcontentStateに変換
            const contentState = isJson(blog.body) ? convertFromRaw(JSON.parse(blog.body)) : stateFromHTML(blog.body);
            // contentStateをeditorStateに変換
            const editorState = EditorState.createWithContent(contentState);
            // editorStateをdraft.jsにセット
            setEditorState(editorState);
        }
    },[]);

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
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text className={styles.http_error}>{errorMessage.httpRequestError}</Text>
                ) : (
                    <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                        <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>ブログ編集</Heading>
                        <div className={styles.form_area}>
                            <form onSubmit={ e => {
                                e.preventDefault();
                                handleSendObjectForm(
                                    `/api/admin/blogs/${props.match.params.id}`, 
                                    // history.push('/admin/blogs')
                                );
                            }}>
                                <div className={[styles.flex, styles.mb_24, styles.flex_tb].join(' ')}>
                                    <div className={styles.blog_area}>
                                        <FormInputText
                                            name={'title'}
                                            onBlur={handleFormData}
                                            value={formData.title}
                                            label={'タイトル'}
                                            error={errorMessage}
                                            placeholder='タイトル名'
                                            className={styles.mb_16}
                                        />
                                        <div className={styles.flex_1}>
                                            <Text className={styles.mb_8}>本文</Text>
                                            <div className={styles.edit_area}>
                                                <Editor
                                                    editorState={editorState}
                                                    toolbarClassName="toolbarClassName"
                                                    wrapperClassName="wrapperClassName"
                                                    editorClassName="editorClassName"
                                                    onEditorStateChange={onEditorStateChange}
                                                />
                                            </div>
                                            { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.body}</Text> }
                                        </div>
                                    </div>
                                    <div className={styles.sidebar_box}>
                                        <div className={styles.sidebar_card}>
                                            <div className={styles.title_box}>
                                                <Text size='l'>公開設定</Text>
                                            </div>
                                            <div className={styles.pa_16}>
                                                <FormSelectbox
                                                    name='is_published'
                                                    value={formData.is_published}
                                                    onChange={handleFormData}
                                                    label={'公開設定'}
                                                    error={errorMessage}
                                                >
                                                    <option value={0}>非公開</option>
                                                    <option value={1}>公開</option>
                                                </FormSelectbox>
                                            </div>
                                        </div>
                                        <div className={styles.sidebar_card}>
                                            <div className={styles.title_box}>
                                                <Text size='l'>サムネイル設定</Text>
                                            </div>
                                            <div className={styles.pa_16}>
                                                <InputImage
                                                    src={formData.thumbnail}
                                                    name="thumbnail"
                                                    onChange={e => handleFormFile(e)}
                                                />
                                                { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.file}</Text> }
                                                { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.thumbnail}</Text> }
                                            </div>
                                        </div>
                                        <div className={styles.sidebar_card}>
                                            <div className={styles.title_box}>
                                                <Text size='l'>カテゴリ設定</Text>
                                            </div>
                                            <div className={styles.pa_16}>
                                                <FormSelectbox
                                                    name='brand_id'
                                                    value={formData.brand_id}
                                                    onChange={handleFormData}
                                                    label={'ブランド'}
                                                    error={errorMessage}
                                                    className={styles.mb_16}
                                                >
                                                    <option value={''}>未設定</option>
                                                    { brands && brands.map( brand => ( <option key={brand.id} value={brand.id}>{brand.brand_name}</option>))}
                                                </FormSelectbox>
                                                <FormSelectbox
                                                    name='category_id'
                                                    value={formData.category_id}
                                                    onChange={handleFormData}
                                                    label={'性別カテゴリ'}
                                                    error={errorMessage}
                                                >
                                                    <option value={''}>未設定</option>
                                                    { gender_categories && gender_categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option> )}
                                                </FormSelectbox>
                                            </div>
                                        </div>
                                        <div className={styles.sidebar_card}>
                                            <div className={styles.title_box}>
                                                <Text size='l'>関連品番の設定</Text>
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
                                                { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.items_id}</Text> }
                                            </div>
                                        </div>
                                        <div className={styles.sidebar_card}>
                                            <div className={styles.title_box}>
                                                <Text size='l'>タグの設定</Text>
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
                                                { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.tags_id}</Text> }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={[styles.flex, styles.align_center, styles.justify_center].join(' ')}>
                                    <LinkBtn to={`/admin/blogs`} size='l' className={styles.mr_12} style={{'width': '100%'}} >一覧に戻る</LinkBtn>
                                    <Button size='l' color='primary' type="submit" className={[styles.ml_12, styles.w_100].join(' ')}>更新する</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            </Suspense>
        </main>
    );
}

export default BlogEdit;
