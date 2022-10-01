import React from 'react';
import axios from "axios";
import useSetErrorMsg from "./useSetErrorMsg";
import { authAdminState, authUserState } from '../store/authState';
import { useSetRecoilState } from 'recoil';

const useAuth = (auth) => {
    // グローバルステートの呼び出し
    const setIsUserLogin = useSetRecoilState(authUserState);
    const setIsAdminLogin = useSetRecoilState(authAdminState);
    // 非同期通信のエラーハンドリング用 hooksの呼び出し
    const [errorMessage, {handleApiErrorMessage}] = useSetErrorMsg(null);

    const handleLogin = async (formData) => {

        // CSRFトークンの初期化してからログイン処理
        await axios({method: 'get', url: '/sanctum/csrf-cookie'}).then(res => {
            // ログイン処理
            axios.post(`/api/${auth}/login`, formData).then(res => {
                // 渡ってきたauth名を判定してログインステータス変更 * ログイン成功時にサーバーからtrueが返ってくるのでsetIsLogin()にtrueをセット
                if(auth === 'user') {
                    setIsUserLogin(res.data.success);
                } else {
                    setIsAdminLogin(res.data.success);
                }
            }).catch( error => {
                handleApiErrorMessage(error);
            });
        }).catch( error => {
            handleApiErrorMessage(error);
        });
    }

    const handleLogout = async () => {

        await axios.post(`/api/${auth}/logout`).then(res => {
            // 渡ってきたauth名を判定してログインステータス変更 * ログアウト成功時にサーバーからtrueが返ってくるのでsetIsLogin()にfalseをセット
            if(auth === 'user') {
                setIsUserLogin(!res.data.success);
            } else {
                setIsAdminLogin(!res.data.success);
            }
        }).catch( error => {
            handleApiErrorMessage(error);
        });
    }

    return {errorMessage, handleLogin, handleLogout};
};

export default useAuth;

