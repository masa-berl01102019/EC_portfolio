import {useEffect, useReducer, useState} from "react";
import axios from "axios";

const DataFetchApi = (initialUrl, initialMethod, initialData) => {

    // DataFetchApi()で呼び出された際に渡された引数をreducerの初期値として設定
    const initialState = {
        url: initialUrl,
        method: initialMethod,
        data: initialData
    };

    // reducer関数の処理を設定
    const dataFetchReducer = (state, action) => {
        console.log('dataFetchReducerが読み込まれました');

        switch(action.type) {
            case 'CREATE':
                return {
                    url: action.url, // POST '/api/admin/users'
                    method: 'post',
                    data: action.form
                };
            case 'READ':
                return {
                    url: action.url, // GET '/api/admin/users' or '/api/admin/users/create' or '/api/admin/users/{id}' or `/api/admin/users/{id}/edit`
                    method: 'get'
                };
            case 'UPDATE':
                return {
                    url: action.url, // PUT `/api/admin/users/{id}`
                    method: 'put',
                    data: action.form
                };
            case 'DELETE':
                return {
                    url:  action.url , // DELETE '/api/admin/users/delete'
                    method: 'delete',
                    data: action.data
                };
            default:
                return state
        }
    };

    // useReducerでreducer関数と初期値をセット
    const [state, dispatch] = useReducer(dataFetchReducer, initialState);

    // API接続時の状態遷移をuseStateで管理
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // API通信の返り値の管理
    const [data, setData] = useState([]);

    // ライフサイクルの観点では、 useEffect はcomponentDidMount と componentDidUpdate と componentWillUnmountがまとまったもの
    // useEffectは、第一引数にcallbackを入れて、第二引数に依存する値の配列を入れる
    // 依存する値が変更される度にcallbackが実行される
    // コールバックの中にasync関数やPromiseはいれられない
    // useEffectの戻り値はundefinedかクリーンアップ関数でなくていけないから
    // 非同期処理を書く場合、コンポーネントが削除された後にコールバックが呼ばれる場合があります。この時、コンポーネントのステートを変更しようとするとワーニングが出るのでフラグで管理する
    useEffect(() => {
        console.log('DataFetchApiのuseEffectが呼ばれました');
        // アンマウントのフラグを宣言
        let unmounted = false;
        // アンマウントされていなかったら
        if(!unmounted) {
            // 非同期でAPIサーバーからユーザー情報を取得する関数式を定義
            const fetchData = async() => {
                // エラーの初期化
                setErrorMessage(null);
                // ローディングアイコンスタート
                setIsLoading(true);

                await axios({ method: state.method, url: state.url, data: state.data
                }).then(response => {
                    console.log('取得成功したデータは',response.data);
                    // CSVダウンロード時には再描画を走らせたくないので
                    if(response.headers['content-type'].includes('text/csv')) { // responseヘッダのcontent-typeの形式がCSVか条件分岐
                        console.log('yes');
                        //ダウンロードするCSVファイル名を指定する
                        const filename = '顧客情報出力.csv';
                        //BOMを付与する（Excelでの文字化け対策）
                        const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
                        //Blobでデータを作成する
                        const blob = new Blob([bom, response.data], { type: "text/csv" });
                        //ダウンロード用にリンクを作成する
                        const link = document.createElement('a');
                        //BlobからオブジェクトURLを作成してリンク先に指定する
                        link.href = window.URL.createObjectURL(blob);
                        //download属性にファイル名を指定する
                        link.download = filename;
                        //作成したリンクをクリックしてダウンロードを実行する
                        link.click();
                        //createObjectURLで作成したオブジェクトURLを開放する
                        window.URL.revokeObjectURL(link.href);
                    } else {
                        // ユーザー情報をセット
                        setData(response.data);
                    }
                }).catch( error => {
                    // エラーに関しては文言も含めて別のコンポーネントに後でまとめる
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
                }).finally ( () => {
                    // axiosの処理結果によらずいつも実行させたい処理を記述
                    console.log('axios処理終了');
                });

                // ローディングアイコンストップ
                setIsLoading(false);
            };
            // 呼び出し
            fetchData();
        }
        // クリーアップ関数を返す
        return () => { unmounted = true; };
    },[state.url,state.data]); // urlとデータ変更時に再度実行

    // 画面描画に必要なエラー/ローディングアイコンの状態とアクションを呼び出すためのdispatch関数を返り値として返却
    return [{isLoading, errorMessage, data}, dispatch];

}

export default DataFetchApi;
