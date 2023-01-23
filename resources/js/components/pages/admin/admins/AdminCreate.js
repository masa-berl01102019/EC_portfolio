import React, {useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import {CircularProgress} from "@material-ui/core";
import useFetchApiData from "../../../hooks/useFetchApiData";
import useForm from "../../../hooks/useForm";

function AdminCreate() {

    // urlの設定
    const baseUrl = '/api/admin/admins/create';
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({
        'last_name': null,
        'first_name': null,
        'last_name_kana': null,
        'first_name_kana': null,
        'tel': null,
        'email': null,
        'password': null,
    });
    // リダイレクト用の関数呼び出し
    const history = useHistory();

    useEffect(() => {
        if(data.create === true) {
            // 処理が完了した時点でリダイレクトの処理
            history.push('/admin/admins');
        }
    },[data]);

    return (
        isLoading ? (
            <CircularProgress disableShrink />
        ) : errorMessage && errorMessage.httpRequestError ? (
            <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p>
        ) : (
            <div style={{'width': '50%', 'margin': '0 auto'}}>
                <h1>管理者新規登録</h1>
                <form onSubmit={ e => {
                    e.preventDefault();
                    dispatch({type: 'CREATE', form: formData, url:'/api/admin/admins'});
                }}>
                    <div>氏名</div>
                    <div>
                        <input type='text' name='last_name' onBlur={handleFormData} defaultValue={formData.last_name} placeholder='山田'/>
                        <input type='text' name='first_name' onBlur={handleFormData} defaultValue={formData.first_name} placeholder='太郎'/>
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.last_name}</p> }
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.first_name}</p> }
                    </div>
                    <div>氏名(カナ)</div>
                    <div>
                        <input type='text' name='last_name_kana' onBlur={handleFormData} defaultValue={formData.last_name_kana} placeholder='ヤマダ' />
                        <input type='text' name='first_name_kana' onBlur={handleFormData} defaultValue={formData.first_name_kana} placeholder='タロウ' />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.last_name_kana}</p> }
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.first_name_kana}</p> }
                    </div>
                    <label htmlFor='tel'>電話番号</label>
                    <div>
                        <input id="tel" type='tel' name='tel' onBlur={handleFormData} defaultValue={formData.tel} placeholder='08012345678' />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.tel}</p> }
                    </div>
                    <label htmlFor='email'>メールアドレス</label>
                    <div>
                        <input id="email" type='email' name='email' onBlur={handleFormData} defaultValue={formData.email} placeholder='yamada@example.example.com' />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.email}</p> }
                    </div>
                    <label htmlFor='password'>パスワード</label>
                    <div>
                        <input id="password" type='password' name='password' onBlur={handleFormData} defaultValue={formData.password} placeholder='半角英数字8文字以上' />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.password}</p> }
                    </div>
                    <button><Link to={`/admin/admins`}>一覧に戻る</Link></button>
                    <button type="submit">新規登録</button>
                </form>
            </div>
        )
    );
}

export default AdminCreate;
