import React, {useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import {CircularProgress} from "@material-ui/core";
import useFetchApiData from "../../../hooks/useFetchApiData";
import useInputForm from "../../../hooks/useInputForm";

// TODO フロント側でのバリデーション設定

function AdminEdit(props) {

    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/admin/admins/${props.match.params.id}/edit`;

    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);

    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData}] = useInputForm({
        'last_name': null,
        'first_name': null,
        'last_name_kana': null,
        'first_name_kana': null,
        'tel': null,
        'email': null,
        'password': null,
    });

    const history = useHistory();

    // dataは{ key(APIサーバーからレスポンスを返す時に設定したkey名) : 値　}の形で返却されるので変数に代入しておく
    const admin = data.admin;

    useEffect(() => {
        // 非同期で通信されるので初回読み込み時にadminが入ってこない場合があるので条件分岐してあげる
        if(admin) {
            // フォームのデフォルト値を設定するためにsetFormDataで値をセット
            setFormData({...admin});
        }
        if(data.success === true) {
            // 処理が完了した時点でリダイレクトの処理
            history.push('/admin/admins');
        }
    },[data]);

    // 描画のみを担当
    return (
        isLoading ? (
            <CircularProgress disableShrink />
        ) : errorMessage && errorMessage.httpRequestError ? (
            <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p>
        ) : (
            <div style={{'width': '50%', 'margin': '0 auto'}}>
                <h1>管理者編集</h1>
                <form onSubmit={ e => {
                    e.preventDefault();
                    dispatch({type: 'UPDATE', form: formData, url: `/api/admin/admins/${props.match.params.id}` });
                }}>
                    <div>氏名</div>
                    <div>
                        <input type='text' name='last_name' onBlur={handleFormData} defaultValue={formData.last_name} placeholder='田中'/>
                        <input type='text' name='first_name' onBlur={handleFormData} defaultValue={formData.first_name} placeholder='太郎'/>
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.last_name}</p> }
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.first_name}</p> }
                    </div>
                    <div>氏名(カナ)</div>
                    <div>
                        <input type='text' name='last_name_kana' onBlur={handleFormData} defaultValue={formData.last_name_kana} />
                        <input type='text' name='first_name_kana' onBlur={handleFormData} defaultValue={formData.first_name_kana} />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.last_name_kana}</p> }
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.first_name_kana}</p> }
                    </div>
                    <label htmlFor='tel'>電話番号</label>
                    <div>
                        <input id="tel" type='tel' name='tel' onBlur={handleFormData} defaultValue={formData.tel} />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.tel}</p> }
                    </div>
                    <label htmlFor='email'>メールアドレス</label>
                    <div>
                        <input id="email" type='email' name='email' onBlur={handleFormData} defaultValue={formData.email} />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.email}</p> }
                    </div>
                    <button><Link to={`/admin/admins`}>一覧に戻る</Link></button>
                    <button type="submit">更新する</button>
                </form>
            </div>
        )
    );
}

export default AdminEdit;
