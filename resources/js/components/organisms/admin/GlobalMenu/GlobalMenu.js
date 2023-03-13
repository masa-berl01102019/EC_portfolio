import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { useTranslation } from 'react-i18next';
import { CONST } from '../../../constants/constants';

const GlobalMenu = ({ className, closeMethod }) => {

  const { t } = useTranslation();

  const handleCloseMenu = () => {
    if (window.innerWidth < CONST.BREAK_POINT.TABLET) {
      closeMethod();
    }
  }

  return (
    <nav className={styles.nav_bar}>
      <ul className={[styles.menu, className].join(' ')}>
        <Link onClick={handleCloseMenu} to="/admin/dashboard" className={styles.menu_link} >
          <li>{t('admin.global-menu.dashboard')}</li>
        </Link>
        <Link onClick={handleCloseMenu} to="/admin/users" className={styles.menu_link} >
          <li>{t('admin.global-menu.user')}</li>
        </Link>
        <Link onClick={handleCloseMenu} to="/admin/admins" className={styles.menu_link} >
          <li>{t('admin.global-menu.admin')}</li>
        </Link>
        <Link onClick={handleCloseMenu} to="/admin/notifications" className={styles.menu_link} >
          <li>{t('admin.global-menu.notification')}</li>
        </Link>
        <Link onClick={handleCloseMenu} to="/admin/items" className={styles.menu_link} >
          <li>{t('admin.global-menu.item')}</li>
        </Link>
        <Link onClick={handleCloseMenu} to="/admin/blogs" className={styles.menu_link} >
          <li>{t('admin.global-menu.blog')}</li>
        </Link>
        <Link onClick={handleCloseMenu} to="/admin/news" className={styles.menu_link} >
          <li>{t('admin.global-menu.news')}</li>
        </Link>
        <Link onClick={handleCloseMenu} to="/admin/orders" className={styles.menu_link} >
          <li>{t('admin.global-menu.order')}</li>
        </Link>
        <Link onClick={handleCloseMenu} to="/admin/contacts" className={styles.menu_link} >
          <li>{t('admin.global-menu.contact')}</li>
        </Link>
        <Link onClick={handleCloseMenu} to="/admin/colors" className={styles.menu_link} >
          <li>{t('admin.global-menu.color')}</li>
        </Link>
        <Link onClick={handleCloseMenu} to="/admin/brands" className={styles.menu_link} >
          <li>{t('admin.global-menu.brand')}</li>
        </Link>
        <Link onClick={handleCloseMenu} to="/admin/tags" className={styles.menu_link} >
          <li>{t('admin.global-menu.tag')}</li>
        </Link>
        <Link onClick={handleCloseMenu} to="/admin/categories" className={styles.menu_link} >
          <li>{t('admin.global-menu.category')}</li>
        </Link>
        <Link onClick={handleCloseMenu} to="/admin/sizes" className={styles.menu_link} >
          <li>{t('admin.global-menu.size')}</li>
        </Link>
      </ul>
    </nav>
  );
};

export default GlobalMenu;
