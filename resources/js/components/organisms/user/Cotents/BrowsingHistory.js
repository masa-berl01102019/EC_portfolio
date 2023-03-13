import React, { memo } from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import Heading from '../../../atoms/Heading/Heading';
import styles from './styles.module.css';
import Image from '../../../atoms/Image/Image';

const BrowsingHistory = memo(({ className, ...props }) => {

  const [cookies, setCookie] = useCookies();
  const { t } = useTranslation();

  return (
    <div className={className} {...props}>
      <div className={styles.mb_16}>
        <Heading tag={"h2"} tag_style={"h1"} className={styles.title}>
          {t("user.top.view-record")}
        </Heading>
      </div>
      <div className={[styles.flex, styles.scroll_x].join(" ")}>
        {JSON.parse(localStorage.getItem("viewed_items")) && cookies.item_info &&
          JSON.parse(localStorage.getItem("viewed_items"))
            .filter((list) => cookies.item_info.includes(list.id))
            .map((list) => (
              <Link to={`/items/${list.id}`} key={list.id}>
                <Image
                  src={list.top_image}
                  alt="viewed item image"
                  className={styles.show_recode_img}
                />
              </Link>
            ))
        }
      </div>
    </div>
  );
})

export default BrowsingHistory;