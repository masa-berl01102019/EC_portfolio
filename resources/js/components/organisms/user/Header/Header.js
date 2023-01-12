import React, {useState, Suspense, memo} from 'react';
import {Link} from 'react-router-dom';
import Icon from '../../../atoms/Icon/Icon';
import styles from './styles.module.css'
import Text from '../../../atoms/Text/Text';
import Mask from '../../../atoms/Mask/Mask';
import GlobalMenu from '../GlobalMenu/GlobalMenu';
import ItemSearchModal from '../modal/ItemSearchModal';
import { useRecoilState } from 'recoil';
import { langState } from '../../../store/langState';
import useI18next from '../../../context/I18nextContext';

export const Header = ({...props}) => {

    const [openMenu, setOpenMenu] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openPulldown, setOpenPulldown] = useState(false);
    const i18next = useI18next();
    const [lang, setLang] = useRecoilState(langState);

    const handleChangeLanguage = e => {
        setLang(e);
        i18next.changeLanguage(e);
        localStorage.setItem('lang', e);
        setOpenPulldown(!openPulldown);
    }

    return (
        <>
            <header {...props}>
                <nav>
                    <div className={styles.header}>
                        <Icon src={'/img/menu_icon_gray.svg'} className={styles.mr_auto} onClick={() => setOpenMenu(true)}/>
                        <div className={styles.app_name}>
                            <Link to="/"><Text size='xl' className={styles.bold}>EC APP</Text></Link>
                        </div>
                        <div className={styles.relative}>
                            <Text className={styles.lang} onClick={() => setOpenPulldown(!openPulldown)}>{lang.toUpperCase()}</Text>
                            {   openPulldown && 
                                <ul className={styles.pulldown}>
                                    <li className={styles.pulldown_list} onClick={() => handleChangeLanguage('en')}>{i18next.t('common.lang-en')}</li>
                                    <li className={styles.pulldown_list} onClick={() => handleChangeLanguage('ja')}>{i18next.t('common.lang-ja')}</li>
                                </ul>
                            }
                        </div>
                        <Icon src={'/img/search_icon_gray.svg'} className={styles.mr_10} onClick={() => setOpenModal(true)}/>
                        <Link to="/carts" style={{'width': '24px', 'height': '24px'}}>
                            <Icon src={'/img/shopping_cart_icon_gray.svg'} />
                        </Link>
                    </div>
                </nav>
            </header>
            {   openMenu && 
                <Mask onClick={() => setOpenMenu(false)}>
                    <Suspense>
                        <GlobalMenu />
                    </Suspense>
                </Mask>
            }
            {  openModal && 
                <Mask>
                    <Suspense>
                        <ItemSearchModal onClick={() => setOpenModal(false)} /> 
                    </Suspense>
                </Mask>
            }
        </>
    );
};
