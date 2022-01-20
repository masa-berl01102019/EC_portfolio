import React, {useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useInputForm from "../../../hooks/useInputForm";

// TODO フロント側でのバリデーション設定
// TODO モーダルで実装する

function OrderEdit(props) {

    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/admin/orders/${props.match.params.id}/edit`;

    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);

    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData}] = useInputForm({
        'is_paid': '', 
        'is_shipped': ''
    });

    // dataは{ key(APIサーバーからレスポンスを返す時に設定したkey名) : 値 }の形で返却されるので変数に代入しておく
    const order = data.order;

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
