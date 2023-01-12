import React, {memo, useState} from 'react';
import styles from './styles.module.css';
import InputCheckbox from '../../../atoms/InputCheckbox/InputCheckbox';
import useInputCheckBox from '../../../hooks/useInputCheckBox';
import {TableHeadCell as Th} from '../../../atoms/TableHeadCell/TableHeadCell';
import {TableBodyCell as Td} from '../../../atoms/TableBodyCell/TableBodyCell';
import EditLink from '../../../molecules/IconLink/EditLink';
import DeleteBtn from '../../../molecules/IconBtn/DeleteBtn';
import DownloadCsvBtn from '../../../molecules/IconBtn/DownloadCsvBtn';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';
import Image from '../../../atoms/Image/Image';
import useNotify from '../../../context/NotifyContext';
import useI18next from '../../../context/I18nextContext';


const BlogTable = ({blogs, className = '', deleteMethod, csvOutputMethod}) => {

  const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();
  const [checkItemAll, setCheckItemAll] = useState(false);
  const confirm = useNotify();
  const i18next = useI18next();

  const handleConfirmDelete = async () => {
      const result = await confirm({
          body : i18next.t('admin.delete-confirm', {count: checklist.length}),
          confirmBtnLabel : i18next.t('admin.delete-btn')
      });
      result && deleteMethod({url:`/api/admin/blogs`, form:checklist, callback: () => setChecklist([])});
  }

  return (
    <>
      <div style={{'display': 'flex', 'marginBottom': '16px'}}>
        <DeleteBtn onClick={handleConfirmDelete} className={styles.mr}>{i18next.t('admin.delete-all-btn')}</DeleteBtn>
        <DownloadCsvBtn onClick={() => { 
          csvOutputMethod({ 
            url:`/api/admin/blogs/csv`, 
            form:checklist 
          }); 
        }}>{i18next.t('admin.csv-output')}</DownloadCsvBtn>
      </div>
      <div className={className}>
        <table className={styles.table}>
        <thead className={styles.fix_theader} >
            <Row>
              <Th>
                { checkItemAll ? (
                  <InputCheckbox
                    onChange={() => {
                      handleUnCheckAll();
                      setCheckItemAll(false);
                    }} 
                    value={true} 
                    checked={checkItemAll} 
                    className={styles.table_check}
                  />
                ) :(
                  <InputCheckbox 
                    onChange={() => {
                      handleCheckAll(blogs); 
                      setCheckItemAll(true);
                    }} 
                    value={false} 
                    checked={checkItemAll} 
                    className={styles.table_check}
                  />
                )}
              </Th>
              <Th>{i18next.t('admin.id')}</Th>
              <Th>{i18next.t('admin.edit-link')}</Th>
              <Th>{i18next.t('admin.published-status')}</Th>
              <Th>{i18next.t('admin.blog.thumbnail')}</Th>
              <Th>{i18next.t('admin.blog.title')}</Th>
              <Th>{i18next.t('admin.blog.brand')}</Th>
              <Th>{i18next.t('admin.blog.category')}</Th>
              <Th>{i18next.t('admin.blog.related-item')}</Th>
              <Th>{i18next.t('admin.blog.related-tag')}</Th>
              <Th>{i18next.t('admin.last-updated-by')}</Th>
              <Th>{i18next.t('admin.posted-date')}</Th>
              <Th>{i18next.t('admin.updated-date')}</Th>
            </Row>
          </thead>
          <tbody>
          { blogs.map((blog) =>
              <Row key={blog.id} className={checklist.includes(blog.id) ? styles.checked_row: ''}>
                <Td><InputCheckbox onChange={handleCheck} value={blog.id} checked={checklist.includes(blog.id)} className={styles.table_check}/></Td>
                <Td>{blog.id}</Td>
                <Td><EditLink to={`/admin/blogs/${blog.id}/edit`}>{i18next.t('admin.edit-link')}</EditLink></Td>
                <Td>{blog.is_published_text}</Td>
                <Td><Image src={blog.thumbnail} type='blog_news' width='60px' /></Td>
                <Td>{blog.title}</Td>
                <Td>{blog.brand_name}</Td>
                <Td>{blog.gender_category_text}</Td>
                <Td>{blog.items.join(' / ')}</Td>
                <Td>{blog.tags.join(' / ')}</Td> 
                <Td>{blog.full_name && blog.full_name_kana && (`${blog.full_name}(${blog.full_name_kana})`)}</Td>
                <Td>{blog.posted_at}</Td>
                <Td>{blog.modified_at}</Td>
              </Row>
            )
          }
          </tbody>
        </table>
      </div>
    </>
  );
};


export default BlogTable;