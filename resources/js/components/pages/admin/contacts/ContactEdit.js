import React, {useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useInputForm from "../../../hooks/useInputForm";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import jaLocale from "date-fns/locale/ja";

// TODO フロント側でのバリデーション設定

function ContactEdit(props) {

    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/admin/contacts/${props.match.params.id}/edit`;

    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);

    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData, handleDateChange}] = useInputForm({
        'response_status': 0, // 0: 未対応　1: 対応中 2: 対応済
        'memo': null
    });

    const history = useHistory();

    // dataは{ key(APIサーバーからレスポンスを返す時に設定したkey名) : 値　}の形で返却されるので変数に代入しておく
    const contact = data.contact;

    useEffect(() => {
        // 非同期で通信されるので初回読み込み時にcontactが入ってこない場合があるので条件分岐してあげる
        if(contact) {
            // フォームのデフォルト値を設定するためにsetFormDataで値をセット
            setFormData({...contact});
        }
        if(data.update === true) {
            // 処理が完了した時点でリダイレクトの処理
            history.push('/admin/contacts');
        }
    },[data]);

    // 描画のみを担当
    return (
        isLoading ? (
            <CircularProgress disableShrink />
        ) : errorMessage && errorMessage.httpRequestError ? (
            <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p>
        ) : contact ? (
            <div style={{'width': '50%', 'margin': '0 auto'}}>
                <h1>お問い合わせ編集</h1>
                <form onSubmit={ e => {
                    e.preventDefault();
                    dispatch({type: 'UPDATE', form: formData, url: `/api/admin/contacts/${props.match.params.id}` });
                }}>
                    <div style={{'width': '100%', 'padding': '8px', 'border': '1px solid #000', 'marginBottom': '16px'}}>
                        <p>氏名: {contact.full_name}({contact.full_name_kana})</p>
                        <p>TEL: {contact.tel}</p>
                        <p>Email: {contact.email}</p>
                        <p>お問い合わせ日: {contact.created_at}</p>
                    </div>

                    <h3>タイトル</h3>
                    <div style={{'width': '100%', 'padding': '8px', 'border': '1px solid #000', 'marginBottom': '16px'}}>{contact.title}</div>
                    <h3>お問い合わせ内容</h3>
                    <div style={{'width': '100%', 'padding': '8px', 'border': '1px solid #000', 'marginBottom': '16px'}}>{contact.body}</div>
                    <h3>備考欄記入</h3>
                    <div>
                        <textarea name='memo' onBlur={handleFormData} defaultValue={formData.memo} placeholder='本文を入力' style={{'width': '100%', 'height': '250px', 'padding': '8px','marginBottom': '16px'}} />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.memo}</p> }
                    </div>
                    <div>
                        <label>対応状況
                            <select name='response_status' value={formData.response_status} onChange={handleFormData}>
                                <option value={0}>未対応</option>
                                <option value={1}>対応中</option>
                                <option value={2}>対応済</option>
                            </select>
                        </label>
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.response_status}</p> }
                    </div>
                    <button><Link to={`/admin/contacts`}>一覧に戻る</Link></button>
                    <button type="submit">編集</button>
                </form>
            </div>
        ): (
            <div>該当のお問い合わせが見つかりません。</div>
        )
    );
}

export default ContactEdit;
