import React, { memo, useState } from 'react';
import { useTranslation } from "react-i18next";
import BookmarkModal from '../modal/BookmarkModal';
import BookmarkBtn from '../../../molecules/IconBtn/BookmarkBtn';

const BookmarkDialog = memo(({ isUserLogin, item, sizes, createData, className, ...props }) => {

  const [popup, setPopup] = useState(false);
  const { t } = useTranslation();

  return (
    <div className={className} {...props}>
      <BookmarkBtn
        size='l'
        onClick={() => setPopup(true)}
        disabled={!isUserLogin}
      >
        {t('user.item.bookmark-btn')}
      </BookmarkBtn>
      {popup === true &&
        <BookmarkModal
          item={item}
          sizes={sizes}
          createData={createData}
          closeMethod={() => setPopup(false)}
        />
      }
    </div >
  );
});

export default BookmarkDialog;