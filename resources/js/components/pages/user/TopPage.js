import React, {Suspense, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../hooks/useFetchApiData";
import useCreateParams from "../../hooks/useCreateParams";
import { useCookies } from 'react-cookie';
import { useRecoilState } from 'recoil';
import { paramState } from '../../store/paramState';
import {useCreateUrl} from "../../hooks/useCreateUrl";
import TopItemCard from '../../molecules/Card/TopItemCard';
import Heading from '../../atoms/Heading/Heading'
import InfoCard from '../../molecules/Card/InfoCard';
import NotificationList from '../../molecules/Card/NotificationList';
import RadioBoxTab from '../../atoms/RadioboxTab/RadioBoxTab';
import Image from '../../atoms/Image/Image';
import styles from './styles.module.css';
import LinkBtn from '../../atoms/LinkButton/LinkBtn';
import useI18next from '../../context/I18nextContext';


function TopPage() {

    const baseUrl = `/api/user/home`;
    const model = 'HOME';
    const {handleFilter} = useCreateParams(model);
    const [params, setParams] = useRecoilState(paramState(model));
    const {data, errorMessage} = useFetchApiData(useCreateUrl(baseUrl, params), model);
    const [cookies, setCookie] = useCookies();
    const {data:items, blogs, news, notifications, ranked_items, recommend_items} = data;
    const i18next = useI18next();

    useEffect(() => {
        if(params.scope === null) {
            setParams({
                paginate: {},
                sort: {},
                filter: {'gender_category' : ''},
                scope: model
            });
        }
    },[]);

    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                <div className={styles.flex}>
                    <RadioBoxTab
                        name='gender_category' 
                        value={''} 
                        onChange={handleFilter} 
                        checked={params.filter.gender_category == ''} 
                        label={'ALL'}
                        style={{'flex' : '1'}}
                    />
                    <RadioBoxTab
                        name='gender_category' 
                        value={'1'} 
                        onChange={handleFilter} 
                        checked={params.filter.gender_category == '1'} 
                        label={'MENS'}
                        style={{'flex' : '1'}}
                    />
                    <RadioBoxTab
                        name='gender_category' 
                        value={'2'} 
                        onChange={handleFilter} 
                        checked={params.filter.gender_category == '2'} 
                        label={'WOMEN'}
                        style={{'flex' : '1'}}
                    />
                </div>

                <Image src={'https://via.placeholder.com/640x480.png/003333?text=BLOG+et'} type='demo' className={styles.top_img} alt="TOP IMAGE" />
                
                {   notifications &&
                    <div className={styles.mb_40}> 
                        {                        
                            notifications.map((notification) =>
                                <NotificationList
                                    key={notification.id}
                                    to={`/notifications`}
                                    title={notification.title}
                                    posted_at={notification.posted_at}
                                    modified_at={notification.modified_at}
                                />
                            )
                        }
                    </div>
                }

                <div className={styles.main_contents_area}>

                    <Heading tag={'h2'} tag_style={'h1'} className={[styles.mb_16, styles.text_center, styles.title].join(' ')}>{i18next.t('user.top.new-arrivals')}</Heading>
                    {
                        items &&
                        <div className={styles.search_item_area}> 
                            {                        
                                items.map((item) =>
                                    <TopItemCard 
                                        key={item.id}
                                        src={item.top_image}
                                        to={`/items/${item.id}`}
                                        brand_name={item.brand_name}
                                        item_name={item.item_name}
                                        price={item.included_tax_price_text}
                                        className={styles.item_card}
                                    />
                                )
                            }
                        </div>
                    }
                    <LinkBtn to={'/items/new'} color='link' className={styles.view_all_btn}>{i18next.t('user.top.view-all')}</LinkBtn>
    
                    <Heading tag={'h2'} tag_style={'h1'} className={[styles.mb_16, styles.text_center, styles.title].join(' ')}>{i18next.t('user.top.recommend-item')}</Heading>
                    {
                        recommend_items && 
                        <div className={styles.search_item_area}> 
                            {                        
                                recommend_items.map((item) =>
                                    <TopItemCard 
                                        key={item.id}
                                        src={item.top_image}
                                        to={`/items/${item.id}`}
                                        brand_name={item.brand_name}
                                        item_name={item.item_name}
                                        price={item.included_tax_price_text}
                                        className={styles.item_card}
                                    />
                                )
                            }
                        </div>
                    }
                    <LinkBtn to={'/items/recommend'} color='link' className={styles.view_all_btn}>{i18next.t('user.top.view-all')}</LinkBtn>
    
                    <Heading tag={'h2'} tag_style={'h1'} className={[styles.mb_16, styles.text_center, styles.title].join(' ')}>{i18next.t('user.top.ranking')}</Heading>
                    {
                        ranked_items &&
                        <div className={styles.search_item_area}>
                        {                        
                            ranked_items.map((item) =>
                                <TopItemCard 
                                    key={item.id}
                                    src={item.top_image}
                                    to={`/items/${item.id}`}
                                    brand_name={item.brand_name}
                                    item_name={item.item_name}
                                    price={item.included_tax_price_text}
                                    className={styles.item_card}
                                />
                            )
                        }
                        </div>
                    }
                    <LinkBtn to={'/items/rank'} color='link' className={styles.view_all_btn}>{i18next.t('user.top.view-all')}</LinkBtn>

                    <div className={styles.blog_news_wrap}>
                        <div className={styles.news_wrap}>
                            <div className={[styles.mb_16, styles.flex, styles.align_center, styles.justify_between].join(' ')}>
                                <Heading tag={'h2'} tag_style={'h1'} className={styles.title}>{i18next.t('user.top.news')}</Heading>
                                <Link to="/news">{i18next.t('user.top.to-list-page')}</Link>
                            </div>
                            {
                                news &&
                                <div className={styles.mb_40}> 
                                    {                        
                                        news.map((item) =>
                                            <InfoCard
                                                key={item.id}
                                                src={item.thumbnail}
                                                to={`/news/${item.id}`}
                                                title={item.title}
                                                brand_name={item.brand_name}
                                                posted_at={item.posted_at}
                                                modified_at={item.modified_at}
                                            />
                                        )
                                    }
                                </div>
                            }
                        </div>
                        <div className={styles.blog_wrap}>
                            <div className={[styles.mb_16, styles.flex, styles.align_center, styles.justify_between].join(' ')}>
                                <Heading tag={'h2'} tag_style={'h1'} className={styles.title}>{i18next.t('user.top.blog')}</Heading>
                                <Link to="/blogs">{i18next.t('user.top.to-list-page')}</Link>
                            </div>
                            {
                                blogs &&
                                <div className={styles.mb_40}>
                                    {                        
                                        blogs.map((blog) =>
                                            <InfoCard
                                                key={blog.id}
                                                src={blog.thumbnail}
                                                to={`/blogs/${blog.id}`}
                                                title={blog.title}
                                                brand_name={blog.brand_name}
                                                posted_at={blog.posted_at}
                                                modified_at={blog.modified_at}
                                            />
                                        )
                                    }
                                </div>
                            }
                        </div>
                    </div>

                    <div className={styles.mb_16}>
                        <Heading tag={'h2'} tag_style={'h1'} className={styles.title}>{i18next.t('user.top.view-record')}</Heading>
                    </div>
                    <div className={[styles.flex, styles.scroll_x].join(' ')}>
                    { JSON.parse(localStorage.getItem('viewed_items')) && cookies.item_info &&
                        JSON.parse(localStorage.getItem('viewed_items')).filter(list => cookies.item_info.includes(list.id)).map(list => (
                            <Link to={`/items/${list.id}`} key={list.id}>
                                <Image src={list.top_image} alt="viewed item image" className={styles.show_recode_img} />
                            </Link>
                        ))
                    }
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default TopPage;