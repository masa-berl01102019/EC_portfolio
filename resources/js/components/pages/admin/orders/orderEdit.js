import React, {useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import jaLocale from "date-fns/locale/ja";

// TODO モーダルで実装する

function OrderEdit(props) {

    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/admin/orders/${props.match.params.id}/edit`;
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData, handleFormDate}] = useForm({
        'is_paid': '', 
        'is_shipped': '',
        'delivery_date': null,
        'delivery_time': ''
    });
    // API接続の返却値を変数に格納
    const order = data.order;
    // リダイレクト用の関数呼び出し
    const history = useHistory();

    useEffect(() => {
        // 非同期で通信されるので初回読み込み時にitemが入ってこない場合があるので条件分岐してあげる
        if(order) {
            // フォームのデフォルト値を設定するためにsetFormDataで値をセット
            setFormData({...order});
        }
        if(data.update === true) {
            // 処理が完了した時点でリダイレクトの処理
            history.push('/admin/orders');
        }
    },[data]);


    // 描画のみを担当
    return (
        isLoading ? (
            <CircularProgress disableShrink />
        ) : errorMessage && errorMessage.httpRequestError ? (
            <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p>
        ) : (
            <div>
                <div style={{'background': '#fff', 'padding': '60px 40px','position': 'absolute','top': '50%','left': '50%','transform': 'translate(-50%, -50%)',}}>
                    <h1>受注明細</h1>
                    <div>
                        <form onSubmit={ e => {
                            e.preventDefault();
                            dispatch({type: 'UPDATE', form: formData, url: `/api/admin/orders/${props.match.params.id}` });
                        }}>
                            <table border="1" style={{'display': 'block', 'overflowX': 'scroll', 'borderCollapse': 'collapse', 'whiteSpace': 'nowrap'}}>
                                <thead>
                                    <tr>
                                        <th>品番</th>
                                        <th>商品名</th>
                                        <th>カラー</th>
                                        <th>サイズ</th>
                                        <th>価格</th>
                                        <th>数量</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {   order && order.order_details &&
                                    order.order_details.map(list =>
                                        <tr key={list.id}>
                                            <td>{list.product_number}</td>
                                            <td>{list.item_name}</td>
                                            <td>{list.order_color}</td>
                                            <td>{list.order_size}</td>
                                            <td>{list.order_price}</td>
                                            <td>{list.order_quantity}</td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                            <div>
                                <h3 style={{'borderBottom': '1px solid #666', 'marginTop': '16px', 'marginLeft': 'auto', 'width': '30%', 'textAlign': 'right' }}>
                                    <span>小計</span> <span>{order && order.sub_total_text}</span>
                                </h3>
                                <h3 style={{'borderBottom': '1px solid #666', 'marginTop': '16px', 'marginLeft': 'auto', 'width': '30%', 'textAlign': 'right' }}>
                                    <span>消費税合計</span> <span>{order && order.tax_amount_text}</span>
                                </h3>
                                <h3 style={{'borderBottom': '1px solid #666', 'marginTop': '16px', 'marginLeft': 'auto', 'width': '30%', 'textAlign': 'right' }}>
                                    <span>税込合計</span> <span>{order && order.total_amount_text}</span>
                                </h3>
                            </div>

                            <div style={{'marginTop': '30px'}}>
                                <label htmlFor='delivery_date'>配達希望日
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
                                <label htmlFor='delivery_time'>配達希望時間帯
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
        
                            <div>
                                <div>
                                    <label>入金状況
                                        <select name='is_paid' value={formData.is_paid} onChange={handleFormData}>
                                            <option value={0}>未入金</option>
                                            <option value={1}>入金済</option>
                                        </select>
                                    </label>
                                    { errorMessage && <p style={{'color': 'red'}}>{errorMessage.is_paid}</p> }
                                    <label>出荷状況
                                        <select name='is_shipped' value={formData.is_shipped} onChange={handleFormData}>
                                            <option value={0}>未配送</option>
                                            <option value={1}>配送済</option>
                                        </select>
                                    </label>
                                    { errorMessage && <p style={{'color': 'red'}}>{errorMessage.is_shipped}</p> }
                                </div>
                            </div>

                            <button><Link to={`/admin/orders`}>一覧に戻る</Link></button>
                            <button type="submit">編集</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    );
}

export default OrderEdit;
