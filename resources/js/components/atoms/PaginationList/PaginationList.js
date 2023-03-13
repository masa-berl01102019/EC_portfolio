import React, { memo } from 'react';
import Pagination from 'react-js-pagination'; // パラメータ https://www.npmjs.com/package/react-js-pagination

const PaginationList = ({ meta, onChange }) => {

  return (
    <Pagination
      activePage={meta.current_page}
      itemsCountPerPage={meta.per_page}
      totalItemsCount={meta.total}
      pageRangeDisplayed={meta.page_range_displayed}
      onChange={onChange}
      hideNavigation={true}
      hideFirstLastPages={true}
    />
  );

};

export default PaginationList;