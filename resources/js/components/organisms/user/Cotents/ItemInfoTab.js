import React, { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import RadioBoxTab from '../../../molecules/RadioBoxTab/RadioBoxTab';
import styles from './styles.module.css';

const ItemInfoTab = memo(({ children: [tab1, tab2], className, ...props }) => {

  const [tab, setTab] = useState('1');
  const { t } = useTranslation();

  return (
    <div {...props}>
      <div className={[styles.flex, styles.mb_32, className].join(' ')}>
        <RadioBoxTab
          name='switch_tab'
          value={'1'}
          onChange={e => setTab(e.target.value)}
          checked={tab == '1'}
          label={t('user.item.size-detail')}
          style={{ 'flex': '1' }}
        />
        <RadioBoxTab
          name='switch_tab'
          value={'2'}
          onChange={e => setTab(e.target.value)}
          checked={tab == '2'}
          label={t('user.item.description')}
          style={{ 'flex': '1' }}
        />
      </div>
      <div className={tab === '1' ? styles.open : styles.close}>
        {tab1}
      </div>
      <div className={tab === '2' ? styles.open : styles.close}>
        {tab2}
      </div>
    </div>
  );
});

export default ItemInfoTab;