import {useQuery, useMutation} from 'react-query';
import axios from "axios";
import useSetErrorMsg from "./useSetErrorMsg";

const useAuth2 = (url, auth) => {
    // error ハンドリング
    const [errorMessage, {setErrorMessage, handleApiErrorMessage}] = useSetErrorMsg(null);

    // CSRF初期化の関数
    const initialCSRF = () => axios({ method: 'get', url: '/sanctum/csrf-cookie' }).then(res => console.log('CSRF初期化 成功', res.data)).catch(err => console.log('CSRF初期化 失敗', err));

    // Login check
    const {data : {data}} = useQuery(
        [auth, url],
        async () => {
            setErrorMessage(null);
            await initialCSRF();
            return await axios({ method: 'get', url: url });
        },
        { 
            onSuccess: (res) => console.log('success', res.data),
            onError: (err) =>  handleApiErrorMessage(err)
        }
    );
    // Login method
    const {mutate: handleLogin} = useMutation(
        async ({url, form, headers}) => {
            setErrorMessage(null);
            await initialCSRF();
            console.log('ログイン処理が呼ばれた', url, form, headers);
            return await axios({ method: 'post', url: url, data: form, headers: headers });
        },
        { 
            onSuccess: (res, obj) => {
                // 成功後のアクションをcallback関数として引数で受け取りあれば実行
                const {callback} = obj;
                callback !== undefined && callback();
            },
            onError: (err) => handleApiErrorMessage(err),
        }
    );
    // Logout method
    const {mutate: handleLogout} = useMutation(
        async ({url, form, headers}) => {
            setErrorMessage(null);
            await initialCSRF();
            console.log('ログアウト処理が呼ばれた', url, form, headers);
            return await axios({ method: 'post', url: url, data: form, headers: headers });
        },
        { 
            onSuccess: (res, obj) => {
                // 成功後のアクションをcallback関数として引数で受け取りあれば実行
                const {callback} = obj;
                callback !== undefined && callback();
            },
            onError: (err) => handleApiErrorMessage(err),
        }
    );

    return {data, errorMessage, handleLogin, handleLogout};
};

export default useAuth2;

