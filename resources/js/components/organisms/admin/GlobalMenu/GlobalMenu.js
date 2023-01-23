import React, {memo} from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

const GlobalMenu = ({className}) => {
    return (
        <nav className={styles.nav_bar}>
            <ul className={[styles.menu, className].join(' ')}>
                <Link to="/admin/dashboard" className={styles.menu_link} >
                    <li>ダッシュボード</li>
                </Link>
                <Link to="/admin/users" className={styles.menu_link} >
                    <li>会員一覧</li>
                </Link>
                <Link to="/admin/admins" className={styles.menu_link} >
                    <li>管理者一覧</li>
                </Link>
                <Link to="/admin/notifications" className={styles.menu_link} >
                    <li>お知らせ一覧</li>
                </Link>
                <Link to="/admin/items" className={styles.menu_link} >
                    <li>商品一覧</li>
                </Link>
                <Link to="/admin/blogs" className={styles.menu_link} >
                    <li>ブログ一覧</li>
                </Link>
                <Link to="/admin/news" className={styles.menu_link} >
                    <li>ニュース一覧</li>
                </Link>
                <Link to="/admin/orders" className={styles.menu_link} >
                    <li>受注一覧</li>
                </Link>
                <Link to="/admin/contacts" className={styles.menu_link} >
                    <li>お問い合わせ一覧</li>
                </Link>
                <Link to="/admin/colors" className={styles.menu_link} >
                    <li>カラーマスタ</li>
                </Link>
                <Link to="/admin/brands" className={styles.menu_link} >
                    <li>ブランドマスタ</li>
                </Link>
                <Link to="/admin/tags" className={styles.menu_link} >
                    <li>タグマスタ</li>
                </Link>
                <Link to="/admin/categories" className={styles.menu_link} >
                    <li>カテゴリマスタ</li>
                </Link>
                <Link to="/admin/sizes" className={styles.menu_link} >
                    <li>サイズマスタ</li>
                </Link>
            </ul>
        </nav>
    );
};

export default GlobalMenu;
