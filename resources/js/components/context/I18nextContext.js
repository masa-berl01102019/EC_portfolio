import React, { createContext, useContext } from 'react';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../lang/en.json';
import ja from '../lang/ja.json';
import LanguagePopup from "../molecules/Popup/LanguagePopup";

// contextの作成
const I18nextContext = createContext();

// 呼び出し元でuseContextをわざわざ呼び出さなくて済むようにここでカスタムメソッドとして定義してエクスポート
export default function useI18next () {
    return useContext(I18nextContext);
}

// providerの作成
export function I18nextProvider ({children}) {

    i18next
    .use(initReactI18next)
    .init({
        lng: localStorage.getItem('lang') || 'ja',
        debug: true,
        resources: {
            en: {
                translation: en
            },
            ja: {
                translation: ja
            }
        }
    });

    return (
        <I18nextContext.Provider value={i18next}>
            {children}
            <LanguagePopup/>
        </I18nextContext.Provider>
    );

}


