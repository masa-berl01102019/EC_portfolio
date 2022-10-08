import React, { Suspense } from 'react';
import {Link} from 'react-router-dom';
import styles from './styles.module.css'
import Icon from '../../../atoms/Icon/Icon';
import { useRecoilState } from 'recoil';
import { authAdminState } from '../../../store/authState';
import { menuAdminState } from '../../../store/menuState';
import GlobalMenu from '../GlobalMenu/GlobalMenu'
import useAuth from '../../../hooks/useAuth';
import { CircularProgress } from '@material-ui/core';
import Text from '../../../atoms/Text/Text';

export const Header = ({...props}) => {
    
    // login状態のステータスを取得
    const [isAdminLogin, setIsAdminLogin] = useRecoilState(authAdminState);
    // メニューの状態を管理
    const [openAdminMenu, setOpenAdminMenu] = useRecoilState(menuAdminState);
    // authの管理
    const {data, errorMessage, handleLogout} = useAuth(`/api/admin/auth`, 'admin');

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
                                { !isAdminLogin ? (
                                    <Link to="/admin/login" className={[styles.text, styles.ml].join(' ')}>
                                        <li>ログイン</li>
                                    </Link>
                                ) : (
                                    <>
                                        <Icon src='/img/account_icon.svg' className={[styles.icon, styles.account_icon].join(' ')} />
                                        {data && <li className={styles.text}>{data}</li>}
                                        <li onClick={() => {
                                            handleLogout({
                                                url: `/api/admin/logout`, 
                                                callback: () => setIsAdminLogin(false) 
                                            })
                                        }}  className={[styles.text, styles.ml].join(' ')}>ログアウト</li>
                                    </>
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
