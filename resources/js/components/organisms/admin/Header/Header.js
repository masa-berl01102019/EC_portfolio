import React, { Suspense, useState } from 'react';
import {Link} from 'react-router-dom';
import styles from './styles.module.css'
import Icon from '../../../atoms/Icon/Icon';
import { useRecoilState } from 'recoil';
import { authAdminState } from '../../../store/authState';
import { menuAdminState } from '../../../store/menuState';
import { langState } from '../../../store/langState';
import GlobalMenu from '../GlobalMenu/GlobalMenu'
import useAuth from '../../../hooks/useAuth';
import { CircularProgress } from '@material-ui/core';
import Text from '../../../atoms/Text/Text';
import useI18next from '../../../context/I18nextContext';

export const Header = ({...props}) => {
    
    const [isAdminLogin, setIsAdminLogin] = useRecoilState(authAdminState);
    const [openAdminMenu, setOpenAdminMenu] = useRecoilState(menuAdminState);
    const {data, errorMessage, handleLogout} = useAuth(`/api/admin/auth`, 'admin');
    const i18next = useI18next();
    const [openPulldown, setOpenPulldown] = useState(false);
    const [lang, setLang] = useRecoilState(langState);

    const handleChangeLanguage = e => {
        setLang(e);
        i18next.changeLanguage(e);
        localStorage.setItem('lang', e);
    }

    return (
        <Suspense fallback={<CircularProgress disableShrink />} >
        {   errorMessage && errorMessage.httpRequestError ? (
                <Text className={styles.http_error}>{errorMessage.httpRequestError}</Text>
            ) : (
                <>
                    <header {...props}>
                        <nav>
                            <ul className={[styles.header].join(' ')}>
                                <li onClick={() => setOpenAdminMenu(!openAdminMenu)} className={styles.mr_auto}>
                                    <Icon src={openAdminMenu ? "/img/close_icon_white.svg" : "/img/menu_icon.svg"} className={[styles.icon, styles.meun_icon].join(' ')} />
                                </li>
                                { isAdminLogin && 
                                    <>
                                        <Icon src='/img/account_icon.svg' className={[styles.icon, styles.account_icon].join(' ')} />
                                        <li className={[styles.text, styles.admin_name].join(' ')}>{data}</li>
                                    </>
                                }
                                <div className={styles.relative}>
                                    <Text role='reverse' className={styles.lang} onClick={() => setOpenPulldown(!openPulldown)}>{lang.toUpperCase()}</Text>
                                    {   openPulldown && 
                                        <ul className={styles.pulldown}>
                                            <li className={styles.pulldown_list} onClick={() => handleChangeLanguage('en')}>{i18next.t('common.lang-en')}</li>
                                            <li className={styles.pulldown_list} onClick={() => handleChangeLanguage('ja')}>{i18next.t('common.lang-ja')}</li>
                                        </ul>
                                    }
                                </div>
                                { isAdminLogin ? (
                                    <li onClick={() => {
                                        handleLogout({
                                            url: `/api/admin/logout`, 
                                            callback: () => setIsAdminLogin(false) 
                                        })
                                    }} className={[styles.text, styles.ml].join(' ')}>{i18next.t('admin.header.logout')}</li>
                                ) : (
                                    <Link to="/admin/login" className={[styles.text, styles.ml].join(' ')}>
                                        <li>{i18next.t('admin.header.login')}</li>
                                    </Link>
                                )}
                            </ul>
                        </nav>
                    </header>
                    { openAdminMenu && <GlobalMenu className={styles.global_menu} /> }
                </>
            )
        }
        </Suspense>
    );
}
