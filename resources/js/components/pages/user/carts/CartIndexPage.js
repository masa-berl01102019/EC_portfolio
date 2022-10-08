import React, {Suspense, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useForm from "../../../hooks/useForm";
import styles from '../styles.module.css';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import CartCard from '../../../molecules/Card/CartCard';
import DatePicker from '../../../atoms/DatePicker/DatePicker';
import Selectbox from '../../../atoms/Selectbox/Selectbox';
import InputRadio from '../../../atoms/InputRadio/InputRadio';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';

function CartIndexPage() {
    // urlの設定
    const baseUrl = `/api/user/carts`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'CART';
    // APIと接続して返り値を取得
    const {data, errorMessage, updateData, deleteData} = useFetchApiData(baseUrl, model);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData, handleFormDate}] = useForm({
        'total_amount': 0,
        'payment_method': 0, // 0: クレジットカード 1: 代引き * 第一フェーズでの支払い方法はクレジットカードのみ
        'delivery_date': null,
        'delivery_time': '',
    });
    // APIから取得したデータを変数に格納
    const carts = data.data? data.data: null;
    const user = data.user? data.user: null;
    // 合計金額の計算
    const amount = carts.length > 0 ? carts.map(item => item.included_tax_price * item.quantity).reduce((prev,next) => prev + next) : 0;

    useEffect(() => {
        // 合計金額をセット
        if(carts.length > 0) {
            setFormData({
                ...formData,
                'total_amount': amount
            });
        }
    },[amount]);

    // このページ単体でっはトータル

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text className={styles.http_error}>{errorMessage.httpRequestError}</Text>
                ) : (
                    <>
                        <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>注文情報入力</Heading>
                        <div className={[styles.flex, styles.justify_center, styles.mb_32].join(' ')}>
                            <Text role='title'>注文情報入力</Text>
                            <Text className={[styles.mrl_8, styles.disable].join(' ')}>▶</Text>
                            <Text className={styles.disable}>注文内容確認</Text>
                            <Text className={[styles.mrl_8, styles.disable].join(' ')}>▶</Text>
                            <Text className={styles.disable}>注文完了</Text>
                        </div>
                        <div className={styles.form_contents_area}>
                            <div className={[styles.flex, styles.justify_between, styles.mb_8].join(' ')}>
                                <Text role='title' className={styles.bold}>ショッピングカート</Text>
                                <Text role='title' className={styles.bold}>{carts ? carts.length+'点' : '0点'}</Text>
                            </div>
                            <div className={styles.mb_32}>
                            {   carts &&
                                carts.map((cart) =>
                                    <CartCard
                                        key={cart.id}
                                        src={cart.top_image}
                                        to={`/items/${cart.item_id}`}
                                        brand_name={cart.brand_name}
                                        item_name={cart.item_name}
                                        price={cart.included_tax_price}
                                        price_text={cart.included_tax_price_text}
                                        color_name={cart.color_name}
                                        size_name={cart.size_name}
                                        stock_status={cart.stock_status}
                                        quantity={cart.quantity}
                                        update_method={e => updateData({ form: {quantity: `${e.target.value}`}, url:`/api/user/carts/${cart.id}` })}
                                        delete_method={() => deleteData({ url:`/api/user/carts/${cart.id}`})}
                                        error={errorMessage}
                                    />
                                )
                            }
                            </div>
                            {   carts.length > 0 && 
                                <>
                                    <fieldset className={styles.field_area}>
                                        <legend className={[styles.flex, styles.align_center, styles.prl_8].join(' ')}>
                                            <Text role='title' className={[styles.bold, styles.mr_4].join(' ')}>お届け先</Text>
                                            <Text>(　</Text>
                                            <Link to={`/users/edit`}>編集</Link>
                                            <Text>　)</Text>
                                        </legend>
                                        <Text className={styles.mb_8}>{user.delivery_post_code_text ? user.delivery_post_code_text : user.post_code_text}</Text>
                                        <Text className={styles.mb_8}>{user.full_delivery_address ? user.full_delivery_address : user.full_address}</Text>
                                        <Text className={styles.mb_8}>{user.tel}</Text>
                                        <Text>{user.full_name}</Text>
                                    </fieldset>
                                    <fieldset className={styles.field_area}>
                                        <legend><Text role='title' className={[styles.bold, styles.mrl_8].join(' ')}>配達日時</Text></legend>
                                        <div className={styles.mb_8}>
                                            <label htmlFor='delivery_date' className={[styles.flex, styles.align_center].join(' ')}>
                                                <Text className={styles.mr_8}>配達ご希望日</Text>
                                                <DatePicker 
                                                    name={'delivery_date'} 
                                                    value={formData.delivery_date} 
                                                    onChange={handleFormDate}
                                                    style={{'width': '170px'}}
                                                />
                                            </label>
                                        </div>
                                        <label htmlFor='delivery_time' className={[styles.flex, styles.align_center].join(' ')}>
                                            <Text className={styles.mr_8}>ご希望時間帯</Text>
                                            <Selectbox 
                                                name="delivery_time" 
                                                value={formData.delivery_time} 
                                                onChange={handleFormData} 
                                                className={styles.w_170p}
                                            >
                                                <option value={''}>指定しない</option>
                                                <option value={'8:00 - 12:00'}>8:00 - 12:00</option>
                                                <option value={'14:00 - 16:00'}>14:00 - 16:00</option>
                                                <option value={'16:00 - 18:00'}>16:00 - 18:00</option>
                                                <option value={'18:00 - 20:00'}>18:00 - 20:00</option>
                                            </Selectbox>
                                        </label>
                                    </fieldset>
                                    <fieldset className={styles.field_area}>
                                        <legend>
                                            <Text role='title' className={[styles.bold, styles.mrl_8].join(' ')}>支払い方法</Text>
                                        </legend>
                                        <label className={[styles.flex, styles.align_center].join(' ')}>
                                            <InputRadio 
                                                name='payment_method' 
                                                onChange={handleFormData}
                                                value={0} 
                                                checked={formData.payment_method == 0}
                                            />
                                            <Text className={styles.ml_8}>クレジットカード</Text>
                                        </label>
                                        {/* <label className={[styles.flex, styles.align_center].join(' ')}>
                                            <InputRadio 
                                                name='payment_method' 
                                                onChange={handleFormData}
                                                value={1} 
                                                checked={formData.payment_method == 1}
                                            />
                                            <Text className={styles.ml_8}>代金引換</Text>
                                        </label>
                                        {   formData.payment_method == 1 &&
                                            <div className={styles.mt_8}>
                                                <Text className={styles.mb_8}>※代金引換手数料は一律330円（税込）となります。</Text>
                                                <Text className={styles.mb_8}>※商品到着時に配達員に商品代金(税込)＋送料＋代金引換手数料をお支払いください。</Text>
                                                <Text>※代金引換は現金、クレジットカード、デビットカード、電子マネーがご利用いただけます。</Text>
                                            </div>
                                        }  */}
                                    </fieldset>
                                    <fieldset className={styles.field_area}>
                                        <legend>
                                            <Text role='title' className={[styles.bold, styles.mrl_8].join(' ')}>ご請求金額</Text>
                                        </legend>
                                        <div className={[styles.flex, styles.justify_between, styles.mb_8].join(' ')}>
                                            <Text>商品合計(税込)</Text>
                                            <Text>￥{formData.total_amount}</Text>
                                        </div>
                                        <div className={[styles.flex, styles.justify_between, styles.mb_8].join(' ')}>
                                            <Text>送料</Text>
                                            <Text>￥0</Text>
                                        </div>
                                        <div className={[styles.flex, styles.justify_between, styles.mb_8].join(' ')}>
                                            <Text>手数料</Text>
                                            <Text>￥{formData.payment_method == 1 ? 330 : 0}</Text>
                                        </div>
                                        <div className={[styles.flex, styles.justify_between].join(' ')}>
                                            <Text>合計金額(税込)</Text>
                                            <Text>￥{formData.payment_method == 1 ? formData.total_amount + 330 : formData.total_amount}</Text>
                                        </div>
                                    </fieldset>
                                </>
                            }
                            <div className={styles.cart_btn_area}>
                                {   carts.length > 0 && 
                                    <LinkBtn size='l' color='primary' to={{pathname: '/carts/confirm', state: formData}} className={styles.mb_16} style={{'width' : '100%'}}>
                                        決済内容確認に進む
                                    </LinkBtn>
                                }
                                <LinkBtn size='l' to={'/'} style={{'width' : '100%'}}>ショッピングを続ける</LinkBtn>
                            </div>
                        </div>
                    </>
                )
            }
            </Suspense>
        </main>
    );
}

export default CartIndexPage;