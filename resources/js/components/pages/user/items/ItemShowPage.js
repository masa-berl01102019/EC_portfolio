import React, { Suspense, useEffect } from 'react';
import useFetchApiData from "../../../hooks/useFetchApiData";
import { CircularProgress } from "@material-ui/core";
import { useCookies } from 'react-cookie';
import Text from '../../../atoms/Text/Text';
import Heading from '../../../atoms/Heading/Heading';
import MeasurementTable from '../../../organisms/user/Table/MeasurementTable';
import styles from '../styles.module.css';
import { authUserState } from '../../../store/authState';
import { useRecoilValue } from 'recoil';
import useItemCookies from '../../../hooks/useItemCookies';
import useItemWebStorage from '../../../hooks/useItemWebStorage';
import { useTranslation } from 'react-i18next';
import BrowsingHistory from '../../../organisms/user/Cotents/BrowsingHistory';
import RelatedItems from '../../../organisms/user/Cotents/RelatedItems';
import RelatedBlogs from '../../../organisms/user/Cotents/RelatedBlogs';
import ItemDetailInfo from '../../../organisms/user/Cotents/ItemDetailInfo';
import ItemInfoTab from '../../../organisms/user/Cotents/ItemInfoTab';
import CartDialog from '../../../organisms/user/Cotents/CartDialog';
import BookmarkDialog from '../../../organisms/user/Cotents/BookmarkDialog';
import ImageSlider from '../../../organisms/user/Cotents/ImageSlider';
import Breadcrumbs from '../../../organisms/user/Cotents/Breadcrumbs';
import useCreateParams from '../../../hooks/useCreateParams';
import RelatedTagLists from '../../../organisms/user/Cotents/RelatedTagLists';

function ItemShowPage(props) {

  const baseUrl = `/api/user/items/${props.match.params.id}`;
  const model = 'ITEM';
  const { data, errorMessage, createData } = useFetchApiData(baseUrl, model);
  const [cookies, setCookie] = useCookies();
  const { handleViewItemCookie } = useItemCookies(cookies, setCookie);
  const { handleViewItemWebStorage } = useItemWebStorage();
  const { item, sizes, related_items, related_tags, related_gender_category, related_main_category, related_sub_category } = data;
  const isUserLogin = useRecoilValue(authUserState);
  const { t } = useTranslation();
  const { params, setParams, handleBreadCrumbs, handleFilterCheckbox } = useCreateParams(model);

  useEffect(() => {
    if (params.scope === null) {
      setParams({
        paginate: {},
        sort: { 'price': '', 'posted_at': '' },
        filter: { 'search': '', 'tag': [], 'color': [], 'size': [], 'brand': [], 'gender_category': '', 'main_category': '', 'sub_category': '', 'price_from': '', 'price_to': '', 'stock_status': '' },
        scope: model
      });
    }
    if (item) {
      handleViewItemCookie(item.id);
      handleViewItemWebStorage(item, cookies.item_info);
    }
  }, [baseUrl]);

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <div className={styles.main_contents_area}>
          <div className={styles.bread_crumbs_area}>
            <Breadcrumbs
              brand={item.brand}
              gender={related_gender_category}
              main={related_main_category}
              sub={related_sub_category}
              to={'/items'}
              filterMethod={handleBreadCrumbs}
              style={{ 'margin': '12px 0' }}
            />
          </div>
          <div className={styles.item_detail_area}>
            <ImageSlider
              images={item.images}
              topImage={item.top_image}
            />
            <div className={styles.item_info_area}>
              <div className={styles.item_basic_info_area}>
                <Text className={styles.mb_8}>{item.brand_name}</Text>
                <Text className={styles.mb_8}>{item.item_name}</Text>
                <Text size='l'>{item.included_tax_price_text} ({t('user.tax-including')})</Text>
              </div>
              <div className={styles.show_item_btn_area}>
                <CartDialog
                  isUserLogin={isUserLogin}
                  item={item}
                  sizes={sizes}
                  createData={createData}
                />
                <BookmarkDialog
                  isUserLogin={isUserLogin}
                  item={item}
                  sizes={sizes}
                  createData={createData}
                />
              </div>
              {!isUserLogin && <Text role='error' className={styles.mb_24}>{t('user.item.error-msg')}</Text>}
              <ItemInfoTab>
                <>
                  <Heading tag={'h2'} tag_style={'h1'} className={[styles.title, styles.mb_16].join(' ')}>
                    {t('user.item.size-table')}
                  </Heading>
                  <MeasurementTable measurements={item.measurements} sizes={sizes} className={styles.mb_32} />
                  <Heading tag={'h2'} tag_style={'h1'} className={[styles.title, styles.mb_16].join(' ')}>
                    {t('user.item.detail')}
                  </Heading>
                  <ItemDetailInfo item={item} className={styles.mb_32} />
                </>
                <>
                  <Heading tag={'h2'} tag_style={'h1'} className={[styles.title, styles.mb_16].join(' ')}>
                    {t('user.item.description-sub')}
                  </Heading>
                  <Text className={styles.mb_32}>{item.description}</Text>
                </>
              </ItemInfoTab>
            </div>
          </div>
          <div className={styles.item_related_area}>
            <Heading tag={'h2'} tag_style={'h1'} className={[styles.title, styles.mb_12, styles.mt_24].join(' ')}>
              {t('user.blog.related-tag')}
            </Heading>
            <RelatedTagLists
              tags={related_tags}
              to={'/items'}
              filterMethod={handleFilterCheckbox}
              className={styles.mb_32}
            />
            {item.publishedBlogs && <RelatedBlogs media={item.publishedBlogs} className={styles.mb_32} />}
            {related_items.length > 0 && <RelatedItems relatedItems={related_items} className={styles.mb_32} />}
            <BrowsingHistory />
          </div>
        </div>
      </Suspense>
    </main>
  );
}

export default ItemShowPage;
