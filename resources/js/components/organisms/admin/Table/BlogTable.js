import React, { memo, useState } from 'react';
import styles from './styles.module.css';
import InputCheckbox from '../../../atoms/InputCheckbox/InputCheckbox';
import useInputCheckBox from '../../../hooks/useInputCheckBox';
import { TableHeadCell as Th } from '../../../atoms/TableHeadCell/TableHeadCell';
import { TableBodyCell as Td } from '../../../atoms/TableBodyCell/TableBodyCell';
import EditLink from '../../../molecules/IconLink/EditLink';
import DeleteBtn from '../../../molecules/IconBtn/DeleteBtn';
import DownloadCsvBtn from '../../../molecules/IconBtn/DownloadCsvBtn';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';
import Image from '../../../atoms/Image/Image';
import useNotify from '../../../context/NotifyContext';
import { useTranslation } from 'react-i18next';
import Text from '../../../atoms/Text/Text';


const BlogTable = memo(({ blogs, className = '', deleteMethod, csvOutputMethod }) => {

  const [checklist, { setChecklist, handleCheck, handleUnCheckAll, handleCheckAll }] = useInputCheckBox();
  const [checkItemAll, setCheckItemAll] = useState(false);
  const confirm = useNotify();
  const { t } = useTranslation();

  const handleConfirmDelete = async () => {
    const result = await confirm({
      body: t('admin.delete-confirm', { count: checklist.length }),
      confirmBtnLabel: t('admin.delete-btn')
    });
    result && deleteMethod({ url: `/api/admin/blogs`, form: checklist, callback: () => setChecklist([]) });
  }

  const handleCheckboxState = () => {
    if (checkItemAll) {
      handleUnCheckAll();
      setCheckItemAll(false);
    } else {
      handleCheckAll(blogs);
      setCheckItemAll(true);
    }
  }

  return (
    <>
      <div style={{ 'display': 'flex', 'marginBottom': '16px' }}>
        <DeleteBtn onClick={handleConfirmDelete} className={styles.mr}>{t('admin.delete-all-btn')}</DeleteBtn>
        <DownloadCsvBtn onClick={() => csvOutputMethod({ url: `/api/admin/blogs/csv`, form: checklist })}>
          {t('admin.csv-output')}
        </DownloadCsvBtn>
      </div>
      <div className={className}>
        <table className={styles.table}>
          <thead className={styles.fix_theader} >
            <Row>
              <Th>
                <InputCheckbox
                  onChange={handleCheckboxState}
                  value={checkItemAll ? true : false}
                  checked={checkItemAll}
                  className={styles.table_check}
                />
              </Th>
              <Th>{t('admin.id')}</Th>
              <Th>{t('admin.edit-link')}</Th>
              <Th>{t('admin.published-status')}</Th>
              <Th>{t('admin.blog.thumbnail')}</Th>
              <Th>{t('admin.blog.title')}</Th>
              <Th>{t('admin.blog.brand')}</Th>
              <Th>{t('admin.blog.category')}</Th>
              <Th>{t('admin.blog.related-item')}</Th>
              <Th>{t('admin.blog.related-tag')}</Th>
              <Th>{t('admin.last-updated-by')}</Th>
              <Th>{t('admin.posted-date')}</Th>
              <Th>{t('admin.updated-date')}</Th>
            </Row>
          </thead>
          <tbody>
            {blogs.map((blog) =>
              <Row key={blog.id} className={checklist.includes(blog.id) ? styles.checked_row : ''}>
                <Td>
                  <InputCheckbox
                    onChange={handleCheck}
                    value={blog.id}
                    checked={checklist.includes(blog.id)}
                    className={styles.table_check}
                  />
                </Td>
                <Td>{blog.id}</Td>
                <Td><EditLink to={`/admin/blogs/${blog.id}/edit`}>{t('admin.edit-link')}</EditLink></Td>
                <Td>{blog.is_published_text}</Td>
                <Td><Image src={blog.thumbnail} type='blog_news' width='60px' /></Td>
                <Td>{blog.title}</Td>
                <Td>{blog.brand_name}</Td>
                <Td>{blog.gender_category_text}</Td>
                <Td>{blog.items.join(' / ')}</Td>
                <Td>{blog.tags.join(' / ')}</Td>
                <Td>
                  <Text tag='span'>{blog.full_name}</Text>
                  <Text tag='span'>{blog.full_name_kana.trim() !== '' && `(${blog.full_name_kana})`}</Text>
                </Td>
                <Td>{blog.posted_at}</Td>
                <Td>{blog.modified_at}</Td>
              </Row>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
});


export default BlogTable;