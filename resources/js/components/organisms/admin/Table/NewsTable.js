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


const NewsTable = memo(({news, className = '', deleteMethod, csvOutputMethod}) => {

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
      result && deleteMethod({url:`/api/admin/news`, form:checklist, callback: () => setChecklist([])});
  }

  return (
    <>
      <div style={{'display': 'flex', 'marginBottom': '16px'}}>
        <DeleteBtn onClick={handleConfirmDelete} className={styles.mr}>一括削除</DeleteBtn>
        <DownloadCsvBtn onClick={() => { 
          csvOutputMethod({ 
            url:`/api/admin/news/csv`, 
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
                      handleCheckAll(news); 
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
              <Th>タグ</Th>
              <Th>最終更新者</Th>
              <Th>投稿日</Th>
              <Th>更新日</Th>
            </Row>
          </thead>
          <tbody>
          { news.map((item) =>
              <Row key={item.id} className={checklist.includes(item.id) ? styles.checked_row: ''}>
                <Td><InputCheckbox onChange={handleCheck} value={item.id} checked={checklist.includes(item.id)} className={styles.table_check}/></Td>
                <Td>{item.id}</Td>
                <Td><EditLink to={`/admin/news/${item.id}/edit`}>編集</EditLink></Td>
                <Td>{item.is_published_text}</Td>
                <Td><Image src={item.thumbnail} type='info_list' width='40px'/></Td>
                <Td>{item.title}</Td>
                <Td>{item.brand_name}</Td>
                <Td>{item.gender_category_text}</Td>
                <Td>{item.tags.join(' / ')}</Td> 
                <Td>{item.full_name && item.full_name_kana && (`${item.full_name}(${item.full_name_kana})`)}</Td>
                <Td>{item.posted_at}</Td>
                <Td>{item.modified_at}</Td>
              </Row>
            )
          }
          </tbody>
        </table>
      </div>
    </>
  );
});


export default NewsTable;