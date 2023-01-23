import React, {memo} from 'react';
import {Link} from 'react-router-dom';
import Icon from '../../../atoms/Icon/Icon';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';

export const Footer = ({className, ...props}) => {
    return (
        <footer className={[styles.footer, className].join('')} {...props}>
            <div className={styles.mb_24}>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{ 'width': '34px', 'height': '34px', 'display': 'inline-block', 'marginRight': '16px'}}>
                    <Icon src={'/img/facebook_icon.svg'} className={styles.social_icon} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ 'width': '34px', 'height': '34px', 'display': 'inline-block', 'marginRight': '16px'}}>
                    <Icon src={'/img/twitter_icon.svg'} className={styles.social_icon} />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{ 'width': '34px', 'height': '34px', 'display': 'inline-block'}}>
                    <Icon src={'/img/instagram_icon.svg'} className={styles.social_icon} />
                </a>
            </div>
            <ul className={styles.footer_menu_area}>
                <li className={styles.mb_16}>
                    <Link to="/">
                        <Text tag='span'>利用ガイド</Text>
                    </Link>
                </li>
                <li className={styles.mb_16}>
                    <Link to="/contacts">
                        <Text tag='span'>お問い合わせ</Text>
                    </Link>
                </li>
                <li className={styles.mb_16}>
                    <Link to="/">
                        <Text tag='span'>会社概要</Text>
                    </Link>
                </li>
                <li className={styles.mb_16}>
                    <Link to="/">
                        <Text tag='span'>利用規約</Text>
                    </Link>
                </li>
                <li className={styles.mb_16}>
                    <Link to="/">
                        <Text tag='span'>プライバシーポリシー</Text>
                    </Link>
                </li>
                <li>
                    <Link to="/">
                        <Text tag='span'>特定商取引法に基づく表記</Text>
                    </Link>
                </li>
            </ul>
            <Text size='s' className={styles.text_center}>
                &copy; LARAVEL  DEV CO., LTD. ALL RIGHT RESERVED.
            </Text>
        </footer>
    );
};
