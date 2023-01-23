import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import useFetchApiData from "../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import useInputForm from "../../hooks/useInputForm";
import ShowErrorMsg from "../../ShowErrorMsg";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import jaLocale from "date-fns/locale/ja";

// TODO フロント側でのバリデーション設定
// TODO 登録後に一覧へリダイレクトして成功のメッセージを表示
// TODO handleDateChangeをhooksに切り分け

function NotificationEdit(props) {

    // urlの設定 * propsで渡ってきたIDを初期URLにセット
    const baseUrl = `/api/admin/notifications/${props.match.params.id}/edit`;

    // フォーム項目の初期値をuseStateで管理
    const [formData, {setFormData, handleFormData}] = useInputForm({
        'title': null,
        'body': null,
        'is_published': '',
        'expired_at': null // 0: 非公開　1: 公開中
    });

    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);

    // dataは{ key(APIサーバーからレスポンスを返す時に設定したkey名) : 値　}の形で返却されるので変数に代入しておく
    const notification = data.notification;

    const handleDateChange = (date, name) => {
        // date型に合わせてフォーマット
        let formatted_date = date !== null ? date.getFullYear() + "-" + ("00" + (date.getMonth() + 1)).slice(-2) + "-" + ("00" + date.getDate()).slice(-2) : null;
        setFormData({
            ...formData,
            [name]: formatted_date
        });
    };

    useEffect(() => {
        // 非同期で通信されるので初回読み込み時にnotificationが入ってこない場合があるので条件分岐してあげる
        if(notification) {
            // フォームのデフォルト値を設定するためにsetFormDataで値をセット
            setFormData({...notification});
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
            <h1>お知らせ編集</h1>
            { errorMessage && <ShowErrorMsg errorMessage={errorMessage} /> }
            {   isLoading ? (
                    <CircularProgress disableShrink />
                ): (
                    <form onSubmit={ e => {
                        e.preventDefault();
                        dispatch({type: 'UPDATE', form: formData, url: `/api/admin/notifications/${props.match.params.id}` });
                    }}>
                        <div>タイトル</div>
                        <div>
                            <input type='text' name='title' onBlur={handleFormData} defaultValue={formData.title} placeholder='タイトル名' style={{'width': '100%'}} />
                        </div>
                        <div>本文</div>
                        <div>
                            <textarea name='body' onBlur={handleFormData} defaultValue={formData.body} placeholder='本文を入力' style={{'width': '100%', 'height': '250px'}} />
                        </div>
                        <label>公開設定
                            <select name='is_published' value={formData.is_published} onChange={handleFormData}>
                                <option value={0}>非公開</option>
                                <option value={1}>公開</option>
                            </select>
                        </label>
                        <div>
                            <label htmlFor='expired_at'>掲載終了日</label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
                                <KeyboardDatePicker
                                    id='expired_at'
                                    format='yyyy/MM/dd'
                                    disableToolbar // 年月日の選択時に上部に選択されるtoolbarを非表示にする
                                    variant="dialog" // modal形式でのカレンダーの表示
                                    inputVariant="outlined" // inputっぽい表示
                                    openTo="year" // カレンダーアイコンクリック時に年->月->日の順に選択出来るように設定
                                    views={["year", "month", "date"]}
                                    value={formData.expired_at}
                                    onChange={e => {
                                        handleDateChange(e, 'expired_at')
                                    }}
                                    placeholder='1991/01/01'
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                        <button><Link to={`/admin/notifications`}>一覧に戻る</Link></button>
                        <button type="submit">編集</button>
                    </form>
                )
            }
        </div>
    );
}

export default NotificationEdit;
