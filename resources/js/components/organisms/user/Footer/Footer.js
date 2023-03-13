import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../atoms/Icon/Icon';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import { useTranslation } from 'react-i18next';

export const Footer = memo(({ className, ...props }) => {

  const { t } = useTranslation();

  return (
    <footer className={[styles.footer, className].join('')} {...props}>
      <div className={styles.mb_24}>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{ 'width': '34px', 'height': '34px', 'display': 'inline-block', 'marginRight': '16px' }}>
          <Icon src={'/img/facebook_icon.svg'} className={styles.social_icon} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ 'width': '34px', 'height': '34px', 'display': 'inline-block', 'marginRight': '16px' }}>
          <Icon src={'/img/twitter_icon.svg'} className={styles.social_icon} />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{ 'width': '34px', 'height': '34px', 'display': 'inline-block' }}>
          <Icon src={'/img/instagram_icon.svg'} className={styles.social_icon} />
        </a>
      </div>
      <ul className={styles.footer_menu_area}>
        <li className={styles.mb_16}>
          <Link to="/">
            <Text tag='span'>{t('user.footer-menu.company-info')}</Text>
          </Link>
        </li>
        <li className={styles.mb_16}>
          <Link to="/">
            <Text tag='span'>{t('user.footer-menu.terms-of-service')}</Text>
          </Link>
        </li>
        <li className={styles.mb_16}>
          <Link to="/">
            <Text tag='span'>{t('user.footer-menu.privacy-policy')}</Text>
          </Link>
        </li>
        <li>
          <Link to="/">
            <Text tag='span'>{t('user.footer-menu.rule')}</Text>
          </Link>
        </li>
      </ul>
      <Text size='s' className={styles.copy_right}>
        &copy; DEMO DEV CO., LTD. ALL RIGHT RESERVED.
      </Text>
    </footer>
  );
});
