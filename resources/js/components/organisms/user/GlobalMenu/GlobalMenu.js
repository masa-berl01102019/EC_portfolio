import React, {memo} from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { useRecoilState } from 'recoil';
import { authUserState } from '../../../store/authState';
import Text from '../../../atoms/Text/Text'
import useAuth from '../../../hooks/useAuth';

const GlobalMenu = () => {
    
    // login状態のステータスを取得
    const [isUserLogin, setIsUserLogin] = useRecoilState(authUserState);
    // authの管理
    const {data, errorMessage, handleLogout} = useAuth(`/api/user/auth`, 'user');

    return (
        <>  
        {   errorMessage && errorMessage.httpRequestError ? 
            (
                <Text role='error'>{errorMessage.httpRequestError}</Text>
            ) : (
                <nav className={styles.nav_bar}>
                    <ul>
                        <li className={styles.mb_16}>
                            <Link to="/">
                                <Text role='title' style={{'fontWeight': 'bold'}}>
                                    LARAVEL APP
                                </Text>
                            </Link>
                        </li>
        
                        {   !isUserLogin ? (
                            <li className={styles.mb_16}>
                                <Link to="/user/login" style={{'marginRight': '16px'}}>
                                    <Text tag='span' className={styles.menu_text2}>ログイン</Text>
                                </Link>
                                <Link to="/users/create">
                                    <Text tag='span' className={styles.menu_text2}>会員登録</Text>
                                </Link>
                            </li>
                        ) : (
                            <li className={styles.mb_16}>
                                <Link to="/user/login" style={{'marginRight': '16px'}}>
                                    <Text tag='span' className={styles.menu_text2} onClick={() => handleLogout({ url: `/api/user/logout`, callback: () => setIsUserLogin(false) })} >ログアウト</Text>
                                </Link>
                                <Link to="/users/edit">
                                    <Text tag='span' className={styles.menu_text2}>会員編集</Text>
                                </Link>
                            </li>
                        )}
        
                        <li className={styles.mb_16}>
                            <Text role='title' className={[styles.memu_title, styles.mb_8].join(' ')}>{isUserLogin && data ? `${data} 様`: 'パーソナル'}</Text>
                            <Link to="/orders" style={{'marginBottom': '8px', 'display': 'block'}}><Text className={styles.menu_text}>購入履歴</Text></Link>
                            <Link to="/carts" style={{'marginBottom': '8px', 'display': 'block'}}><Text className={styles.menu_text}>カート</Text></Link>
                            <Link to="/bookmarks" style={{'marginBottom': '8px', 'display': 'block'}} ><Text className={styles.menu_text}>お気に入り</Text></Link>
                            <Link to="/histories" style={{'marginBottom': '8px', 'display': 'block'}} ><Text className={styles.menu_text}>閲覧履歴</Text></Link>
                            <Link to="/notifications" style={{'display': 'block'}}><Text className={styles.menu_text}>お知らせ</Text></Link>
                        </li>
        
                        <li className={styles.mb_16}>
                            <Text role='title' className={[styles.memu_title, styles.mb_8].join(' ')}>コンテンツ</Text>
                            <Link to="/items/new" style={{'marginBottom': '8px', 'display': 'block'}}><Text className={styles.menu_text}>新着商品</Text></Link>
                            <Link to="/items/recommend" style={{'marginBottom': '8px', 'display': 'block'}} ><Text className={styles.menu_text}>おすすめ商品</Text></Link>
                            <Link to="/items/rank" style={{'marginBottom': '8px', 'display': 'block'}} ><Text className={styles.menu_text}>ランキング</Text></Link>
                            <Link to="/news"  style={{'marginBottom': '8px', 'display': 'block'}}><Text className={styles.menu_text}>ニュース</Text></Link>
                            <Link to="/blogs" style={{'display': 'block'}}><Text className={styles.menu_text}>ブログ</Text></Link>
                        </li>
        
                        <li>
                            <Text role='title' className={[styles.memu_title, styles.mb_8].join(' ')}>ヘルプ</Text>
                            <Link to="/" style={{'marginBottom': '8px', 'display': 'block'}}><Text className={styles.menu_text}>利用ガイド</Text></Link>
                            <Link to="/contacts" style={{'display': 'block'}}><Text className={styles.menu_text}>お問い合わせ</Text></Link>
                        </li>
                    </ul>
                </nav>
            )
        }
        </>
    );

};

export default GlobalMenu;