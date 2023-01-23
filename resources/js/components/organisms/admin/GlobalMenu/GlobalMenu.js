import React, {memo} from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import useI18next from '../../../context/I18nextContext';

const GlobalMenu = ({className}) => {

    const i18next = useI18next();

    return (
        <nav className={styles.nav_bar}>
            <ul className={[styles.menu, className].join(' ')}>
                <Link to="/admin/dashboard" className={styles.menu_link} >
                    <li>{i18next.t('admin.global-menu.dashboard')}</li>
                </Link>
                <Link to="/admin/users" className={styles.menu_link} >
                    <li>{i18next.t('admin.global-menu.user')}</li>
                </Link>
                <Link to="/admin/admins" className={styles.menu_link} >
                    <li>{i18next.t('admin.global-menu.admin')}</li>
                </Link>
                <Link to="/admin/notifications" className={styles.menu_link} >
                    <li>{i18next.t('admin.global-menu.notification')}</li>
                </Link>
                <Link to="/admin/items" className={styles.menu_link} >
                    <li>{i18next.t('admin.global-menu.item')}</li>
                </Link>
                <Link to="/admin/blogs" className={styles.menu_link} >
                    <li>{i18next.t('admin.global-menu.blog')}</li>
                </Link>
                <Link to="/admin/news" className={styles.menu_link} >
                    <li>{i18next.t('admin.global-menu.news')}</li>
                </Link>
                <Link to="/admin/orders" className={styles.menu_link} >
                    <li>{i18next.t('admin.global-menu.order')}</li>
                </Link>
                <Link to="/admin/contacts" className={styles.menu_link} >
                    <li>{i18next.t('admin.global-menu.contact')}</li>
                </Link>
                <Link to="/admin/colors" className={styles.menu_link} >
                    <li>{i18next.t('admin.global-menu.color')}</li>
                </Link>
                <Link to="/admin/brands" className={styles.menu_link} >
                    <li>{i18next.t('admin.global-menu.brand')}</li>
                </Link>
                <Link to="/admin/tags" className={styles.menu_link} >
                    <li>{i18next.t('admin.global-menu.tag')}</li>
                </Link>
                <Link to="/admin/categories" className={styles.menu_link} >
                    <li>{i18next.t('admin.global-menu.category')}</li>
                </Link>
                <Link to="/admin/sizes" className={styles.menu_link} >
                    <li>{i18next.t('admin.global-menu.size')}</li>
                </Link>
            </ul>
        </nav>
    );
};

export default GlobalMenu;
