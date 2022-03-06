import React, {useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useForm from "../../../hooks/useForm";
import useToggle from "../../../hooks/useToggle";
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from "date-fns/locale/ja";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

function UserCreate() {

    // urlの設定
    const baseUrl = '/api/admin/users/create';
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);
    // チェックボックスのclickイベントで配送先住所のフォームの表示と非表示を管理
    const [toggle, {handleToggle}] = useToggle(false);
    // フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData, handleFormDate}] = useForm({
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
        'is_received': null, // 0: 受取NG 1: 受取OK
    });
    // リダイレクト用の関数呼び出し
    const history = useHistory();

    useEffect(() => {
        if(data.create === true) {
            // 処理が完了した時点でリダイレクトの処理
            history.push('/admin/users');
        }
    },[data]);

    return (
        isLoading ? (
            <CircularProgress disableShrink />
        ) : errorMessage && errorMessage.httpRequestError ? (
            <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p>
        ) : (
            <div style={{'width': '50%', 'margin':'0 auto'}}>
                <h1>会員新規登録</h1>
                <form onSubmit={ e => {
                    e.preventDefault();
                    dispatch({type: 'CREATE', form: formData, url:'/api/admin/users'});
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
                    <div>性別</div>
                    <div>
                        <label><input type='radio' name='gender' onClick={handleFormData} value={0} defaultChecked={formData.gender === '0'} />男性</label>
                        <label><input type='radio' name='gender' onClick={handleFormData} value={1} defaultChecked={formData.gender === '1'} />女性</label>
                        <label><input type='radio' name='gender' onClick={handleFormData} value={2} defaultChecked={formData.gender === '2'} />その他</label>
                        <label><input type='radio' name='gender' onClick={handleFormData} value={3} defaultChecked={formData.gender === '3'} />未回答</label>
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.gender}</p> }
                    </div>
                    <label htmlFor='birthday'>生年月日</label>
                    <div>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
                                <KeyboardDatePicker
                                    id="birthday"
                                    format='yyyy/MM/dd'
                                    disableToolbar // 年月日の選択時に上部に選択されるtoolbarを非表示にする
                                    variant="dialog" // modal形式でのカレンダーの表示
                                    inputVariant="outlined" // inputっぽい表示
                                    openTo="year" // カレンダーアイコンクリック時に年->月->日の順に選択出来るように設定
                                    views={["year", "month", "date"]}
                                    value={formData.birthday}
                                    onChange={e => {
                                        handleFormDate(e, 'birthday')
                                    }}
                                    placeholder='1991/01/01'
                                />
                        </MuiPickersUtilsProvider>
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.birthday}</p> }
                    </div>
                    <label htmlFor='post_code'>郵便番号</label>
                    <div>
                        <input id="post_code" type='number' name='post_code' onBlur={handleFormData} defaultValue={formData.post_code} placeholder='9208509' />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.post_code}</p> }
                    </div>
                    <label htmlFor='prefecture'>都道府県</label>
                    <div>
                        <input id="prefecture" type='text' name='prefecture' onBlur={handleFormData} defaultValue={formData.prefecture} placeholder='石川県' />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.prefecture}</p> }
                    </div>
                    <label htmlFor='municipality'>市区町村郡</label>
                    <div>
                        <input id="municipality" type='text' name='municipality' onBlur={handleFormData} defaultValue={formData.municipality} placeholder='金沢市' />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.municipality}</p> }
                    </div>
                    <label htmlFor='street_name'>町名</label>
                    <div>
                        <input id="street_name" type='text' name='street_name' onBlur={handleFormData} defaultValue={formData.street_name} placeholder='高坂' />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.street_name}</p> }
                    </div>
                    <label htmlFor='street_number'>町目番地</label>
                    <div>
                        <input id="street_number" type='text' name='street_number' onBlur={handleFormData} defaultValue={formData.street_number} placeholder='1-2-1' />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.street_number}</p> }
                    </div>
                    <label htmlFor='building'>建物名</label>
                    <div>
                        <input id="building" type='text' name='building' onBlur={handleFormData} defaultValue={formData.building} placeholder='メゾン金沢　101号室' />
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.building}</p> }
                    </div>
                    <div>
                        <label><input type="checkbox" onClick={handleToggle} />配送先に別の住所を指定する</label>
                    </div>
                    <div style={ toggle? { 'display': 'block' } : { 'display': 'none' } }>
                        <label htmlFor='delivery_post_code'>郵便番号</label>
                        <div>
                            <input id="delivery_post_code" type='number' name='delivery_post_code' onBlur={handleFormData} defaultValue={formData.delivery_post_code} placeholder='9200858' />
                            { errorMessage && <p style={{'color': 'red'}}>{errorMessage.delivery_post_code}</p> }
                        </div>
                        <label htmlFor='delivery_prefecture'>都道府県</label>
                        <div>
                            <input id="delivery_prefecture" type='text' name='delivery_prefecture' onBlur={handleFormData} defaultValue={formData.delivery_prefecture} placeholder='石川県' />
                            { errorMessage && <p style={{'color': 'red'}}>{errorMessage.delivery_prefecture}</p> }
                        </div>
                        <label htmlFor='delivery_municipality'>市区町村郡</label>
                        <div>
                            <input id="delivery_municipality" type='text' name='delivery_municipality' onBlur={handleFormData} defaultValue={formData.delivery_municipality} placeholder='金沢市' />
                            { errorMessage && <p style={{'color': 'red'}}>{errorMessage.delivery_municipality}</p> }
                        </div>
                        <label htmlFor='delivery_street_name'>町名</label>
                        <div>
                            <input id="delivery_street_name" type='text' name='delivery_street_name' onBlur={handleFormData} defaultValue={formData.delivery_street_name} placeholder='木ノ新保町' />
                            { errorMessage && <p style={{'color': 'red'}}>{errorMessage.delivery_street_name}</p> }
                        </div>
                        <label htmlFor='delivery_street_number'>町目番地</label>
                        <div>
                            <input id="delivery_street_number" type='text' name='delivery_street_number' onBlur={handleFormData} defaultValue={formData.delivery_street_number} placeholder='1-1' />
                            { errorMessage && <p style={{'color': 'red'}}>{errorMessage.delivery_street_number}</p> }
                        </div>
                        <label htmlFor='delivery_building'>建物名</label>
                        <div>
                            <input id="delivery_building" type='text' name='delivery_building' onBlur={handleFormData} defaultValue={formData.delivery_building} placeholder='パレス金沢　206号室' />
                            { errorMessage && <p style={{'color': 'red'}}>{errorMessage.delivery_building}</p> }
                        </div>
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
                    <div>DM登録</div>
                    <div>
                        <label><input type='radio' name='is_received' onClick={handleFormData} value={1} defaultChecked={formData.is_received === '1'} />登録する</label>
                        <label><input type='radio' name='is_received' onClick={handleFormData} value={0} defaultChecked={formData.is_received === '0'} />登録しない</label>
                        { errorMessage && <p style={{'color': 'red'}}>{errorMessage.is_received}</p> }
                    </div>
                    <button><Link to={`/admin/users`}>一覧に戻る</Link></button>
                    <button type="submit">新規登録</button>
                </form>
            </div>
        )
    );
}

export default UserCreate;
