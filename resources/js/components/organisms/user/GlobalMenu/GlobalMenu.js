import React, {memo} from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authUserState } from '../../../store/authState';
import { paramState } from '../../../store/paramState';
import Text from '../../../atoms/Text/Text'

const GlobalMenu = ({authName, handleLogout}) => {

    const model = 'ITEM';
    // グローバルステート呼び出し
    const params = useRecoilValue(paramState(model));
    // login状態のステータスを取得
    const [isUserLogin, setIsUserLogin] = useRecoilState(authUserState);

    const state = {
        ...params,
        paginate: {},
        sort: { 'price' : '', 'posted_at' : 'desc' },
        filter: { 'search' : '',  'tag' : [], 'color' : [], 'size' : [], 'brand' : [], 'gender_category' : '', 'main_category' : '', 'sub_category' : '' },
        scope: model
    };

    return (
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
                    {/* TODO: 会員情報を編集しても名前が変更されない点を修正 */}
                    <Text role='title' className={[styles.memu_title, styles.mb_8].join(' ')}>{isUserLogin && authName ? `${authName} 様`: 'パーソナル'}</Text>
                    <Link to="/orders" style={{'marginBottom': '8px', 'display': 'block'}}><Text className={styles.menu_text}>購入履歴</Text></Link>
                    <Link to="/carts" style={{'marginBottom': '8px', 'display': 'block'}}><Text className={styles.menu_text}>カート</Text></Link>
                    <Link to="/bookmarks" style={{'marginBottom': '8px', 'display': 'block'}} ><Text className={styles.menu_text}>お気に入り</Text></Link>
                    <Link to="/histories" style={{'marginBottom': '8px', 'display': 'block'}} ><Text className={styles.menu_text}>閲覧履歴</Text></Link>
                    <Link to="/notifications" style={{'display': 'block'}}><Text className={styles.menu_text}>お知らせ</Text></Link>
                </li>

                <li className={styles.mb_16}>
                    <Text role='title' className={[styles.memu_title, styles.mb_8].join(' ')}>コンテンツ</Text>
                    <Link to={{pathname: "/items", state: state}} style={{'marginBottom': '8px', 'display': 'block'}}>
                        <Text className={styles.menu_text}>新着商品</Text>
                    </Link>
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

               {/* 以下はデザイン保留 */}

                {/* <li className={styles.mb_16}>
                    <Text className={[styles.mb_8, styles.search_list].join(' ')}>
                        <Text tag='span'>{authName} 様</Text>
                        <Icon src={'/img/add_icon.svg'} className={styles.add_icon}/>
                    </Text>
                    <ul>
                        <li className={styles.mb_8}><Link to="/orders"><Text tag='span'>購入履歴</Text></Link></li>
                        <li className={styles.mb_8}><Link to="/users/edit"><Text tag='span'>会員編集</Text></Link></li>
                        <li onClick={() => handleLogout({ url: `/api/user/logout`, callback: () => setIsUserLogin(false) })}><Text tag='span'>ログアウト</Text></li>
                    </ul>
                </li> */}

                {/* <li className={styles.mb_16} style={{'display': 'flex'}}>
                    <Link to="/notifications" style={{'flex': '1'}} >
                        <Icon src={'/img/notification_icon_black.svg'} className={styles.memu_icon}/>
                        <Text role='title' size='s'  className={styles.memu_icon_text}>お知らせ</Text>
                    </Link>
                    <Link to="/histories" style={{'flex': '1'}} >
                        <Icon src={'/img/done_icon.svg'} className={styles.memu_icon}/>
                        <Text role='title' size='s'  className={styles.memu_icon_text}>閲覧履歴</Text>
                    </Link>
                    <Link to="/bookmarks" style={{'flex': '1'}} >
                        <Icon src={'/img/bookmark_icon_black.svg'} className={styles.memu_icon}/>
                        <Text role='title' size='s'  className={styles.memu_icon_text}>お気に入り</Text>
                    </Link>
                    <Link to="/carts" style={{'flex': '1'}} >
                        <Icon src={'/img/shopping_cart_icon_black.svg'} className={styles.memu_icon}/>
                        <Text role='title' size='s'  className={styles.memu_icon_text}>カート</Text>
                    </Link>
                </li> */}

                {/* <li className={styles.mb_16}>
                    <Text role='title' className={[styles.memu_title, styles.mb_8].join(' ')}>サーチ</Text>
                    <Text className={[styles.mb_8, styles.search_list].join(' ')}>
                        <Text tag='span'>ブランドから探す</Text>
                        <Icon src={'/img/add_icon.svg'} className={styles.add_icon}/>
                    </Text>
                    <Text className={[styles.mb_8, styles.search_list].join(' ')}>
                        <Text tag='span'>カテゴリから探す</Text>
                        <Icon src={'/img/add_icon.svg'} className={styles.add_icon}/>
                    </Text>
                    <Text className={[styles.search_list].join(' ')}>
                        <Text tag='span'>タグから探す</Text>
                        <Icon src={'/img/add_icon.svg'} className={styles.add_icon}/>
                    </Text>
                </li> */}
            </ul>
        </nav>
    );

};

export default GlobalMenu;