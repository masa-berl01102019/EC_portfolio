import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { useRecoilState } from 'recoil';
import { authUserState } from '../../../store/authState';
import Text from '../../../atoms/Text/Text'
import useAuth from '../../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const GlobalMenu = memo(() => {

  const [isUserLogin, setIsUserLogin] = useRecoilState(authUserState);
  const { data, errorMessage, handleLogout } = useAuth(`/api/user/auth`, 'user');
  const { t } = useTranslation();

  return (
    <>
      {errorMessage && errorMessage.httpRequestError ?
        (
          <Text role='error'>{errorMessage.httpRequestError}</Text>
        ) : (
          <nav className={styles.nav_bar}>
            <ul>
              <li className={styles.mb_16}>
                <Link to="/">
                  <Text role='title' style={{ 'fontWeight': 'bold' }}>
                    EC APP
                  </Text>
                </Link>
              </li>

              {!isUserLogin ? (
                <li className={styles.mb_16}>
                  <Link to="/user/login" style={{ 'marginRight': '16px' }}>
                    <Text tag='span' className={styles.menu_text2}>{t('user.global-menu.login')}</Text>
                  </Link>
                  <Link to="/users/create">
                    <Text tag='span' className={styles.menu_text2}>{t('user.global-menu.register-user')}</Text>
                  </Link>
                </li>
              ) : (
                <li className={styles.mb_16}>
                  <Link to="/user/login" style={{ 'marginRight': '16px' }}>
                    <Text
                      tag='span'
                      className={styles.menu_text2}
                      onClick={() => handleLogout({ url: `/api/user/logout`, callback: () => setIsUserLogin(false) })}
                    >
                      {t('user.global-menu.logout')}
                    </Text>
                  </Link>
                  <Link to="/users/edit">
                    <Text tag='span' className={styles.menu_text2}>{t('user.global-menu.edit-user')}</Text>
                  </Link>
                </li>
              )}

              <li className={styles.mb_16}>
                <Text role='title' className={[styles.memu_title, styles.mb_8].join(' ')}>
                  {isUserLogin && data ? `${data} ${t('user.global-menu.honorific')}` : t('user.global-menu.personal')}
                </Text>
                <Link to="/orders" style={{ 'marginBottom': '8px', 'display': 'block' }}>
                  <Text className={styles.menu_text}>{t('user.global-menu.order-record')}</Text>
                </Link>
                <Link to="/carts" style={{ 'marginBottom': '8px', 'display': 'block' }}>
                  <Text className={styles.menu_text}>{t('user.global-menu.cart')}</Text>
                </Link>
                <Link to="/bookmarks" style={{ 'marginBottom': '8px', 'display': 'block' }} >
                  <Text className={styles.menu_text}>{t('user.global-menu.bookmark')}</Text>
                </Link>
                <Link to="/histories" style={{ 'marginBottom': '8px', 'display': 'block' }} >
                  <Text className={styles.menu_text}>{t('user.global-menu.view-record')}</Text>
                </Link>
                <Link to="/notifications" style={{ 'display': 'block' }}>
                  <Text className={styles.menu_text}>{t('user.global-menu.notification')}</Text>
                </Link>
              </li>
              <li className={styles.mb_16}>
                <Text role='title' className={[styles.memu_title, styles.mb_8].join(' ')}>
                  {t('user.global-menu.contents')}
                </Text>
                <Link to="/items/new" style={{ 'marginBottom': '8px', 'display': 'block' }}>
                  <Text className={styles.menu_text}>{t('user.global-menu.new-arrivals')}</Text>
                </Link>
                <Link to="/items/recommend" style={{ 'marginBottom': '8px', 'display': 'block' }} >
                  <Text className={styles.menu_text}>{t('user.global-menu.recommend-item')}</Text>
                </Link>
                <Link to="/items/rank" style={{ 'marginBottom': '8px', 'display': 'block' }} >
                  <Text className={styles.menu_text}>{t('user.global-menu.ranking')}</Text>
                </Link>
                <Link to="/news" style={{ 'marginBottom': '8px', 'display': 'block' }}>
                  <Text className={styles.menu_text}>{t('user.global-menu.news')}</Text>
                </Link>
                <Link to="/blogs" style={{ 'display': 'block' }}>
                  <Text className={styles.menu_text}>{t('user.global-menu.blog')}</Text>
                </Link>
              </li>
              <li>
                <Text role='title' className={[styles.memu_title, styles.mb_8].join(' ')}>
                  {t('user.global-menu.help')}
                </Text>
                <Link to="/" style={{ 'marginBottom': '8px', 'display': 'block' }}>
                  <Text className={styles.menu_text}>{t('user.global-menu.guidance')}</Text>
                </Link>
                <Link to="/contacts" style={{ 'display': 'block' }}>
                  <Text className={styles.menu_text}>{t('user.global-menu.contact')}</Text>
                </Link>
              </li>
            </ul>
          </nav>
        )
      }
    </>
  );

});

export default GlobalMenu;