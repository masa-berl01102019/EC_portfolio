import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function useAuthContext() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    // USER認証ステータスのstateをセット
    const [isUserLogin, setIsUserLogin] = useState(false);
    // ADMIN認証ステータスのstateをセット
    const [isAdminLogin, setIsAdminLogin] = useState(false);

    // 値とメソッドを代入
    const value = {
        isUserLogin,
        setIsUserLogin,
        isAdminLogin,
        setIsAdminLogin
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
