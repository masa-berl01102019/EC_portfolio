import React, {Suspense, useEffect} from 'react';
import {Link} from "react-router-dom";
import useFetchApiData2 from "../../../hooks/useFetchApiData2";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import useObjectForm from "../../../hooks/useObjectForm";
import Heading from '../../../atoms/Heading/Heading';
import Button from '../../../atoms/Button/Button';
import FormSelectbox from '../../../molecules/FormSelectbox/FormSelectbox';
import Badge from '../../../atoms/Badge/Badge';
import InputTextarea from '../../../atoms/InputTextarea/InputTextarea';
import ItemSkuTable from '../../../organisms/admin/Table/ItemSkuTable';
import ItemMeasurementTable from '../../../organisms/admin/Table/ItemMeasurementTable';
import ItemImageTable from '../../../organisms/admin/Table/ItemImageTable';
import CheckboxTag from '../../../atoms/CheckboxTag/CheckboxTag';
import Text from '../../../atoms/Text/Text';
import FormInputText from '../../../molecules/FormInputText/FormInputText';
import styles from '../styles.module.css';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useRecoilValue } from 'recoil';
import { menuAdminState } from '../../../store/menuState';

// TODO フロント側でのバリデーション設定
// TODO フォーム部品に関しての関数をリファクタリング時にhooksに切り出す
// TODO 削除ボタン押すと編集した内容消える点を修正 削除後に再読み込みかけずにコントローラーから任意のデータを返す仕様に変更するか要検討
// TODO プレビュー機能の実装

function ItemEdit(props) {
    // urlの設定
    const baseUrl = `/api/admin/items/${props.match.params.id}/edit`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'ITEM';
    // APIと接続して返り値を取得
    const {data, errorMessage, createData} = useFetchApiData2(baseUrl, model)
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
        'sizes_id': [],
        'colors_id': [],
        'tags_id': [],
        'images': [],
        'measurements': [],
        'skus': []
    });
    // 複数オブジェクト送信用にフォームのラッパー関数呼び出し
    const {handleSendObjectForm, handleInsertObjectForm, handleDeleteObjectForm, handleChangeObjectForm} = useObjectForm(formData, setFormData, createData);
    // API接続の返却値を変数に格納
    const item = data.item;
    const brands = data.brands? data.brands: null;
    const gender_categories = data.gender_categories? data.gender_categories: null;
    const main_categories = data.main_categories? data.main_categories: null;
    const sub_categories = data.sub_categories? data.sub_categories: null;
    const sizes = data.sizes? data.sizes: null;
    const colors = data.colors? data.colors: null;
    const tags = data.tags? data.tags: null;
    // menuの状態管理
    const openAdminMenu = useRecoilValue(menuAdminState);

    useEffect(() => {
        // 非同期で通信されるので初回読み込み時にitemが入ってこない場合があるので条件分岐してあげる
        if(item) {
            // フォームのデフォルト値を設定するためにsetFormDataで値をセット
            setFormData({...item});
        }
    },[]);

    // TODO: フォーム追加するごとにバリデーションエラー発生する点を修正

    return (
        <main>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text role='error'>{errorMessage.httpRequestError}</Text>
                ) : (
                    <div className={ openAdminMenu ? [styles.container_open_menu, styles.max_content].join(' ') : [styles.container, styles.max_content].join(' ') }>
                        <Heading tag={'h1'} tag_style={'h1'} className={styles.mb_16}>商品編集</Heading>
                        <div className={styles.form_area}>
                            <form onSubmit={ e => {
                                e.preventDefault();
                                // SKUの二次元配列をmapで展開
                                const arr = formData.skus.map(item => {
                                    // 比較したい組合せのサイズとカラーのプロパティを分割代入
                                    const {size_id, color_id} = item;
                                    // 取得した組合せをjson形式→文字列化して配列を生成
                                    return JSON.stringify({size:size_id, color:color_id});
                                });
                                // 生成した配列をSetオブジェクトに変換する * Setオブジェクトは重複した値を格納出来ない
                                const setObj = new Set(arr);
        
                                if(setObj.size != arr.length) { // もと配列とsetオブジェクトが要素の数が一致してなければ組合せに重複がある
                                    alert('SKUセクションで選択されてるカラーとサイズの組み合わせに重複が存在しております。');
                                } else if(formData.skus.map(item => item['size_id']).filter(el => !formData.measurements.map(item => item['size_id']).includes(el) ).length > 0) { // SKUのカラーと画像の関連カラーが一致してるか確認
                                    alert('SKUセクションで選択されてるサイズが寸法セクションで選択されてるものと一致しておりません。');
                                }else if(formData.skus.map(item => item['color_id']).filter(el => !formData.images.map(item => item['color_id']).includes(el) ).length > 0) { // SKUのサイズと寸法のサイズが一致してるか確認
                                    alert('SKUセクションで選択されてるカラーが画像セクションで選択されてるものと一致しておりません。');
                                } else {
                                    handleSendObjectForm(`/api/admin/items/${props.match.params.id}`);
                                }
                            }}>
                                <div className={styles.mb_32}>
                                    <div className={[styles.flex, styles.align_center, styles.mb_16 ].join(' ')}>
                                        <Badge text={'1'} type={'number'} className={styles.mr_8}/>
                                        <Heading tag={'h2'} tag_style={'h2'} className={styles.item_heading}>基本情報</Heading>
                                        <div className={styles.heading_border}></div>
                                    </div>
                                    <div className={[styles.flex, styles.flex_tb].join(' ')}>
                                        <div className={[styles.flex_basis_50, styles.mr_24, styles.mb_16_tb].join(' ')}>
                                            <div className={styles.mb_16}>
                                                <FormInputText
                                                    name={'product_number'}
                                                    onBlur={handleFormData}
                                                    value={formData.product_number}
                                                    label={'品番'}
                                                    error={errorMessage}
                                                    placeholder='AS1003200'
                                                    required={true}
                                                />
                                            </div>
                                            <div className={styles.mb_16}>
                                                <FormInputText
                                                    name={'item_name'}
                                                    onBlur={handleFormData}
                                                    value={formData.item_name}
                                                    label={'商品名'}
                                                    error={errorMessage}
                                                    placeholder='プリーツスカート'
                                                    required={true}
                                                />
                                            </div>
                                            <div className={styles.mb_16}>
                                                <FormInputText
                                                    name={'price'}
                                                    type={'number'}
                                                    onBlur={handleFormData}
                                                    value={formData.price}
                                                    label={'価格'}
                                                    error={errorMessage}
                                                    placeholder='3400'
                                                    required={true}
                                                />
                                            </div>
                                            <div className={styles.mb_16}>
                                                <FormInputText
                                                    name={'cost'}
                                                    type={'number'}
                                                    onBlur={handleFormData}
                                                    value={formData.cost}
                                                    label={'原価'}
                                                    error={errorMessage}
                                                    placeholder='1200'
                                                    required={true}
                                                />
                                            </div>
                                            <div className={styles.cost_rate} >
                                                <Text>原価率</Text>
                                                <Text>
                                                    { formData.cost && formData.price && 
                                                        Math.floor(formData.cost / formData.price * 10000) / 100 
                                                    }%
                                                </Text>
                                            </div>
                                            <div>
                                                <FormInputText
                                                    name={'made_in'}
                                                    onBlur={handleFormData}
                                                    value={formData.made_in}
                                                    label={'生産国'}
                                                    error={errorMessage}
                                                    placeholder='中国'
                                                    required={true}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.flex_basis_50}>
                                            <div className={styles.mb_16}>
                                                <div className={[styles.flex, styles.mb_8].join(' ')}>
                                                    <label htmlFor='mixture_ratio'><Text>混用率</Text></label>
                                                    <Badge text={'必須'} className={styles.ml_4}/>
                                                </div>
                                                <InputTextarea
                                                    name={'mixture_ratio'} 
                                                    value={formData.mixture_ratio} 
                                                    onBlur={handleFormData} 
                                                    placeholder={'綿100%'}
                                                    style={{'minHeight' : '148px'}}
                                                />
                                                { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.mixture_ratio}</Text> }
                                            </div>
                                            <div>
                                                <div className={[styles.flex, styles.mb_8].join(' ')}>
                                                    <label htmlFor='mixture_ratio'><Text>商品説明</Text></label>
                                                    <Badge text={'必須'} className={styles.ml_4}/>
                                                </div>
                                                <InputTextarea
                                                    name={'description'} 
                                                    value={formData.description} 
                                                    onBlur={handleFormData} 
                                                    placeholder={'商品説明を入力'}
                                                    style={{'minHeight' : '148px'}}
                                                />
                                                { errorMessage && <Text role='error' size='s' className={styles.mt_8}>{errorMessage.description}</Text> }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={[styles.flex, styles.mb_32, styles.flex_tb].join(' ')}>
                                    <div className={[styles.flex_basis_50, styles.mr_24, styles.mb_16_tb].join(' ')}>
                                        <div className={[styles.flex, styles.align_center, styles.mb_16 ].join(' ')}>
                                            <Badge text={'2'} type={'number'} className={styles.mr_8}/>
                                            <Heading tag={'h2'} tag_style={'h2'} className={styles.item_heading}>カテゴリ</Heading>
                                            <div className={styles.heading_border}></div>
                                        </div>
                                        <div className={styles.mb_16}>
                                            <FormSelectbox
                                                name='brand_id'
                                                value={formData.brand_id}
                                                onChange={handleFormData}
                                                label={'ブランド'}
                                                error={errorMessage}
                                                required={true}
                                            >
                                                <option value={''}>未設定</option>
                                                { brands && brands.map( brand => ( <option key={brand.id} value={brand.id}>{brand.brand_name}</option>))}
                                            </FormSelectbox>
                                        </div>
                                        <div className={styles.mb_16}>
                                            <FormSelectbox
                                                name='gender_category'
                                                value={formData.gender_category}
                                                onChange={handleFormCategory}
                                                label={'性別'}
                                                error={errorMessage}
                                                required={true}
                                            >
                                                <option value={''}>未設定</option>
                                                { gender_categories && gender_categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option> )}
                                            </FormSelectbox>
                                        </div>
                                        <div className={styles.mb_16}>
                                            <FormSelectbox
                                                name='main_category'
                                                value={formData.main_category}
                                                onChange={handleFormCategory}
                                                label={'メイン'}
                                                error={errorMessage}
                                                required={true}
                                            >
                                                {   main_categories && main_categories.filter((category) => Number(formData.gender_category) === category.parent_id).map((category) => (
                                                    <option key={category.id} value={category.id}>{category.category_name}</option>
                                                ))}
                                            </FormSelectbox>
                                        </div>
                                        <div className={styles.mb_16}>
                                            <FormSelectbox
                                                name='sub_category'
                                                value={formData.sub_category}
                                                onChange={handleFormCategory}
                                                label={'サブ'}
                                                error={errorMessage}
                                                required={true}
                                            >
                                                {   sub_categories && sub_categories.filter((category) => Number(formData.main_category) === category.parent_id).map((category) => (
                                                    <option key={category.id} value={category.id}>{category.category_name}</option>
                                                ))}
                                            </FormSelectbox>
                                        </div>
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
                                                skus={formData.skus}
                                                deleteMethod={handleDeleteObjectForm}
                                                handleFormMethod={handleChangeObjectForm}
                                            />
                                        </div>
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
                                                skus={formData.skus}
                                                deleteMethod={handleDeleteObjectForm}
                                                handleFormMethod={handleChangeObjectForm}
                                            />
                                        </div>
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

                                <div className={styles.mb_40}>
                                    <FormSelectbox
                                        name='is_published'
                                        value={formData.is_published}
                                        onChange={handleFormData}
                                        label={'公開設定'}
                                        error={errorMessage}
                                        required={true}
                                    >
                                        <option value={0}>非公開</option>
                                        <option value={1}>公開</option>
                                    </FormSelectbox>
                                </div>

                                <div className={[styles.flex, styles.align_center, styles.justify_center].join(' ')}>
                                    <LinkBtn to={`/admin/items`} size='l' className={[styles.mr_12, styles.w_100].join(' ')} >一覧に戻る</LinkBtn>
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

export default ItemEdit;
