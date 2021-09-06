import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import {CircularProgress} from "@material-ui/core";
import useFetchApiData from "../../../hooks/useFetchApiData";
import useInputForm from "../../../hooks/useInputForm";
import ShowErrorMsg from "../../../ShowErrorMsg";

// TODO フロント側でのバリデーション設定
// TODO 登録後に一覧へリダイレクトして成功のメッセージを表示

function AdminEdit(props) {

    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/admin/admins/${props.match.params.id}/edit`;

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

    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);

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
            location.href = '/admin/home';
            // redirect先で成功したメッセージを表示必要
        }
    },[data]);

    // 描画のみを担当
    return (
        <div style={{'width': '50%', 'margin': '0 auto'}}>
            <h1>管理者編集</h1>
            { errorMessage && <ShowErrorMsg errorMessage={errorMessage} /> }
            {   isLoading ? (
                <CircularProgress disableShrink />
                ): (
                    <form onSubmit={ e => {
                        e.preventDefault();
                        dispatch({type: 'UPDATE', form: formData, url: `/api/admin/admins/${props.match.params.id}` });
                    }}>
                        <div>氏名</div>
                        <div>
                            <input type='text' name='last_name' onBlur={handleFormData} defaultValue={formData.last_name} placeholder='田中'/>
                            <input type='text' name='first_name' onBlur={handleFormData} defaultValue={formData.first_name} placeholder='太郎'/>
                        </div>
                        <div>氏名(カナ)</div>
                        <div>
                            <input type='text' name='last_name_kana' onBlur={handleFormData} defaultValue={formData.last_name_kana} />
                            <input type='text' name='first_name_kana' onBlur={handleFormData} defaultValue={formData.first_name_kana} />
                        </div>
                        <label htmlFor='tel'>電話番号</label>
                        <div>
                            <input id="tel" type='tel' name='tel' onBlur={handleFormData} defaultValue={formData.tel} />
                        </div>
                        <label htmlFor='email'>メールアドレス</label>
                        <div>
                            <input id="email" type='email' name='email' onBlur={handleFormData} defaultValue={formData.email} />
                        </div>
                        <button><Link to={`/admin/admins`}>一覧に戻る</Link></button>
                        <button type="submit">更新する</button>
                    </form>
                )
            }
        </div>
    );
}

export default AdminEdit;
