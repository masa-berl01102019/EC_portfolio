import React from 'react';
import { useCookies } from 'react-cookie';
import Heading from '../../atoms/Heading/Heading';
import TopItemCard from '../../molecules/Card/TopItemCard';
import styles from './styles.module.css';

function HistoryPage() {
    // cookieを管理
    const [cookies, setCookie] = useCookies();

    return (
        <main className={styles.mt_40}>
            <Heading tag={'h1'} tag_style={'h1'} className={styles.section_title}>閲覧履歴</Heading>
            <div className={styles.main_contents_area}>
                {   JSON.parse(localStorage.getItem('viewed_items')) && cookies.item_info &&
                    <div className={[styles.flex, styles.flex_wrap].join(' ')}>
                        {                        
                            JSON.parse(localStorage.getItem('viewed_items')).filter(list => cookies.item_info.includes(list.id)).map((item) =>
                                <TopItemCard 
                                    key={item.id}
                                    src={item.top_image}
                                    to={`/items/${item.id}`}
                                    brand_name={item.brand_name}
                                    item_name={item.item_name}
                                    price={item.included_tax_price_text}
                                    className={styles.item_card_history}
                                />
                            )
                        }
                    </div>
                }
            </div>
        </main>
    );
}

export default HistoryPage;