import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useCreateParams from "../../../hooks/useCreateParams";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import { useParamsContext } from '../../../context/ParamsContext';
import useForm from "../../../hooks/useForm";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import jaLocale from "date-fns/locale/ja";
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';

// TODO: stripeのエラー時のエラーメッセージをどうするか？
// TODO: カード入力の郵便番号ないバージョンにする

function CartIndexPage() {
    // urlの設定
    const baseUrl = `/api/user/carts`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'CART';
    // URLパラメータ変更のフックの呼び出し
    const [dateRangeStart, dateRangeEnd, dateRangeField, {handleFilter, handleFilterCheckbox, handleSort}] = useCreateParams();
    // useContext呼び出し
    const {params, setParams, scope, setScope} = useParamsContext();
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', [],  model);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData, handleFormDate}] = useForm({
        'total_amount': null,
        'payment_method': 0, // 0: クレジットカード 1: 代引き * 第一フェーズでの支払い方法はクレジットカードのみ
        'delivery_date': null,
        'delivery_time': '',
    });
    // APIから取得したデータを変数に格納
    const carts = data.data? data.data: null;
    const sizes = data.sizes? data.sizes: null;
    const colors = data.colors? data.colors: null;
    const brands = data.brands? data.brands: null;
    const user = data.user? data.user: null;
    // 購入プロセスの状態をuseStateで管理
    const [purchaceState, usePurchaceState] = useState(1); // 1: input 2: confirm 3: complete 4:faile

    // 各stripeの要素を呼び出し
    const stripe = useStripe();
    const elements = useElements();

    const handleAmount = () => {
        const amount = carts.map(item => item.included_tax_price * item.quantity).reduce((prev,next) => prev + next);
        setFormData({
            ...formData,
            'total_amount': amount
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (elements == null) return;
        // 非同期の関数を宣言してるのでawaitをつけてstripeに情報を送信する
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            // 要素からクレジットカードの入力情報を取得
            card: elements.getElement(CardElement),
        });
        if(!error) {
            const { id } = paymentMethod;
            dispatch({type: 'CREATE', form: {...formData, id}, url: '/api/user/orders' });
        }
    };

    useEffect(() => {
        if(carts && carts.length > 0) {
            handleAmount();
        }
        // paramsのデフォルト値と適用範囲を設定
        if(scope === null || scope !== model) { // 全てのページにおいての初回読み込みなので初期値を代入
            console.log('CARTにてparamsの初期値をセットしてscopeを変更');
            setParams({
                ...params,
                sort: { 'price' : '', 'item_name' : '', 'updated_at' : ''},
                filter: { 'keyword' : '', 'brand' : [], 'size' : [], 'color' : [] },
            });
            setScope(model);
        }
        // カート削除やカートの個数を変更した際に条件分岐
        if(data.delete === true || data.update === true) {
            // ページネーションの設定を保持して再度読み込み
            dispatch({ type: 'READ', url: useCreateUrl(baseUrl, params) });
        }
        // 決済を実行した際に条件分岐
        if(data.create === true) {
            // 完了ページ表示
            usePurchaceState(3);
        }
        // 決済を実行した際に条件分岐
        if(data.create == false) {
            // 失敗ページ表示
            usePurchaceState(4);
        }
    },[data]);

    // 描画のみを担当
    return (
        isLoading ? (
            <CircularProgress disableShrink />
        ) : errorMessage && errorMessage.httpRequestError ? (
            <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p>
        ) : (
            purchaceState === 1 ? (
                <>
                    <h1>注文情報入力</h1>
                    <h2>
                        <span>注文情報入力</span>▶
                        <span>注文内容確認</span>▶
                        <span>注文完了</span>
                    </h2>

                    {   Object.keys(params.filter).length > 0 && scope === model &&
                        <div className={'filter'}>
                            <h3>フィルター機能</h3>
                            <div>
                                <span>キーワード検索</span>
                                <input type='text' name='keyword' onBlur={handleFilter} defaultValue={params.filter.keyword} placeholder={'商品名を検索'}/>
                            </div>
                            <div>
                                <span style={{'marginRight': '20px'}}>ブランド</span>
                                {   brands &&
                                    brands.map((brand) =>
                                        <label key={brand.id} ><input type='checkbox' name='brand' onChange={handleFilterCheckbox} value={brand.id} checked={params.filter.brand.includes(brand.id)} />{brand.brand_name}</label>
                                    )
                                }
                            </div>
                            <div>
                                <span style={{'marginRight': '20px'}}>サイズ</span>
                                {   sizes &&
                                    sizes.map((size) =>
                                        <label key={size.id} ><input type='checkbox' name='size' onChange={handleFilterCheckbox} value={size.id} checked={params.filter.size.includes(size.id)} />{size.size_name}</label>
                                    )
                                }
                            </div>
                            <div style={{'display':'flex'}}>
                                <span style={{'marginRight': '20px'}}>カラー</span>
                                <div style={{'width': '200px', 'overflowY': 'scroll', 'height': '45px', 'border': '1px solid #000'}}>
                                    {   colors &&
                                        colors.map((color) =>
                                            <label key={color.id} style={{'display':'block'}}><input type='checkbox' name='color' onChange={handleFilterCheckbox} value={color.id} checked={params.filter.color.includes(color.id)} />{color.color_name}</label>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    }

                    {   Object.keys(params.sort).length > 0 && scope === model &&
                        <div className={'sort'}>
                            <h3>ソート機能</h3>
                            <label>商品名
                                <select name='item_name' value={params.sort.item_name} onChange={handleSort}>
                                    <option value={''}>未選択</option>
                                    <option value={'desc'}>降順</option>
                                    <option value={'asc'}>昇順</option>
                                </select>
                            </label>
                            <label>価格
                                <select name='price' value={params.sort.price} onChange={handleSort}>
                                    <option value={''}>未選択</option>
                                    <option value={'desc'}>降順</option>
                                    <option value={'asc'}>昇順</option>
                                </select>
                            </label>
                            <label>登録日
                                <select name='updated_at' value={params.sort.updated_at} onChange={handleSort}>
                                    <option value={''}>未選択</option>
                                    <option value={'desc'}>降順</option>
                                    <option value={'asc'}>昇順</option>
                                </select>
                            </label>
                        </div>
                    }

                    <h3 style={{'marginTop': '30px'}}><span>ショッピングカート</span><span>{carts && !errorMessage && carts.length+'点'}</span></h3><br/>

                    {   carts &&
                        <ul> 
                            {                        
                                carts.map((cart) =>
                                    <li key={cart.id}>
                                        <div style={{'display' : 'flex'}}>
                                            <Link to={`/items/${cart.item_id}`}>
                                                <img src={cart.top_image} alt="" style={{ 'width':'150px', 'height': '150px', 'display': 'block' }}/>
                                                { cart.stock_status === 0 && <p style={{'color': 'red'}}>在庫なし</p>}
                                            </Link>
                                            <div>
                                                <p>{cart.brand_name}</p>
                                                <p>{cart.item_name}</p>
                                                <p>{cart.included_tax_price_text} (税込)</p>
                                                <p>{cart.color_name} / {cart.size_name}</p>
                                                <button onClick={ () => { dispatch({type:'DELETE', url:`/api/user/carts/${cart.id}`}); }}>削除</button>
                                            </div>
                                        </div>
                                        <div>
                                            <label>数量
                                                <input 
                                                    type='number' name='quantity' defaultValue={cart.quantity}
                                                    onBlur={(e) => { dispatch({type:'UPDATE', form: {quantity: `${e.target.value}`},  url:`/api/user/carts/${cart.id}`}); }}
                                                />
                                            </label>
                                            <span>小計 ￥{Number(cart.included_tax_price * cart.quantity).toLocaleString()} (税込)</span>
                                        </div>
                                    </li>
                                )
                            }
                        </ul>
                    }

                    {   user &&
                        <div style={{'marginTop': '30px'}}>
                            <h3>お届け先</h3>
                            <Link to={`/users/edit`}>編集</Link>
                            <ul> 
                                <li>{user.delivery_post_code_text ? user.delivery_post_code_text : user.post_code_text}</li>
                                <li>{user.full_delivery_address ? user.full_delivery_address : user.full_address}</li>
                                <li>{user.tel}</li>
                                <li>{user.full_name}</li>
                            </ul>
                        </div>
                    }

                    <div style={{'marginTop': '30px'}}>
                        <h3>配達日時</h3>
                        <label htmlFor='delivery_date'>配達ご希望日
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
                                <KeyboardDatePicker
                                    id="delivery_date"
                                    format='yyyy/MM/dd'
                                    disableToolbar // 年月日の選択時に上部に選択されるtoolbarを非表示にする
                                    variant="dialog" // modal形式でのカレンダーの表示
                                    inputVariant="outlined" // inputっぽい表示
                                    openTo="date" // カレンダーアイコンクリック時に年->月->日の順に選択出来るように設定
                                    views={["date"]}
                                    value={formData.delivery_date}
                                    onChange={e => {handleFormDate(e, 'delivery_date')}}
                                    placeholder='1991/01/01'
                                />
                            </MuiPickersUtilsProvider>
                        </label>
                        <br />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.delivery_date}</p> }
                        <label htmlFor='delivery_time'>ご希望時間帯
                            <select name="delivery_time" value={formData.delivery_time} onChange={handleFormData} >
                                <option value={''}>指定しない</option>
                                <option value={'8:00 - 12:00'}>8:00 - 12:00</option>
                                <option value={'14:00 - 16:00'}>14:00 - 16:00</option>
                                <option value={'16:00 - 18:00'}>16:00 - 18:00</option>
                                <option value={'18:00 - 20:00'}>18:00 - 20:00</option>
                            </select>
                        </label>
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.delivery_time}</p> }
                    </div>

                    <div style={{'marginTop': '30px'}}>
                        <h3>支払い方法</h3>
                        <label>クレジットカード
                            <input name='payment_method' type='radio' value={0} onClick={handleFormData} defaultChecked={formData.payment_method == 0}/>
                        </label>
                        {/* <label>代金引換
                            <input name='payment_method' type='radio' value={1} onClick={handleFormData} defaultChecked={formData.payment_method == 1}/>
                        </label>
                        {   formData.payment_method == 1 &&
                            <>
                                <p>※代金引換手数料は一律330円（税込）となります。</p>
                                <p>※商品到着時に配達員に商品代金(税込)＋送料＋代金引換手数料をお支払いください。</p>
                                <p>※代金引換は現金、クレジットカード、デビットカード、電子マネーがご利用いただけます。</p>
                            </>
                        } */}
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.payment_method}</p> }
                    </div>

                    {   carts && carts.length > 0 &&
                        <div style={{'marginTop': '30px'}}>
                            <h3>ご請求金額</h3>
                            <ul> 
                                <li>商品合計 (税込)　￥{formData.total_amount}</li>
                                <li>送料　￥0</li>
                                <li>手数料　￥0</li>
                            </ul>
                            <p>合計金額 (税込)　￥{formData.total_amount}</p>
                        </div>
                    }
                    <div style={{'marginTop': '30px'}}>
                        <button onClick={() => usePurchaceState(2)}>決済内容確認に進む</button><br/>
                        <Link to={'/'}>ショッピングを続ける</Link>
                    </div>
                </>
            ) : purchaceState === 2 ? (
                    <form onSubmit={handleSubmit}>
                        <h1>注文内容確認</h1>
                        <h2>
                            <span>注文情報入力</span>▶
                            <span>注文内容確認</span>▶
                            <span>注文完了</span>
                        </h2>
                        { errorMessage && <p style={{'color': 'red'}}>注文情報入力ページの入力内容に誤りがあります。注文情報入力ページにてご確認下さい。</p> }

                        {   carts && carts.length > 0 &&
                            <div style={{'marginTop': '30px'}}>
                                <h3>ご請求金額</h3>
                                <ul> 
                                    <li>商品合計 (税込)　￥{formData.total_amount}</li>
                                    <li>送料　￥0</li>
                                    <li>手数料　￥{formData.payment_method == 1 ? 330 : 0}</li>
                                </ul>
                                <p>合計金額 (税込)　￥{formData.payment_method == 1 ? formData.total_amount + 330 : formData.total_amount}</p>
                            </div>
                        }

                        {   user &&
                            <div style={{'marginTop': '30px'}}>
                                <h3>お届け先</h3>
                                <ul> 
                                    <li>{user.delivery_post_code_text ? user.delivery_post_code_text : user.post_code_text}</li>
                                    <li>{user.full_delivery_address ? user.full_delivery_address : user.full_address}</li>
                                    <li>{user.tel}</li>
                                    <li>{user.full_name}</li>
                                </ul>
                            </div>
                        }

                        <div style={{'marginTop': '30px'}}>
                            <h3>配達日時</h3>
                            <ul> 
                                <li>配達ご希望日　{formData.delivery_date}</li>
                                <li>ご希望時間帯　{formData.delivery_time}時</li>
                            </ul>
                        </div>

                        <div style={{'marginTop': '30px'}}>
                            <h3>支払い方法</h3>  
                            <label>クレジットカード情報入力</label>
                            {/* クレジットカード番号と有効期限とCVCを入力するフォーム */}
                            <CardElement />
                            <p>※注文情報入力ページに戻られる場合、再度入力必要になります</p>
                            { errorMessage && <p style={{'color': 'red'}}>{errorMessage.payment_method}</p> }
                        </div>

                        <div style={{'marginTop': '30px'}}>
                            <button type="submit">決済する</button><br/>
                            {/* <button type="submit" disabled={!stripe || !elements}>決済する</button><br/> */}
                            <button onClick={() => usePurchaceState(1)}>注文情報入力ページに戻る</button>
                        </div>
                    </form>
            ) : purchaceState === 3 ? (
                <>
                    <h1>注文完了</h1>
                    <h2>
                        <span>注文情報入力</span>▶
                        <span>注文内容確認</span>▶
                        <span>注文完了</span>
                    </h2>
                    <p style={{'marginTop': '30px'}}>
                        商品の決済が完了致しました。<br/>
                        注文明細はご登録されている<br/>
                        メールアドレスにお送り致します。
                    </p>
                    <br/>
                    <Link to={'/'}>TOPページに戻る</Link>
                </>
            ) : (
                <>
                    <h1>注文に失敗しました。</h1>

                    <p style={{'marginTop': '30px'}}>
                        何かしらの理由で決済が失敗しました。<br/>
                        注文情報入力ページに戻って最初からやり直して下さい。<br/>
                    </p>
                    <br/>
                    <button onClick={() => {  dispatch({ type: 'READ', url: useCreateUrl(baseUrl, params) }); usePurchaceState(1); }}>注文情報入力ページに戻る</button>
                </>
            )
        )
    );
}

export default CartIndexPage;



