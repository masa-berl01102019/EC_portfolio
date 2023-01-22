import React, { createContext, useState, useContext, useRef} from 'react';
import { ToastifyPopup } from '../molecules/Popup/ToastifyPopup';

const ToastifyContext = createContext();

export default function useToastify () {
    return useContext(ToastifyContext);
}

export function ToastifyProvider ({children}) {

    const [toastify, setToastify] = useState({isOpen: false});

    const handleToast = (data) => {
        // Open popup
        setToastify({isOpen: true, ...data});
        // Close it after 3 minutes
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


