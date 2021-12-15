import React, {useState} from 'react';

// TODO 403/405/413...それぞれのエラーメッセージを設定する

const useSetErrorMsg = (initialValue) => {

    // error message管理
    const [errorMessage, setErrorMessage] = useState(initialValue);

    // API接続時のサーバー側で発生したエラーをハンドリングする関数
    const handleApiErrorMessage = (error) => {
        console.log('handleErrorMessage');
        // エラーを格納する配列の初期化
        let arrayErrors = {};
        // 422 バリデーションエラー時は複数エラーメッセージが返ってくるので条件分岐
        if(error.response.status === 422 ) {
            // 取得したエラーオブジェクトを変数に格納
            const errors = error.response.data.errors;
            // for~in で展開して配列に格納
            for (let key in errors) {
                // オブジェクトにカラム名をキーにして代入
                arrayErrors[key] = errors[key][0] ;
            }
        } else {
            // オブジェクトに格納
            arrayErrors.httpRequestError = `${error.response.status} ${error.response.data.message}`;
        }
        // エラーメッセージをセット
        setErrorMessage({...arrayErrors});
    }

    return [errorMessage, {setErrorMessage, handleApiErrorMessage}];

}

export default useSetErrorMsg;
