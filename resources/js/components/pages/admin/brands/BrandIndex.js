import React, {Suspense, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
import useForm from "../../../hooks/useForm";
import Heading from '../../../atoms/Heading/Heading';
import InputText from '../../../atoms/InputText/InputText';
import Button from '../../../atoms/Button/Button';
import styles from '../styles.module.css';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';

function BrandIndex() {
    // urlの設定
    const baseUrl = `/api/admin/brands`;
    // modelの設定
    const model = 'BRAND';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData, deleteData, updateData} = useFetchApiData2(baseUrl, model);
    // APIから取得したデータを変数に格納
    const brands = data.brands? data.brands: null;
    // 新規登録用フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({'brand_name': ''});
    // 選択されたブランドのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // 編集用の入力値をuseStateで管理
    const [editBrand, setEditBrand] = useState(null);
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
                        <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>ブランドマスタ</Heading>
                        { errorMessage && <Text role='error' size='s'>{errorMessage.brand_name}</Text> }
                        <div className={styles.form_area}>
                            <div>
                                <form onSubmit={ e => {
                                    e.preventDefault();
                                    createData({
                                        form: formData, 
                                        url:'/api/admin/brands'
                                    });
                                }}>
                                    <div className={styles.flex}>
                                        <InputText
                                            name={'brand_name'}
                                            type={'text'}
                                            onBlur={handleFormData}
                                            value={formData.brand_name}
                                            placeholder='ブランド名'
                                            className={[styles.flex_1, styles.mr_4].join(' ')}
                                        />
                                        <Button size='s' color='primary' type="submit">ブランド追加</Button>
                                    </div>
                                </form>
                            </div>
                            <br/>
                            <div className={styles.master_form_area}>
                                { brands &&
                                    brands.map((brand) =>
                                        <div key={brand.id} className={styles.master_text_area}>
                                            { brand.id === editableForm ? (
                                                <div className={styles.flex}>
                                                    <InputText
                                                        name={'brand_name'}
                                                        type={'text'}
                                                        onBlur={e => setEditBrand(e.target.value)}
                                                        value={brand.brand_name}
                                                        placeholder='ブランド名'
                                                        className={[styles.mr_4, styles.w_100].join(' ')}
                                                    />
                                                    <Button onClick={() => { 
                                                            updateData({
                                                                form: {brand_name: `${editBrand}`},
                                                                url:`/api/admin/brands/${brand.id}`
                                                            })
                                                        }}
                                                        size='s'
                                                        color='primary'
                                                        className={styles.mr_4}
                                                    >編集</Button>
                                                    <Button onClick={() => { 
                                                            let answer = confirm(`選択ブランドを本当に削除しますか？`);
                                                            answer && deleteData({
                                                                url:`/api/admin/brands/${brand.id}`
                                                            });
                                                        }}
                                                        size='s'
                                                    >削除</Button>
                                                </div>
                                                ) : (
                                                <div className={styles.master_editable_text} onClick={() => {
                                                    setEditBrand(brand.brand_name);
                                                    setEeditableForm(brand.id);
                                                }}>{brand.brand_name}</div>
                                            )
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                )
            }
            </Suspense>
        </main>
    );
}

export default BrandIndex;



