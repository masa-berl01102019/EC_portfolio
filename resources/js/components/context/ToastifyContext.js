import React, { createContext, useState, useContext, useRef} from 'react';
import { ToastifyPopup } from '../molecules/Popup/ToastifyPopup';

// contextの作成
const ToastifyContext = createContext();

// 呼び出し元でuseContextをわざわざ呼び出さなくて済むようにここでカスタムメソッドとして定義してエクスポート
export default function useToastify () {
    return useContext(ToastifyContext);
}

// providerの作成
export function ToastifyProvider ({children}) {
    // popupの初期値を制御
    const [toastify, setToastify] = useState({isOpen: false});

    const handleToast = (data) => {
        // popupを開く
        setToastify({isOpen: true, ...data});
        // 3秒後に消える
        setTimeout(() => {
            setToastify({isOpen: false});
        }, 3000);
    }

    return (
        <ToastifyContext.Provider value={handleToast}>
            {children}
            <ToastifyPopup 
                message={toastify?.message}
                type={toastify?.type}
                isOpen={toastify.isOpen}
                onClose={() => setToastify({isOpen: false})}
            />
        </ToastifyContext.Provider>
    );

}


