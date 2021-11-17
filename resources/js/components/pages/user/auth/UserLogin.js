import React, {useState} from 'react';
import useAuth from "../../../hooks/useAuth";

function UserLogin() {

    // Auth名の設定
    const auth = 'user'
    // 入力値のステート管理
    const [email, setEmail] = useState('uno.tsubasa@example.net');
    const [password, setPassword] = useState('abc12345');
    // Auth hooksの呼び出し
    const {errorMessage, handleLogin} = useAuth(auth);

    return (
        <div style={{'width': '50%', 'margin': '40px auto 60px'}}>
            <h1>一般ログイン</h1>
            { errorMessage && errorMessage.httpRequestError && <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p> }
            <form onSubmit={ e => {
                e.preventDefault();
                handleLogin({email: email, password: password});
            }}>
                <label htmlFor='email'>メールアドレス</label>
                <div>
                    <input id="email" type='email' name='email' onBlur={ e => setEmail(e.target.value) } defaultValue={email} placeholder='test@example.com' />
                </div>
                <label htmlFor='password'>パスワード</label>
                <div>
                    <input id="password" type='password' name='password' onBlur={ e => setPassword(e.target.value) } defaultValue={password} placeholder='半角英数字8文字以上' />
                </div>
                <button type="submit">ログイン</button>
            </form>
        </div>
    );
}

export default UserLogin;


