import React, { Suspense, useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import useFetchApiData from "../../hooks/useFetchApiData";
import useCreateParams from "../../hooks/useCreateParams";
import { useRecoilState } from "recoil";
import { paramState } from "../../store/paramState";
import { useCreateUrl } from "../../hooks/useCreateUrl";
import Image from "../../atoms/Image/Image";
import styles from "./styles.module.css";
import News from "../../organisms/user/Cotents/News";
import Blogs from "../../organisms/user/Cotents/Blogs";
import BrowsingHistory from "../../organisms/user/Cotents/BrowsingHistory";
import NotificationCardLists from "../../organisms/user/Cotents/NotificationCardLists";
import GenderCategoryTab from "../../organisms/user/Cotents/GenderCategoryTab";
import NewItems from "../../organisms/user/Cotents/NewItems";
import RecommendItems from "../../organisms/user/Cotents/RecommendItems";
import RankedItems from "../../organisms/user/Cotents/RankedItems";
import { useTranslation } from "react-i18next";

// TODO: Create carousel UI to show the thumbnails of blogs and news to want to promote

function TopPage() {
  const baseUrl = `/api/user/home`;
  const model = "HOME";
  const { handleFilter } = useCreateParams(model);
  const [params, setParams] = useRecoilState(paramState(model));
  const { data, errorMessage } = useFetchApiData(useCreateUrl(baseUrl, params), model)
  const { data: items, blogs, news, notifications, ranked_items, recommend_items } = data;
  const { t } = useTranslation();

  useEffect(() => {
    if (params.scope === null) {
      setParams({
        paginate: {},
        sort: {},
        filter: { gender_category: '' },
        scope: model,
      });
    }
  }, []);

  return (
    <main className={styles.mt_40}>
      <Suspense fallback={<CircularProgress disableShrink />}>
        <GenderCategoryTab genderCategory={params.filter.gender_category} onChange={handleFilter} />
        <Image src="/img/top_image.jpg" type="demo" className={styles.top_img} alt="TOP IMAGE" />
        <NotificationCardLists notifications={notifications} className={styles.mb_56} />
        <div className={styles.main_contents_area}>
          <NewItems items={items} className={styles.mb_64} />
          <RecommendItems items={recommend_items} className={styles.mb_64} />
          <RankedItems items={ranked_items} className={styles.mb_64} />
          <div className={styles.blog_news_wrap}>
            <News media={news} className={[styles.news_wrap, styles.mb_56].join(' ')} />
            <Blogs media={blogs} className={[styles.blog_wrap, styles.mb_56].join(' ')} />
          </div>
          <BrowsingHistory />
        </div>
      </Suspense>
    </main>
  );
}

export default TopPage;
