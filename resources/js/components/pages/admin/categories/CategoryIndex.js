import React, {Suspense, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
import useForm from "../../../hooks/useForm";
import Heading from '../../../atoms/Heading/Heading';
import Button from '../../../atoms/Button/Button';
import InputText from '../../../atoms/InputText/InputText';
import Text from '../../../atoms/Text/Text';
import styles from '../styles.module.css';
import Icon from '../../../atoms/Icon/Icon';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';

function CategoryIndex() {
    // urlの設定
    const baseUrl = `/api/admin/categories`;
    // modelの設定
    const model = 'CATEGORY';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData, deleteData, updateData} = useFetchApiData2(baseUrl, model);
    // APIから取得したデータを変数に格納
    const categories = data.categories? data.categories: null;
    // 新規登録用フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({'category_name': '', 'parent_id': ''});
    // 選択されたカテゴリーのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // 編集用の入力値をuseStateで管理
    const [editCategory, setEditCategory] = useState(null);
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text role='error'>{errorMessage.httpRequestError}</Text>
                ) : (
                    <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                        <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>カテゴリーマスタ</Heading>
                        { errorMessage && <Text role='error' size='s'>{errorMessage.category_name}</Text> }
                        { errorMessage && <Text role='error' size='s'>{errorMessage.parent_id}</Text> }
                        <div className={styles.form_area}>
                            <ul className={[styles.flex, styles.flex_wrap, styles.justify_evenly].join(' ')}>
                                { categories &&
                                    categories.map((category) =>
                                        // gender category
                                        <li key={category.id} className={styles.mb_24}>
                                            { category.id === editableForm ? (
                                                    <div className={[styles.flex, styles.mb_8].join(' ')}>
                                                        <InputText
                                                            name={'category_name'}
                                                            type={'text'}
                                                            onBlur={e => setEditCategory(e.target.value)}
                                                            value={category.category_name}
                                                            placeholder='カテゴリー名'
                                                            className={[styles.w_100, styles.mr_4].join(' ')}
                                                        />
                                                        <Button size='s' color='primary' className={styles.mr_4} onClick={() => { 
                                                            updateData({
                                                                form: {category_name: `${editCategory}`},
                                                                url:`/api/admin/categories/${category.id}`
                                                            })
                                                        }}>編集</Button>
                                                        <Button size='s' onClick={() => { 
                                                            let answer = confirm(`選択カテゴリーを本当に削除しますか？`);
                                                            answer && deleteData({url:`/api/admin/categories/${category.id}`});
                                                        }}>削除</Button>
                                                    </div>
                                                ) : (
                                                    <div className={[styles.category_text, styles.text_gender].join(' ')} onClick={() => {
                                                        setEditCategory(category.category_name);
                                                        setEeditableForm(category.id);
                                                    }}>{category.category_name}</div>
                                                )
                                            }
                                            <ul>
                                                {/* main category */}
                                                { category.children &&
                                                    category.children.map((child) =>
                                                        <li key={child.id}>
                                                            { child.id === editableForm ? (
                                                                <div className={[styles.flex, styles.mb_8].join(' ')}>
                                                                    <InputText
                                                                        name={'category_name'}
                                                                        type={'text'}
                                                                        onBlur={e => setEditCategory(e.target.value)}
                                                                        value={child.category_name}
                                                                        placeholder='カテゴリー名'
                                                                        className={[styles.w_100, styles.mr_4].join(' ')}
                                                                    />
                                                                    <Button size='s' color='primary' className={styles.mr_4} onClick={() => { 
                                                                        updateData({
                                                                            form: {category_name: `${editCategory}`},
                                                                            url:`/api/admin/categories/${child.id}`
                                                                        })
                                                                    }}>編集</Button>
                                                                    <Button size='s' onClick={() => { 
                                                                            let answer = confirm(`選択カテゴリーを本当に削除しますか？`);
                                                                            answer && deleteData({url:`/api/admin/categories/${child.id}`});
                                                                    }}>削除</Button>
                                                                </div>
                                                                ) : (
                                                                <>
                                                                    <input id={`tab_${child.id}`} type='checkbox' name='tab' className={styles.tab} />
                                                                    <label htmlFor={`tab_${child.id}`} className={styles.inline_flex}>
                                                                        <Icon src='/img/arrow_right_icon.svg' className={styles.pulldown_img} />
                                                                    </label>
                                                                    <div className={[styles.category_text, styles.text_main].join(' ')} onClick={() => {
                                                                        setEditCategory(child.category_name);
                                                                        setEeditableForm(child.id);
                                                                    }}>{child.category_name}</div>
                                                                </>
                                                            )
                                                            }
                                                            {/* sub category */}
                                                            <ul className={styles.hidden}>
                                                                { child.grand_children &&
                                                                    child.grand_children.map((grand_child) =>
                                                                        <li key={grand_child.id}  className={styles.pl_32}>
                                                                            { grand_child.id === editableForm ? (
                                                                                <div className={[styles.flex, styles.mb_8].join(' ')}>                        
                                                                                    <InputText
                                                                                        name={'category_name'}
                                                                                        type={'text'}
                                                                                        onBlur={e => setEditCategory(e.target.value)}
                                                                                        value={grand_child.category_name}
                                                                                        placeholder='カテゴリー名'
                                                                                        className={[styles.w_100, styles.mr_4].join(' ')}
                                                                                    />
                                                                                    <Button size='s' color='primary' className={styles.mr_4} onClick={() => { 
                                                                                        updateData({
                                                                                            form: {category_name: `${editCategory}`},
                                                                                            url:`/api/admin/categories/${grand_child.id}`
                                                                                        })
                                                                                    }}>編集</Button>
                                                                                    <Button size='s' onClick={() => { 
                                                                                        let answer = confirm(`選択カテゴリーを本当に削除しますか？`);
                                                                                        answer && deleteData({url:`/api/admin/categories/${grand_child.id}`});
                                                                                    }}>削除</Button>
                                                                                </div>
                                                                                ) : (
                                                                                <div className={[styles.flex, styles.align_center, styles.mb_8].join(' ')}>
                                                                                    <Icon src='/img/pull_down_icon.svg' className={styles.mr_8} />
                                                                                    <div className={[styles.category_text, styles.text_sub].join(' ')} onClick={() => {
                                                                                        setEditCategory(grand_child.category_name);
                                                                                        setEeditableForm(grand_child.id);
                                                                                    }}>{grand_child.category_name}</div>
                                                                                </div>
                                                                            )
                                                                            }
                                                                        </li>
                                                                    )
                                                                }
                                                                <li className={[styles.flex, styles.pl_64, styles.mb_8].join(' ')}>
                                                                    <InputText
                                                                        name={'category_name'}
                                                                        type={'text'}
                                                                        onBlur={handleFormData}
                                                                        placeholder='サブカテゴリー名'
                                                                        className={[styles.w_100, styles.mr_4].join(' ')}
                                                                    />
                                                                    <Button size='s' color='primary'  onClick={() => { 
                                                                        createData({
                                                                            form: {category_name: `${formData.category_name}`, parent_id: `${child.id}`},
                                                                            url:'/api/admin/categories'
                                                                        }) 
                                                                    }}>追加</Button>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    )
                                                }
                                                <li className={[styles.flex, styles.mb_8, styles.pl_32].join(' ')}>
                                                    <InputText
                                                        name={'category_name'}
                                                        type={'text'}
                                                        onBlur={handleFormData}
                                                        placeholder='メインカテゴリー名'
                                                        className={[styles.mr_4, styles.w_100].join(' ')}
                                                    />
                                                    <Button size='s' color='primary' onClick={() => { 
                                                        createData({
                                                            form: {category_name: `${formData.category_name}`, parent_id: `${category.id}`},
                                                            url:'/api/admin/categories'
                                                        }) 
                                                    }}>追加</Button>
                                                </li>
                                            </ul>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                )
            }
            </Suspense>
        </main>
    );
}


export default CategoryIndex;