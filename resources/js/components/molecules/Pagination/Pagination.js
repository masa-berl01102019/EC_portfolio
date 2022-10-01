import React from 'react';
import PaginationList from '../../atoms/PaginationList/PaginationList';
import PaginationCounter from '../../molecules/PaginationCounter/PaginationCounter';
import useCreateParams from "../../hooks/useCreateParams";
import styles from './styles.module.css';

const Pagination = ({meta, className, model}) => {

  // URLパラメータ変更のフックの呼び出し
  const {handleCurrentPage, handlePerPage} = useCreateParams(model);

  return (
    <>
      { meta &&
          <div className={[styles.pager, className].join(' ')}>
            <PaginationCounter meta={meta} onBlur={handlePerPage} />
            <PaginationList meta={meta} onChange={handleCurrentPage} />
          </div>
      }
    </>
  );

};

export default Pagination;