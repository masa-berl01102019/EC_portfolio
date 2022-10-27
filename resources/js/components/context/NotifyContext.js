import React, { createContext, useState, useContext, useRef} from 'react';
import { NotifyPopup } from '../molecules/Popup/NotifyPopup';

// contextの作成
const NotifyContext = createContext();

// 呼び出し元でuseContextをわざわざ呼び出さなくて済むようにここでカスタムメソッドとして定義してエクスポート
export default function useNotify () {
    return useContext(NotifyContext);
}

// providerの作成
export function NotifyProvider ({children}) {
    // popupの初期値を制御
    const [notify, setNotify] = useState({isOpen: false});
    // コンポーネント間のレンダリングを処理をまたいで値もしくは関数を保持したい場合はuseRefが有効的
    const func = useRef();
    // 呼び出しもとに対して表示されたpopupのボタンが押されたときの返却値を受け取ってから次の処理が実行されるようにする為にpromiseを返却する
    // 呼び出しもとがhandlePromiseを実行する際はasync(非同期)の関数であることを明示的に宣言し、関数呼び出し時にawaitで返却値が返ってくるまで処理を待たせるようにする
    const handlePromise = (data) => {
        return new Promise ((resolve) => {
            setNotify({isOpen: true, ...data});
            // useRefにresolveの関数を格納
            func.current = (choice) => {
                // 引数の論理値を渡す
                resolve(choice);
                // resolve実行後にpopupを閉じる
                setNotify({isOpen: false});
            };
        });
    }

    return (
        <NotifyContext.Provider value={handlePromise}>
            {children}
            <NotifyPopup 
                title={notify?.title}
                body={notify?.body}
                confirmBtnLabel={notify?.confirmBtnLabel}
                type={notify?.type}
                isOpen={notify.isOpen}
                onClose={() => func.current(false)}
                onConfirm={() => func.current(true)}
            />
        </NotifyContext.Provider>
    );

}
