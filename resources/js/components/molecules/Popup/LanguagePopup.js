import React, {memo, useState} from 'react';
import Text from '../../atoms/Text/Text';
import Pulldown from '../../atoms/Pullldown/Pulldown';
import styles from './styles.module.css';
import useI18next from '../../context/I18nextContext';

const LanguagePopup = ({
    className = '',
    ...props
  }) => {

    const i18next = useI18next();

    const [lang, setLang] = useState(localStorage.getItem('lang') || 'ja');

    const handleCangeLanguage = e => {
      setLang(e.target.value);
      i18next.changeLanguage(e.target.value);
      localStorage.setItem('lang', e.target.value);
    }

    return (
      <div className={styles.notify_container}>
        <Text className={styles.mb_8}>{i18next.t('common.set-lang')}</Text>
        <Pulldown name='lang' value={lang} onChange={handleCangeLanguage}>
            <option value={'en'}>{i18next.t('common.lang-en')}</option>
            <option value={'ja'}>{i18next.t('common.lang-ja')}</option>
        </Pulldown>
      </div>
    );
}

export default LanguagePopup;