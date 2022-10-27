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


const BlogTable = memo(({blogs, className = '', deleteMethod, csvOutputMethod}) => {

  // テーブルのデータに対しての操作の関心を分ける
  const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();

  const [checkItemAll, setCheckItemAll] = useState(false);

  // notifyContextの呼び出し
  const confirm = useNotify();

  const handleConfirmDelete = async () => {
      const result = await confirm({
          body : `選択項目${checklist.length}件を削除しますか？`,
          confirmBtnLabel : '削除'
      });
      result && deleteMethod({url:`/api/admin/blogs`, form:checklist, callback: () => setChecklist([])});
  }

  return (
    <>
      <div style={{'display': 'flex', 'marginBottom': '16px'}}>
        <DeleteBtn onClick={handleConfirmDelete} className={styles.mr}>一括削除</DeleteBtn>
        <DownloadCsvBtn onClick={() => { 
          csvOutputMethod({ 
            url:`/api/admin/blogs/csv`, 
            form:checklist 
          }); 
        }}>CSV出力</DownloadCsvBtn>
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
              <Th>ID</Th>
              <Th>編集</Th>
              <Th>公開状況</Th>
              <Th>サムネイル</Th>
              <Th>タイトル</Th>
              <Th>ブランド</Th>
              <Th>カテゴリ</Th>
              <Th>関連品番</Th>
              <Th>タグ</Th>
              <Th>最終更新者</Th>
              <Th>投稿日</Th>
              <Th>更新日</Th>
            </Row>
          </thead>
          <tbody>
          { blogs.map((blog) =>
              <Row key={blog.id} className={checklist.includes(blog.id) ? styles.checked_row: ''}>
                <Td><InputCheckbox onChange={handleCheck} value={blog.id} checked={checklist.includes(blog.id)} className={styles.table_check}/></Td>
                <Td>{blog.id}</Td>
                <Td><EditLink to={`/admin/blogs/${blog.id}/edit`}>編集</EditLink></Td>
                <Td>{blog.is_published_text}</Td>
                <Td><Image src={blog.thumbnail} type='info_list' width='40px' /></Td>
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
});


export default BlogTable;