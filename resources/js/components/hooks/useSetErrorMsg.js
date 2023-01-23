import React, {useState} from 'react';
import useToastify from '../context/ToastifyContext';

const useSetErrorMsg = (initialValue) => {

    const toastify =useToastify();

    // error message管理
    const [errorMessage, setErrorMessage] = useState(initialValue);

    // API接続時のサーバー側で発生したエラーをハンドリングする関数
    const handleApiErrorMessage = (error) => {
        console.log('handleErrorMessage', error.response.status, error.response.data);
        // エラーを格納する配列の初期化
        let arrayErrors = {};
        // 422 バリデーションエラー時は複数エラーメッセージが返ってくるので条件分岐
        if(error.response.status === 422 ) {
            // 取得したエラーオブジェクトを変数に格納
            const errors = error.response.data.errMessage;
            // for~in で展開して配列に格納
            for (let key in errors) {
                // オブジェクトにカラム名をキーにして代入
                arrayErrors[key] = errors[key] ;
            }
        } else {
            // オブジェクトに格納
            toastify({message: error.response.data.message, type: 'error'});
        }
        // エラーメッセージをセット
        setErrorMessage({...arrayErrors});
    }

    return [errorMessage, {setErrorMessage, handleApiErrorMessage}];

}

export default useSetErrorMsg;
