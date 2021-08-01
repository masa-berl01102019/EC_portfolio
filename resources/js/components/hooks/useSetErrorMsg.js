import React, {useState} from 'react';

const useSetErrorMsg = (initialValue) => {

    // error message管理
    const [errorMessage, setErrorMessage] = useState(initialValue);

    // API接続時のサーバー側で発生したエラーをハンドリングする関数
    const handleApiErrorMessage = (error) => {
        console.log('handleErrorMessage');
        // エラーを格納する配列の初期化
        const arrayErrors = [];
        // 422 バリデーションエラー時は複数エラーメッセージが返ってくるので条件分岐
        if(error.response.status === 422 ) {
            // 取得したエラーオブジェクトを変数に格納
            const errors = error.response.data.errors;
            // for~in で展開して配列に格納
            for (let key in errors) {
                arrayErrors.push(errors[key][0]);
            }
        } else {
            // 配列に格納
            arrayErrors.push(`${error.response.status} ${error.response.statusText}`);
        }
        // エラーメッセージをセット
        setErrorMessage([...arrayErrors]);
    }

    return [errorMessage, {setErrorMessage, handleApiErrorMessage}];

}

export default useSetErrorMsg;
