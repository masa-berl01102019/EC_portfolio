import React, {Suspense} from 'react';
import {useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import useObjectForm from "../../../hooks/useObjectForm";
import Heading from '../../../atoms/Heading/Heading';
import Button from '../../../atoms/Button/Button';
import FormSelectbox from '../../../molecules/Form/FormSelectbox';
import Badge from '../../../atoms/Badge/Badge';
import ItemSkuTable from '../../../organisms/admin/Table/ItemSkuTable';
import ItemMeasurementTable from '../../../organisms/admin/Table/ItemMeasurementTable';
import ItemImageTable from '../../../organisms/admin/Table/ItemImageTable';
import CheckboxTag from '../../../atoms/CheckboxTag/CheckboxTag';
import Text from '../../../atoms/Text/Text';
import FormInputText from '../../../molecules/Form/FormInputText';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';
import FormInputTextarea from '../../../molecules/Form/FormInputTextarea';
import useNotify from '../../../context/NotifyContext';
import useHelper from '../../../hooks/useHelper';
import useValidation from '../../../hooks/useValidation';

function ItemCreate() {
    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/admin/items/create`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'ITEM';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData} = useFetchApiData(baseUrl, model);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData, handleFormCheckbox, handleFormCategory}] = useForm({
        'product_number': '',
        'item_name': '',
        'price': '',
        'cost': '',
        'made_in': '',
        'mixture_ratio': '',
        'description': '',
        'is_published': 0, // 0: 非公開 1: 公開中
        'brand_id': '',
        'gender_category' : '',
        'main_category' : '',
        'sub_category' : '',
        'tags_id': [],
        'skus': [ {color_id: '', size_id: '', quantity: ''} ],
        'images': [ {image: '', image_category: '', color_id:''} ],
        'measurements': [ {size_id: '', width: '', shoulder_width: '', raglan_sleeve_length: '', sleeve_length: '', length: '', waist: '', hip: '', rise: '', inseam: '', thigh_width: '', outseam: '', sk_length: '', hem_width: '', weight: ''}  ]
    });
    // フロント用バリデーション
    const {valid, setValid, validation, errorObject} = useValidation(formData, 'admin', 'item_create');
    // 複数オブジェクト送信用にフォームのラッパー関数呼び出し
    const {handleSendObjectForm, handleInsertObjectForm, handleDeleteObjectForm, handleChangeObjectForm} = useObjectForm(formData, setFormData, createData);
    // リダイレクト用の関数呼び出し
    const history = useHistory();
    // API接続の返却値を変数に格納
    const brands = data.brands? data.brands: null;
    const gender_categories = data.gender_categories? data.gender_categories: null;
    const main_categories = data.main_categories? data.main_categories: null;
    const sub_categories = data.sub_categories? data.sub_categories: null;
    const sizes = data.sizes? data.sizes: null;
    const colors = data.colors? data.colors: null;
    const tags = data.tags? data.tags: null;
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);
    // notifyContextの呼び出し
    const alert = useNotify();

    const {isDuplicated} = useHelper();

    const handleFormSubmit = () => {
        if(validation.fails()) {
            setValid(true);
            return false;
        }
        // 二次元配列から比較したい値を配列で抜き出す
        const skus_size = formData.skus.map(item => item.size_id);
        const skus_color = formData.skus.map(item => item.color_id);
        const measurements_size = formData.measurements.map(item => item.size_id);
        const images_color = formData.images.map(item => item.color_id);
        const arr = formData.skus.map(item => {
            // 比較したい組合せのサイズとカラーのプロパティを分割代入
            const {size_id, color_id} = item;
            // 文字列化して配列を生成
            return JSON.stringify({size:size_id, color:color_id});
        });

        if(isDuplicated(arr)) {
            alert({body: 'SKUセクションで選択されてるカラーとサイズの組み合わせの一部が重複しております。', type: 'alert'});
            return false;
        }

        if(isDuplicated(measurements_size)) {
            alert({body: '寸法セクションで選択されてるサイズが重複がしております。', type: 'alert'});
            return false;
        }
        
        if(skus_size.filter(el => !measurements_size.includes(el) ).length > 0 || measurements_size.filter(el => !skus_size.includes(el) ).length > 0) {
            alert({body: 'SKUセクションで選択されてるサイズが寸法セクションで選択されてるものと一致しておりません。', type: 'alert'});
            return false;
        }

        if(skus_color.filter(el => !images_color.includes(el)).length > 0 || images_color.filter(el => !skus_color.includes(el)).length > 0) {
            alert({body: 'SKUセクションで選択されてるカラーが画像セクションで選択されてるものと一致しておりません。', type: 'alert'});
            return false;
        } 

        handleSendObjectForm(
            '/api/admin/items',
            () => history.push('/admin/items')
        );
    }

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                    <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>商品新規登録</Heading>
                    <div className={styles.form_area}>
                        <div className={styles.mb_32}>
                            <div className={[styles.flex, styles.align_center, styles.mb_16 ].join(' ')}>
                                <Badge text={'1'} type={'number'} className={styles.mr_8}/>
                                <Heading tag={'h2'} tag_style={'h2'} className={styles.item_heading}>基本情報</Heading>
                                <div className={styles.heading_border}></div>
                            </div>
                            <div className={[styles.flex, styles.flex_tb].join(' ')}>
                                <div className={[styles.flex_basis_50, styles.mr_24, styles.mb_16_tb].join(' ')}>
                                    <FormInputText
                                        name={'product_number'}
                                        onChange={handleFormData}
                                        value={formData.product_number}
                                        label={'品番'}
                                        error={errorMessage}
                                        validation={validation}
                                        valid={valid}
                                        placeholder='AS1003200'
                                        className={styles.mb_16}
                                    />
                                    <FormInputText
                                        name={'item_name'}
                                        onChange={handleFormData}
                                        value={formData.item_name}
                                        label={'商品名'}
                                        error={errorMessage}
                                        validation={validation}
                                        valid={valid}
                                        placeholder='プリーツスカート'
                                        className={styles.mb_16}
                                    />
                                    <FormInputText
                                        name={'price'}
                                        type={'number'}
                                        onChange={handleFormData}
                                        value={formData.price}
                                        label={'価格'}
                                        error={errorMessage}
                                        validation={validation}
                                        valid={valid}
                                        placeholder='3400'
                                        className={styles.mb_16}
                                    />
                                    <FormInputText
                                        name={'cost'}
                                        type={'number'}
                                        onChange={handleFormData}
                                        value={formData.cost}
                                        label={'原価'}
                                        error={errorMessage}
                                        validation={validation}
                                        valid={valid}
                                        placeholder='1200'
                                        className={styles.mb_16}
                                    />
                                    <div className={styles.cost_rate}>
                                        <Text>原価率</Text>
                                        <Text>
                                            { formData.cost && formData.price && 
                                                Math.floor(formData.cost / formData.price * 10000) / 100 
                                            }%
                                        </Text>
                                    </div>
                                    <FormInputText
                                        name={'made_in'}
                                        onChange={handleFormData}
                                        value={formData.made_in}
                                        label={'生産国'}
                                        error={errorMessage}
                                        validation={validation}
                                        valid={valid}
                                        placeholder='中国'
                                    />
                                </div>
                                <div className={styles.flex_basis_50}>
                                    <FormInputTextarea
                                        name={'mixture_ratio'} 
                                        value={formData.mixture_ratio} 
                                        onChange={handleFormData} 
                                        placeholder={'綿100%'}
                                        label={'混用率'}
                                        error={errorMessage}
                                        validation={validation}
                                        valid={valid}
                                        className={styles.mb_16}
                                        style={{'minHeight' : '148px'}}
                                    />
                                    <FormInputTextarea
                                        name={'description'} 
                                        value={formData.description} 
                                        onChange={handleFormData} 
                                        placeholder={'商品説明を入力'}
                                        label={'商品説明'}
                                        error={errorMessage}
                                        validation={validation}
                                        valid={valid}
                                        style={{'minHeight' : '148px'}}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={[styles.flex, styles.mb_32, styles.flex_tb].join(' ')}>
                            <div className={[styles.flex_basis_50, styles.mr_24, styles.mb_16_tb].join(' ')}>
                                <div className={[styles.flex, styles.align_center, styles.mb_16].join(' ')}>
                                    <Badge text={'2'} type={'number'} className={styles.mr_8}/>
                                    <Heading tag={'h2'} tag_style={'h2'} className={styles.item_heading}>カテゴリ</Heading>
                                    <div className={styles.heading_border}></div>
                                </div>
                                <FormSelectbox
                                    name='brand_id'
                                    value={formData.brand_id}
                                    onChange={handleFormData}
                                    label={'ブランド'}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    className={styles.mb_16}
                                >
                                    <option value={''}>未設定</option>
                                    { brands && brands.map( brand => ( <option key={brand.id} value={brand.id}>{brand.brand_name}</option>))}
                                </FormSelectbox>
                                <FormSelectbox
                                    name='gender_category'
                                    value={formData.gender_category}
                                    onChange={handleFormCategory}
                                    label={'性別'}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    className={styles.mb_16}
                                >
                                    <option value={''}>未設定</option>
                                    { gender_categories && gender_categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option> )}
                                </FormSelectbox>
                                <FormSelectbox
                                    name='main_category'
                                    value={formData.main_category}
                                    onChange={handleFormCategory}
                                    label={'メイン'}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                    className={styles.mb_16}
                                >
                                    <option value={''}>未設定</option>
                                    { main_categories && main_categories.filter((category) => Number(formData.gender_category) === category.parent_id).map((category) => (
                                        <option key={category.id} value={category.id}>{category.category_name}</option>
                                    ))}
                                </FormSelectbox>
                                <FormSelectbox
                                    name='sub_category'
                                    value={formData.sub_category}
                                    onChange={handleFormCategory}
                                    label={'サブ'}
                                    error={errorMessage}
                                    validation={validation}
                                    valid={valid}
                                >
                                    <option value={''}>未設定</option>
                                    {   sub_categories && sub_categories.filter((category) => Number(formData.main_category) === category.parent_id).map((category) => (
                                        <option key={category.id} value={category.id}>{category.category_name}</option>
                                    ))}
                                </FormSelectbox>
                            </div>
                            <div className={styles.flex_basis_50}>
                                <div className={[styles.flex, styles.align_center, styles.mb_16 ].join(' ')}>
                                    <Badge text={'3'} type={'number'} className={styles.mr_8}/>
                                    <Heading tag={'h2'} tag_style={'h2'} className={styles.item_heading}>タグ</Heading>
                                    <div className={styles.heading_border}></div>
                                </div>
                                <div>
                                    <div className={styles.tag_area}>
                                        {   tags &&
                                            tags.map((tag) =>
                                                <div key={tag.id} className={[styles.inline_block, styles.mr_8, styles.mb_8 ].join(' ')}>
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

                        <div className={styles.mb_32}>
                            <div className={[styles.flex, styles.align_center, styles.mb_16 ].join(' ')}>
                                <Badge text={'4'} type={'number'} className={styles.mr_8}/>
                                <Heading tag={'h2'} tag_style={'h2'} className={styles.item_heading}>SKU</Heading>
                                <div className={styles.heading_border}></div>
                            </div>
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
                                { valid && validation.fails() && errorObject && 
                                    Object.entries(errorObject).map(([key, value]) => {
                                        if(key.includes('skus')) {
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
                                {   errorMessage && errorMessage.skus &&
                                    Object.values(errorMessage.skus).map((value, index) => {
                                        return <Text role='error' size='s' key={index} className={styles.mt_8}>{value}</Text> 
                                    })
                                }
                            </div>
                            <Button 
                                onClick={() => handleInsertObjectForm('skus',['item_id'])} 
                                className={[styles.block, styles.ml_auto].join(' ')}
                            >
                                フォーム追加
                            </Button>
                        </div>

                        <div className={styles.mb_32}>
                            <div className={[styles.flex, styles.align_center, styles.mb_16 ].join(' ')}>
                                <Badge text={'5'} type={'number'} className={styles.mr_8}/>
                                <Heading tag={'h2'} tag_style={'h2'} className={styles.item_heading}>画像</Heading>
                                <div className={styles.heading_border}></div>
                            </div>
                            <div className={styles.mb_16}>
                                <div className={styles.scroll_x}>
                                    <ItemImageTable
                                        images={formData.images}
                                        colors={colors}
                                        deleteMethod={handleDeleteObjectForm}
                                        handleFormMethod={handleChangeObjectForm}
                                    />
                                </div>
                                { valid && validation.fails() && errorObject && 
                                    Object.entries(errorObject).map(([key, value]) => {
                                        if(key.includes('images')) {
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
                                {   errorMessage && errorMessage.images &&
                                    Object.values(errorMessage.images).map((value, index) => {
                                        return <Text role='error' size='s' key={index} className={styles.mt_8}>{value}</Text> 
                                    })
                                }
                            </div>
                            <Button 
                                onClick={() => handleInsertObjectForm('images',['item_id'])} 
                                className={[styles.block, styles.ml_auto].join(' ')}
                            >
                                フォーム追加
                            </Button>
                        </div>

                        <div className={styles.mb_32}>
                            <div className={[styles.flex, styles.align_center, styles.mb_16 ].join(' ')}>
                                <Badge text={'6'} type={'number'} className={styles.mr_8}/>
                                <Heading tag={'h2'} tag_style={'h2'} className={styles.item_heading}>寸法</Heading>
                                <div className={styles.heading_border}></div>
                            </div>
                            <div className={styles.mb_16}>
                                <div className={styles.scroll_x}>
                                    <ItemMeasurementTable 
                                        measurements={formData.measurements}
                                        sizes={sizes}
                                        deleteMethod={handleDeleteObjectForm}
                                        handleFormMethod={handleChangeObjectForm}
                                    />
                                </div>
                                { valid && validation.fails() && errorObject && 
                                    Object.entries(errorObject).map(([key, value]) => {
                                        if(key.includes('measurements')) {
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
                                {   errorMessage && errorMessage.measurements &&
                                    Object.values(errorMessage.measurements).map((value, index) => {
                                        return <Text role='error' size='s' key={index} className={styles.mt_8}>{value}</Text>
                                    })
                                }
                            </div>
                            <Button 
                                onClick={() => handleInsertObjectForm('measurements',['item_id'])} 
                                className={[styles.block, styles.ml_auto].join(' ')}
                            >
                                フォーム追加
                            </Button>
                        </div>

                        <FormSelectbox
                            name='is_published'
                            value={formData.is_published}
                            onChange={handleFormData}
                            label={'公開設定'}
                            error={errorMessage}
                            validation={validation}
                            valid={valid}
                            className={styles.mb_40}
                        >
                            <option value={0}>非公開</option>
                            <option value={1}>公開</option>
                        </FormSelectbox>

                        <div className={[styles.flex, styles.justify_center].join(' ')}>
                            <LinkBtn to={`/admin/items`} size='l' className={styles.mr_12} style={{'width': '100%'}} >一覧に戻る</LinkBtn>
                            <Button size='l' color='primary' onClick={handleFormSubmit} className={[styles.ml_12, styles.w_100].join(' ')}>新規登録</Button>
                        </div>
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default ItemCreate;
