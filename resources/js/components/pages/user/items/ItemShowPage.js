import React, {Suspense, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import useFetchApiData from "../../../hooks/useFetchApiData";
import {CircularProgress} from "@material-ui/core";
import { useCookies } from 'react-cookie';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import Image from '../../../atoms/Image/Image';
import InfoCard from '../../../molecules/Card/InfoCard';
import TopItemCard from '../../../molecules/Card/TopItemCard';
import RadioBoxTab from '../../../atoms/RadioboxTab/RadioBoxTab';
import MeasurementTable from '../../../organisms/user/Table/MeasurementTable';
import BookmarkBtn from '../../../molecules/IconBtn/BookmarkBtn';
import CartBtn from '../../../molecules/IconBtn/CartBtn';
import styles from '../styles.module.css';
import { authUserState } from '../../../store/authState';
import { useRecoilValue } from 'recoil';
import useItemCookies from '../../../hooks/useItemCookies';
import useItemWebStorage from '../../../hooks/useItemWebStorage';
import CartModal from '../../../organisms/user/modal/CartModal';
import BookmarkModal from '../../../organisms/user/modal/BookmarkModal';
import useI18next from '../../../context/I18nextContext';

function ItemShowPage(props) {

    const baseUrl = `/api/user/items/${props.match.params.id}`;
    const model = 'ITEM';
    const {data, errorMessage, createData} = useFetchApiData(baseUrl, model);
    const [cookies, setCookie] = useCookies();
    const {handleViewItemCookie} = useItemCookies(cookies, setCookie);
    const {handleViewItemWebStorage} = useItemWebStorage();
    const {item, sizes, related_items} = data;
    const isUserLogin = useRecoilValue(authUserState);
    const [tab, setTab] = useState('1');
    const [popup, setPopup] = useState('');
    const [pickedPicture, setPickedPicture] = useState('');
    const i18next = useI18next();

    useEffect(() => {
        if(item) {
            setPickedPicture(item.top_image);
            handleViewItemCookie(item.id);
            handleViewItemWebStorage(item, cookies.item_info); 
        }
    },[baseUrl]);

    // TODO: タグを表示する
    
    return (
        <main className={styles.mt_40}>
            <Suspense fallback={<CircularProgress disableShrink />}>
                {   popup == '1' && 
                    <CartModal
                        item={item} 
                        sizes={sizes} 
                        createData={createData} 
                        closeMethod={() => setPopup('')} 
                    />
                }
                {   popup == '2' && 
                    <BookmarkModal 
                        item={item} 
                        sizes={sizes} 
                        createData={createData} 
                        closeMethod={() => setPopup('')} 
                    />
                }
                <div className={styles.main_contents_area}>
                    <div className={styles.item_detail_area}>
                        <div className={styles.item_img_area}>
                            <Image src={pickedPicture} alt="item image" className={styles.item_top_img}/>
                            <div className={styles.item_thumbnail_area}>
                                {   item.images &&
                                    item.images.map((list, index) =>
                                        <Image 
                                            key={index}
                                            src={list.image ? list.image : '/img/no_image.png'} 
                                            alt="item image" 
                                            style={{'width' : '16%'}}
                                            onClick={() => {setPickedPicture(list.image)}}
                                        />
                                    )
                                }
                            </div>
                        </div>
                        <div className={styles.item_info_area}>
                            <div className={styles.item_basic_info_area}>
                                <Text className={styles.mb_8}>{item.brand_name}</Text>
                                <Text className={styles.mb_8}>{item.item_name}</Text>
                                <Text size='l'>{item.included_tax_price_text} ({i18next.t('user.tax-including')})</Text>
                            </div>
                            <div className={styles.show_item_btn_area}>
                                <CartBtn size='l' onClick={() => setPopup('1')} className={styles.mb_16} disabled={!isUserLogin}>
                                    {i18next.t('user.item.cart-btn')}
                                </CartBtn>
                                <BookmarkBtn size='l' onClick={() => setPopup('2')} disabled={!isUserLogin}>
                                    {i18next.t('user.item.bookmark-btn')}
                                </BookmarkBtn>
                            </div>
                            {!isUserLogin && 
                                <Text role='error' className={styles.mb_24}>
                                    {i18next.t('user.item.error-msg')}
                                </Text>
                            }
                            <div className={[styles.flex, styles.mb_32].join(' ')}>
                                <RadioBoxTab
                                    name='switch_tab' 
                                    value={'1'} 
                                    onChange={e => setTab(e.target.value)} 
                                    checked={tab == '1'} 
                                    label={i18next.t('user.item.size-detail')}
                                    style={{'flex' : '1'}}
                                />
                                <RadioBoxTab
                                    name='switch_tab' 
                                    value={'2'} 
                                    onChange={e => setTab(e.target.value)} 
                                    checked={tab == '2'} 
                                    label={i18next.t('user.item.description')}
                                    style={{'flex' : '1'}}
                                />
                            </div>
                            { tab == '1' ? (
                                <div className={styles.mb_32}>
                                    <Heading tag={'h2'} tag_style={'h2'} className={[styles.title, styles.mb_16].join(' ')}>{i18next.t('user.item.size-table')}</Heading>
                                    <MeasurementTable 
                                        measurements={item.measurements} 
                                        sizes={sizes} 
                                        className={styles.mb_24} 
                                    />
                                    <Heading tag={'h2'} tag_style={'h2'} className={[styles.title, styles.mb_16].join(' ')}>{i18next.t('user.item.detail')}</Heading>
                                    <ul className={styles.detail_info_list}>
                                        <li className={[styles.flex, styles.mb_8].join(' ')}>
                                            <Text className={[styles.bold, styles.flex_basis_140p].join(' ')}>{i18next.t('user.item.color')} </Text>
                                            <Text className={styles.flex_1}>{item.color_variation.join(' / ') }</Text>
                                        </li>
                                        <li className={[styles.flex, styles.mb_8].join(' ')}>
                                            <Text className={[styles.bold, styles.flex_basis_140p].join(' ')}>{i18next.t('user.item.size')} </Text>
                                            <Text className={styles.flex_1}>{item.size_variation.join(' / ') }</Text>
                                        </li>
                                        <li className={[styles.flex, styles.mb_8].join(' ')}>
                                            <Text className={[styles.bold, styles.flex_basis_140p].join(' ')}>{i18next.t('user.item.gender')} </Text>
                                            <Text className={styles.flex_1}>{item.gender_category}</Text>
                                        </li>
                                        <li className={[styles.flex, styles.mb_8].join(' ')}>
                                            <Text className={[styles.bold, styles.flex_basis_140p].join(' ')}>{i18next.t('user.item.category')} </Text>
                                            <Text className={styles.flex_1}>{item.main_category + ' > ' + item.sub_category}</Text>
                                        </li>
                                        <li className={[styles.flex, styles.mb_8].join(' ')}>
                                            <Text className={[styles.bold, styles.flex_basis_140p].join(' ')}>{i18next.t('user.item.material')} </Text>
                                            <Text className={styles.flex_1}>{item.mixture_ratio}</Text>
                                        </li>
                                        <li className={[styles.flex, styles.mb_8].join(' ')}>
                                            <Text className={[styles.bold, styles.flex_basis_140p].join(' ')}>{i18next.t('user.item.made-in')} </Text>
                                            <Text className={styles.flex_1}>{item.made_in}</Text>
                                        </li>
                                        <li className={styles.flex}>
                                            <Text className={[styles.bold, styles.flex_basis_140p].join(' ')}>{i18next.t('user.item.product-number')} </Text>
                                            <Text className={styles.flex_1}>{item.product_number}</Text>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <Text className={styles.mb_32}>{item.description}</Text>
                            )}
                        </div>
                    </div>
                    <div className={styles.item_related_area}>
                        {   item.publishedBlogs &&
                            <>
                                <Heading tag={'h2'} tag_style={'h2'} className={[styles.title, styles.mb_16].join(' ')}>{i18next.t('user.item.related-blog')}</Heading>
                                <div className={styles.mb_32}>
                                    {
                                        item.publishedBlogs.map((blog) =>
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
                            </>
                        }  
                        {   related_items &&
                            <>
                                <Heading tag={'h2'} tag_style={'h2'} className={[styles.title, styles.mb_16].join(' ')}>{i18next.t('user.item.related-item')}</Heading>
                                <div className={[styles.show_card_area, styles.mb_32].join(' ')}>
                                    {   related_items.map((item) =>
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
                            </>
                        }
                        { JSON.parse(localStorage.getItem('viewed_items')) && cookies.item_info &&
                            <>
                                <Heading tag={'h2'} tag_style={'h2'} className={[styles.title, styles.mb_16].join(' ')}>{i18next.t('user.item.view-record')}</Heading>
                                <div className={[styles.flex, styles.scroll_x].join(' ')}>
                                {   
                                    JSON.parse(localStorage.getItem('viewed_items')).filter(list => cookies.item_info.includes(list.id)).map(list => (
                                        <Link to={`/items/${list.id}`} key={list.id}>
                                            <Image src={list.top_image} alt="viewed item image" className={styles.history_recodes}/> 
                                        </Link>
                                    ))
                                }
                                </div>
                            </>
                        }
                    </div>
                </div>
            </Suspense>
        </main>
    );
}

export default ItemShowPage;
