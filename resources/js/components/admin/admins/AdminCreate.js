import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import {CircularProgress} from "@material-ui/core";
import useFetchApiData from "../../hooks/useFetchApiData";
import useInputForm from "../../hooks/useInputForm";
import ShowErrorMsg from "../../ShowErrorMsg";

// TODO フロント側でのバリデーション設定
// TODO 登録後に一覧へリダイレクトして成功のメッセージを表示

function AdminCreate() {

    // urlの設定
    const baseUrl = '/api/admin/admins/create';

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

    useEffect(() => {
        if(data.success === true) {
            // 処理が完了した時点でリダイレクトの処理
            location.href = '/admin/home';
            // redirect先で成功したメッセージを表示必要
        }
    },[data]);

    return (
        <div style={{'width': '50%', 'margin': '0 auto'}}>
            <h1>管理者新規登録</h1>
            { errorMessage && <ShowErrorMsg errorMessage={errorMessage} /> }
            {
                isLoading ? (
                    <CircularProgress disableShrink />
                ): (
                    <form onSubmit={ e => {
                        e.preventDefault();
                        dispatch({type: 'CREATE', form: formData, url:'/api/admin/admins'});
                    }}>
                        <div>氏名</div>
                        <div>
                            <input type='text' name='last_name' onBlur={handleFormData} defaultValue={formData.last_name} placeholder='山田'/>
                            <input type='text' name='first_name' onBlur={handleFormData} defaultValue={formData.first_name} placeholder='太郎'/>
                        </div>
                        <div>氏名(カナ)</div>
                        <div>
                            <input type='text' name='last_name_kana' onBlur={handleFormData} defaultValue={formData.last_name_kana} placeholder='ヤマダ' />
                            <input type='text' name='first_name_kana' onBlur={handleFormData} defaultValue={formData.first_name_kana} placeholder='タロウ' />
                        </div>
                        <label htmlFor='tel'>電話番号</label>
                        <div>
                            <input id="tel" type='tel' name='tel' onBlur={handleFormData} defaultValue={formData.tel} placeholder='08012345678' />
                        </div>
                        <label htmlFor='email'>メールアドレス</label>
                        <div>
                            <input id="email" type='email' name='email' onBlur={handleFormData} defaultValue={formData.email} placeholder='yamada@example.example.com' />
                        </div>
                        <label htmlFor='password'>パスワード</label>
                        <div>
                            <input id="password" type='password' name='password' onBlur={handleFormData} defaultValue={formData.password} placeholder='半角英数字8文字以上' />
                        </div>
                        <button><Link to={`/admin/admins`}>一覧に戻る</Link></button>
                        <button type="submit">新規登録</button>
                    </form>
                )
            }
        </div>
    );
}

export default AdminCreate;
