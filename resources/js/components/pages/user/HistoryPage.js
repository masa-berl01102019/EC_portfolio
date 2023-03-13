import React from 'react';
import { useCookies } from 'react-cookie';
import Heading from '../../atoms/Heading/Heading';
import styles from './styles.module.css';
import { useTranslation } from 'react-i18next';
import ItemCardLists from '../../organisms/user/Cotents/ItemCardLists';

function HistoryPage() {

  const [cookies, setCookie] = useCookies();
  const { t } = useTranslation();

  const items = JSON.parse(localStorage.getItem('viewed_items')) && cookies.item_info ? JSON.parse(localStorage.getItem('viewed_items')).filter(list => cookies.item_info.includes(list.id)) : [];

  return (
    <main className={styles.mt_40}>
      <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>
        {t('user.view-record.index-title')}
      </Heading>
      <div className={styles.main_contents_area}>
        <ItemCardLists items={items} />
      </div>
    </main>
  );
}

export default HistoryPage;