import {useEffect, useReducer, useState} from "react";
import axios from "axios";
import {useCreateUrl} from "./useCreateUrl";
import {useDownloadCsv, getFileName} from "./useDownloadCsv";
import useSetErrorMsg from "./useSetErrorMsg";
import {dataFetchReducer} from "../reducer/dataFetchReducer";
import { useParamsContext } from '../context/ParamsContext';

const useFetchApiData = (initialUrl, initialMethod, initialData) => {

    // useFetchApiData()で呼び出された際に渡された引数をreducerの初期値として設定
    const initialState = {
        url: initialUrl,
        method: initialMethod,
        data: initialData,
    };
    // useReducerでreducer関数と初期値をセット
    const [state, dispatch] = useReducer(dataFetchReducer, initialState);
    // useContextで管理してるURLパラメータを呼び出し
    const {params} = useParamsContext();
    // API接続時の状態遷移(error/loading)と取得したデータと直前にコールしたAPIのURLを管理
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, {setErrorMessage, handleApiErrorMessage}] = useSetErrorMsg(null);
    const [data, setData] = useState([]);
    const [prevUrl, setPrevUrl] = useState('');

    useEffect(() => {
        console.log('useFetchApiDataのuseEffectが呼ばれました');
        // クリーンアップ関数用のフラグを宣言
        let unmounted = false;
        // アンマウントされていなかったら
        if(!unmounted) {
            // 非同期でAPIサーバーからデータを取得する関数式を定義
            const fetchData = async() => {
                // エラーの初期化
                setErrorMessage(null);
                // ローディングアイコンスタート
                setIsLoading(true);
                // 非同期通信
                await axios({
                    method: state.method, url: state.url, data: state.data
                }).then(response => {
                    console.log('取得成功したデータは',response.data);
                    // CSVダウンロード時には再描画を走らせたくないのでresponseヘッダのcontent-type形式がCSVかどうかで条件分岐
                    if(response.headers['content-type'].includes('text/csv')) {
                        // CSVのファイル名はHTTPレスポンスヘッダーのcontent-dispositionに格納されてるので取得
                        const contentDisposition = response.headers['content-disposition'];
                        // ファイル名を取得
                        const fileName = getFileName(contentDisposition)
                        // CSVを出力
                        useDownloadCsv(response.data, fileName)
                    } else {
                        // APIから取得したデータをセット
                        setData(response.data);
                    }
                }).catch( error => {
                    // errorメッセージのセット
                    handleApiErrorMessage(error);
                }).finally ( () => {
                    // axiosの処理結果によらずいつも実行させたい処理を記述
                    console.log('axios処理終了');
                });

                // ローディングアイコンストップ
                setIsLoading(false);
            };
            console.log(useCreateUrl(initialUrl, params), params);
            // 条件に応じて非同期通信の呼び出しの制御
            if(state.method === 'get' && !initialUrl.includes('edit') && !initialUrl.includes('create') && state.url !== useCreateUrl(initialUrl, params)) {
                console.log('パラメータ変更検知');
                // 直前のAPIコールのURLを保存
                setPrevUrl(useCreateUrl(initialUrl, params));
                // パラメータの変更をキャッチしたのでパラメータ付きのURLでAPIの呼び出し
                dispatch({type: 'READ', url: useCreateUrl(initialUrl,params)});
            }  else if (state.url.includes('csv') && prevUrl !== useCreateUrl(initialUrl, params)) {
                console.log('パラメータ変更検知2')
                // 直前のAPIコールのURLを保存
                setPrevUrl(useCreateUrl(initialUrl, params));
                // CSVダウンロードの処理後は再描画をかけない仕様にしてるのでstate.urlが更新されずパラメータを付与したURLとの差を比較出来ないので直前にAPIコールしたURLとの差を比較して差分があればAPIの呼び出し
                dispatch({type: 'READ', url: useCreateUrl(initialUrl,params)});
            } else {
                // 直前のAPIコールのURLを保存
                setPrevUrl(useCreateUrl(initialUrl, params));
                // 非同期通信の呼び出し
                fetchData();
            }
        }
        // クリーンアップ関数を返す
        return () => { unmounted = true; };
    },[state.url, state.data, params]); // API接続時に渡すurlとデータとurlパラメータ変更時に再度実行

    // 画面描画に必要なエラー/ローディングアイコンの状態とアクションを呼び出すためのdispatch関数を返り値として返却
    return [{isLoading, errorMessage, data}, dispatch];
}

export default useFetchApiData;

// useEffect利用時の注意点
// ライフサイクルの観点では、 useEffect はcomponentDidMount と componentDidUpdate と componentWillUnmountがまとまったもの
// useEffectは、第一引数にcallbackを入れて、第二引数に依存する値の配列を入れる
// 依存する値が変更される度にcallbackが実行される
// コールバックの中にasync関数やPromiseはいれられない
// useEffectの戻り値はundefinedかクリーンアップ関数でなくていけないから
// 非同期処理を書く場合、コンポーネントが削除された後にコールバックが呼ばれる場合があり、コンポーネントのステートを変更しようとするとワーニングが出るからフラグで管理する
