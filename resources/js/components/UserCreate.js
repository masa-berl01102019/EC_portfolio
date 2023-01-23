import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import DataFetchApi from "./DataFetchApi";
import {CircularProgress} from "@material-ui/core";

// TODO フロント側でのバリデーション設定
// TODO placeholderを設定
// TODO バック側で正規表現でのバリデーションルール作成　＊カナetc
// TODO 誕生日/郵便番号/電話番号の入出力の仕方を決める
// TODO ボタンの制御(連打対策)
// TODO 登録後に一覧へリダイレクトして成功のメッセージを表示
// TODO preventDefault()しないとなぜかPOST後に'/api/admin/users/create?userInfo'の形でリクエストが飛んで落ちてしまう。。原因を調べる

function UserCreate() {

    // チェックボックスのclickイベントで配送先住所のフォームの表示と非表示を管理
    const [isDisplayed, setIsDisplayed] = useState(false);

    // フォーム項目の初期値をuseStateで管理
    const [userInfo, setUserInfo] = useState({
        'last_name': null,
        'first_name': null,
        'last_name_kana': null,
        'first_name_kana': null,
        'gender': null, // 0:man 1:woman 2:others 3:no answer
        'birthday': null,
        'post_code': null,
        'prefecture': null,
        'municipality': null,
        'street_name': null,
        'street_number': null,
        'building': null,
        'delivery_post_code': null,
        'delivery_prefecture': null,
        'delivery_municipality': null,
        'delivery_street_name': null,
        'delivery_street_number': null,
        'delivery_building': null,
        'tel': null,
        'email': null,
        'password': null,
        'is_received': null, // 0: 受取NG　1: 受取OK
    });

    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = DataFetchApi('/api/admin/users/create', 'get', []);

    useEffect(() => {
        if(data.success === true) {
            // 処理が完了した時点でリダイレクトの処理　＊TODO ルーティングをあとで変更
            location.href = '/admin/home';
            // redirect先で成功したメッセージを表示必要
        }
    },[data]);

    const inputHandler =  (e) => {
        // 関数式を呼び出したinput要素のname属性を取得
        const name = e.target.name;
        // keyにname属性を指定してe.target.valueで取得した値をセット
        // 事前に分割代入しないと全て上書きされてしまうので要注意
        setUserInfo( {
            ...userInfo,
            [name]: e.target.value
        });
    };

    return (
        <div style={{'width': '50%', 'margin': '0 auto'}}>
            <h1>User登録ページ</h1>
            { errorMessage &&
                <ul style={{'color': 'red', 'listStyle': 'none'}}>
                    {
                        errorMessage.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))
                    }
                </ul>
            }
            {   isLoading ? (
                    <CircularProgress disableShrink />
                ):(
                    <form onSubmit={ e => {
                        e.preventDefault();
                        dispatch({type: 'CREATE', form: userInfo, url: '/api/admin/users' });
                    }}>
                        <div>お名前</div>
                        <div>
                            <input type='text' name='last_name' onBlur={inputHandler} defaultValue={userInfo.last_name} />
                            <input type='text' name='first_name' onBlur={inputHandler} defaultValue={userInfo.first_name} />
                        </div>
                        <div>お名前(カナ)</div>
                        <div>
                            <input type='text' name='last_name_kana' onBlur={inputHandler} defaultValue={userInfo.last_name_kana} />
                            <input type='text' name='first_name_kana' onBlur={inputHandler} defaultValue={userInfo.first_name_kana} />
                        </div>
                        <div>性別</div>
                        <div>
                            <label><input type='radio' name='gender' onClick={inputHandler} value={0} defaultChecked={userInfo.gender === '0'} />男性</label>
                            <label><input type='radio' name='gender' onClick={inputHandler} value={1} defaultChecked={userInfo.gender === '1'} />女性</label>
                            <label><input type='radio' name='gender' onClick={inputHandler} value={2} defaultChecked={userInfo.gender === '2'} />その他</label>
                            <label><input type='radio' name='gender' onClick={inputHandler} value={3} defaultChecked={userInfo.gender === '3'} />設定しない</label>
                        </div>
                        <label htmlFor='birthday'>誕生日</label>
                        <div>
                            <input id="birthday" type='text' name='birthday' onBlur={inputHandler} defaultValue={userInfo.birthday} />
                        </div>
                        <label htmlFor='post_code'>郵便番号</label>
                        <div>
                            <input id="post_code" type='number' name='post_code' onBlur={inputHandler} defaultValue={userInfo.post_code} />
                        </div>
                        <label htmlFor='prefecture'>都道府県</label>
                        <div>
                            <input id="prefecture" type='text' name='prefecture' onBlur={inputHandler} defaultValue={userInfo.prefecture} />
                        </div>
                        <label htmlFor='municipality'>市区町村郡</label>
                        <div>
                            <input id="municipality" type='text' name='municipality' onBlur={inputHandler} defaultValue={userInfo.municipality} />
                        </div>
                        <label htmlFor='street_name'>町名</label>
                        <div>
                            <input id="street_name" type='text' name='street_name' onBlur={inputHandler} defaultValue={userInfo.street_name} />
                        </div>
                        <label htmlFor='street_number'>町目番地</label>
                        <div>
                            <input id="street_number" type='text' name='street_number' onBlur={inputHandler} defaultValue={userInfo.street_number} />
                        </div>
                        <label htmlFor='building'>建物名</label>
                        <div>
                            <input id="building" type='text' name='building' onBlur={inputHandler} defaultValue={userInfo.building} />
                        </div>
                        <div>
                            <label><input type="checkbox" onClick={() => { setIsDisplayed(prevState => !prevState) }} />配送先に別の住所を指定する</label>
                        </div>
                        <div style={ isDisplayed? { 'display': 'block' } : { 'display': 'none' } }>
                            <label htmlFor='delivery_post_code'>郵便番号</label>
                            <div>
                                <input id="delivery_post_code" type='number' name='delivery_post_code' onBlur={inputHandler} defaultValue={userInfo.delivery_post_code} />
                            </div>
                            <label htmlFor='delivery_prefecture'>都道府県</label>
                            <div>
                                <input id="delivery_prefecture" type='text' name='delivery_prefecture' onBlur={inputHandler} defaultValue={userInfo.delivery_prefecture} />
                            </div>
                            <label htmlFor='delivery_municipality'>市区町村郡</label>
                            <div>
                                <input id="delivery_municipality" type='text' name='delivery_municipality' onBlur={inputHandler} defaultValue={userInfo.delivery_municipality} />
                            </div>
                            <label htmlFor='delivery_street_name'>町名</label>
                            <div>
                                <input id="delivery_street_name" type='text' name='delivery_street_name' onBlur={inputHandler} defaultValue={userInfo.delivery_street_name} />
                            </div>
                            <label htmlFor='delivery_street_number'>町目番地</label>
                            <div>
                                <input id="delivery_street_number" type='text' name='delivery_street_number' onBlur={inputHandler} defaultValue={userInfo.delivery_street_number} />
                            </div>
                            <label htmlFor='delivery_building'>建物名</label>
                            <div>
                                <input id="delivery_building" type='text' name='delivery_building' onBlur={inputHandler} defaultValue={userInfo.delivery_building} />
                            </div>
                        </div>
                        <label htmlFor='tel'>電話番号</label>
                        <div>
                            <input id="tel" type='tel' name='tel' onBlur={inputHandler} defaultValue={userInfo.tel} />
                        </div>
                        <label htmlFor='email'>メールアドレス</label>
                        <div>
                            <input id="email" type='email' name='email' onBlur={inputHandler} defaultValue={userInfo.email} />
                        </div>
                        <label htmlFor='password'>パスワード</label>
                        <div>
                            <input id="password" type='password' name='password' onBlur={inputHandler} defaultValue={userInfo.password} />
                        </div>
                        <div>DM送付</div>
                        <div>
                            <label><input type='radio' name='is_received' onClick={inputHandler} value={1} defaultChecked={userInfo.is_received === '1'} />登録する</label>
                            <label><input type='radio' name='is_received' onClick={inputHandler} value={0} defaultChecked={userInfo.is_received === '0'} />登録しない</label>
                        </div>
                        <button><Link to={`/admin/users`}>一覧に戻る</Link></button>
                        <button type="submit">新規登録</button>
                    </form>
                )
            }
        </div>
    );
}

export default UserCreate;
