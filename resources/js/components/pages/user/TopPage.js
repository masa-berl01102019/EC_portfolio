import React, {Suspense, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData2 from "../../hooks/useFetchApiData2";
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
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import LinkBtn from '../../atoms/LinkButton/LinkBtn';


function TopPage() {
    // urlの設定
    const baseUrl = `/api/user/home`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'HOME';
    // URLパラメータ変更のフックの呼び出し
    const {handleFilter} = useCreateParams(model);
    // グローバルステート呼び出し
    const [params, setParams] = useRecoilState(paramState(model));
    // APIと接続して返り値を取得
    const {data, errorMessage} = useFetchApiData2(useCreateUrl(baseUrl, params), model);
    // cookieを管理
    const [cookies, setCookie] = useCookies();
    // APIから取得したデータを変数に格納
    const items = data.data? data.data: null;
    const blogs = data.blogs? data.blogs: null;
    const news = data.news? data.news: null;
    const notifications = data.notifications? data.notifications: null;
    const ranked_items = data.ranked_items? data.ranked_items: null;
    const recommend_items = data.recommend_items? data.recommend_items: null;

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(params.scope === null) {
            console.log('HOMEにてparamsの初期値をセット');
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
            {
                errorMessage && errorMessage.httpRequestError ? (
                    <Text className={styles.http_error}>{errorMessage.httpRequestError}</Text>
                ) : (
                    <div>
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

                            <Heading tag={'h2'} tag_style={'h1'} className={[styles.mb_16, styles.text_center, styles.title].join(' ')}>新着一覧</Heading>
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
                            <LinkBtn to={'/items/new'} color='link' className={styles.view_all_btn}>すべてをみる</LinkBtn>
            
                            <Heading tag={'h2'} tag_style={'h1'} className={[styles.mb_16, styles.text_center, styles.title].join(' ')}>おすすめ一覧</Heading>
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
                            <LinkBtn to={'/items/recommend'} color='link' className={styles.view_all_btn}>すべてをみる</LinkBtn>
            
                            <Heading tag={'h2'} tag_style={'h1'} className={[styles.mb_16, styles.text_center, styles.title].join(' ')}>ランキング一覧</Heading>
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
                            <LinkBtn to={'/items/rank'} color='link' className={styles.view_all_btn}>すべてをみる</LinkBtn>

                            <div className={styles.blog_news_wrap}>
                                <div className={styles.news_wrap}>
                                    <div className={[styles.mb_16, styles.flex, styles.align_center, styles.justify_between].join(' ')}>
                                        <Heading tag={'h2'} tag_style={'h1'} className={styles.title}>ニュース一覧</Heading>
                                        <Link to="/news">一覧へ</Link>
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
                                        <Heading tag={'h2'} tag_style={'h1'} className={styles.title}>ブログ一覧</Heading>
                                        <Link to="/blogs">一覧へ</Link>
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
                                <Heading tag={'h2'} tag_style={'h1'} className={styles.title}>チェックした商品</Heading>
                            </div>
                            <div className={[styles.flex, styles.scroll_x].join(' ')}>
                            { JSON.parse(localStorage.getItem('viewed_items')) && cookies.item_info &&
                                JSON.parse(localStorage.getItem('viewed_items')).filter(list => cookies.item_info.includes(list.id)).map(list => (
                                    <Link to={`/items/${list.id}`} key={list.id}>
                                        <Image src={list.top_image} alt="閲覧商品画像" className={styles.show_recode_img} />
                                    </Link>
                                ))
                            }
                            </div>
                        </div>

                    </div>
                )
            }
            </Suspense>
        </main>
    );
}

export default TopPage;