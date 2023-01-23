import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useInputForm from "../../../hooks/useInputForm";
import useToggle from "../../../hooks/useToggle";
import ShowErrorMsg from "../../../ShowErrorMsg";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import jaLocale from "date-fns/locale/ja";

// TODO フロント側でのバリデーション設定
// TODO 登録後に一覧へリダイレクトして成功のメッセージを表示

function UserEdit(props) {

    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/admin/users/${props.match.params.id}/edit`;

    // チェックボックスのclickイベントで配送先住所のフォームの表示と非表示を管理
    const [toggle, {handleToggle}] = useToggle(false);

    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData}] = useInputForm({
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
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);

    // dataは{ key(APIサーバーからレスポンスを返す時に設定したkey名) : 値　}の形で返却されるので変数に代入しておく
    const user = data.user;

    const handleDateChange = (date, name) => {
        // date型に合わせてフォーマット
        let formatted_date = date !== null ? date.getFullYear() + "-" + ("00" + (date.getMonth() + 1)).slice(-2) + "-" + ("00" + date.getDate()).slice(-2) : null;
        setFormData({
            ...formData,
            [name]: formatted_date
        });
    };

    useEffect(() => {
        // 非同期で通信されるので初回読み込み時にuserが入ってこない場合があるので条件分岐してあげる
        if(user) {
            // フォームのデフォルト値を設定するためにsetUserInfoで値をセット
            setFormData({...user});
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
            <h1>会員編集</h1>
            { errorMessage && <ShowErrorMsg errorMessage={errorMessage} /> }
            {   isLoading ? (
                    <CircularProgress disableShrink />
                ): (
                    <form onSubmit={ e => {
                        e.preventDefault();
                        dispatch({type: 'UPDATE', form: formData, url: `/api/admin/users/${props.match.params.id}` });
                    }}>
                        <div>氏名</div>
                        <div>
                            <input type='text' name='last_name' onBlur={handleFormData} defaultValue={formData.last_name} placeholder='田中'/>
                            <input type='text' name='first_name' onBlur={handleFormData} defaultValue={formData.first_name} placeholder='太郎
                            '/>
                        </div>
                        <div>氏名(カナ)</div>
                        <div>
                            <input type='text' name='last_name_kana' onBlur={handleFormData} defaultValue={formData.last_name_kana} />
                            <input type='text' name='first_name_kana' onBlur={handleFormData} defaultValue={formData.first_name_kana} />
                        </div>
                        <div>性別</div>
                        <div>
                            <label><input type='radio' name='gender' onClick={handleFormData} value={0} defaultChecked={formData.gender === 0 } />男性</label>
                            <label><input type='radio' name='gender' onClick={handleFormData} value={1} defaultChecked={formData.gender === 1 } />女性</label>
                            <label><input type='radio' name='gender' onClick={handleFormData} value={2} defaultChecked={formData.gender === 2 } />その他</label>
                            <label><input type='radio' name='gender' onClick={handleFormData} value={3} defaultChecked={formData.gender === 3 } />未回答</label>
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
                                        handleDateChange(e, 'birthday')
                                    }}
                                    placeholder='1991/01/01'
                                />
                            </MuiPickersUtilsProvider>
                            {/*<input id="birthday" type='date' name='birthday' onBlur={handleFormData} defaultValue={formData.birthday} />*/}
                        </div>
                        <label htmlFor='post_code'>郵便番号</label>
                        <div>
                            <input id="post_code" type='number' name='post_code' onBlur={handleFormData} defaultValue={formData.post_code} />
                        </div>
                        <label htmlFor='prefecture'>都道府県</label>
                        <div>
                            <input id="prefecture" type='text' name='prefecture' onBlur={handleFormData} defaultValue={formData.prefecture} />
                        </div>
                        <label htmlFor='municipality'>市区町村郡</label>
                        <div>
                            <input id="municipality" type='text' name='municipality' onBlur={handleFormData} defaultValue={formData.municipality} />
                        </div>
                        <label htmlFor='street_name'>町名</label>
                        <div>
                            <input id="street_name" type='text' name='street_name' onBlur={handleFormData} defaultValue={formData.street_name} />
                        </div>
                        <label htmlFor='street_number'>町目番地</label>
                        <div>
                            <input id="street_number" type='text' name='street_number' onBlur={handleFormData} defaultValue={formData.street_number} />
                        </div>
                        <label htmlFor='building'>建物名</label>
                        <div>
                            <input id="building" type='text' name='building' onBlur={handleFormData} defaultValue={formData.building} />
                        </div>
                        <div>
                            <label><input type="checkbox" onClick={handleToggle} />配送先に別の住所を指定する</label>
                        </div>
                        <div style={ toggle? { 'display': 'block' } : { 'display': 'none' } }>
                            <label htmlFor='delivery_post_code'>郵便番号</label>
                            <div>
                                <input id="delivery_post_code" type='number' name='delivery_post_code' onBlur={handleFormData} defaultValue={formData.delivery_post_code} />
                            </div>
                            <label htmlFor='delivery_prefecture'>都道府県</label>
                            <div>
                                <input id="delivery_prefecture" type='text' name='delivery_prefecture' onBlur={handleFormData} defaultValue={formData.delivery_prefecture} />
                            </div>
                            <label htmlFor='delivery_municipality'>市区町村郡</label>
                            <div>
                                <input id="delivery_municipality" type='text' name='delivery_municipality' onBlur={handleFormData} defaultValue={formData.delivery_municipality} />
                            </div>
                            <label htmlFor='delivery_street_name'>町名</label>
                            <div>
                                <input id="delivery_street_name" type='text' name='delivery_street_name' onBlur={handleFormData} defaultValue={formData.delivery_street_name} />
                            </div>
                            <label htmlFor='delivery_street_number'>町目番地</label>
                            <div>
                                <input id="delivery_street_number" type='text' name='delivery_street_number' onBlur={handleFormData} defaultValue={formData.delivery_street_number} />
                            </div>
                            <label htmlFor='delivery_building'>建物名</label>
                            <div>
                                <input id="delivery_building" type='text' name='delivery_building' onBlur={handleFormData} defaultValue={formData.delivery_building} />
                            </div>
                        </div>
                        <label htmlFor='tel'>電話番号</label>
                        <div>
                            <input id="tel" type='tel' name='tel' onBlur={handleFormData} defaultValue={formData.tel} />
                        </div>
                        <label htmlFor='email'>メールアドレス</label>
                        <div>
                            <input id="email" type='email' name='email' onBlur={handleFormData} defaultValue={formData.email} />
                        </div>
                        <div>DM登録</div>
                        <div>
                            <label><input type='radio' name='is_received' onClick={handleFormData} value={1} defaultChecked={formData.is_received === 1} />登録する</label>
                            <label><input type='radio' name='is_received' onClick={handleFormData} value={0} defaultChecked={formData.is_received === 0} />登録しない</label>
                        </div>
                        <button><Link to={`/admin/users`}>一覧に戻る</Link></button>
                        <button type="submit">更新する</button>
                    </form>
                )
            }
        </div>
    );
}

export default UserEdit;
