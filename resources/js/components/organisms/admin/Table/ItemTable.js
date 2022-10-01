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


const ItemTable = memo(({items, className = '', deleteMethod, csvOutputMethod}) => {

  // テーブルのデータに対しての操作の関心を分ける
  const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();

  const [checkItemAll, setCheckItemAll] = useState(false);

  return (
    <>
      <div style={{'display': 'flex', 'marginBottom': '16px'}}>
        <DeleteBtn onClick={() => {
            let answer = confirm(`選択項目${checklist.length}件を削除しますか？`);
            answer && deleteMethod({url:`/api/admin/items`, form:checklist, callback: () => setChecklist([])});
        }} className={styles.mr}>一括削除</DeleteBtn>
        <DownloadCsvBtn onClick={() => { 
          csvOutputMethod({ 
            url:`/api/admin/items/csv`, 
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
                      handleCheckAll(items); 
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
              <Th>品番</Th>
              <Th>商品名</Th>
              <Th>価格</Th>
              <Th>原価</Th>
              <Th>カラー展開</Th>
              <Th>サイズ展開</Th>
              <Th>生産国</Th>
              <Th>混用率</Th>
              <Th>ブランドカテゴリ</Th>
              <Th>性別カテゴリ</Th>
              <Th>メインカテゴリ</Th>
              <Th>サブカテゴリ</Th>
              <Th>タグ</Th>
              <Th>最終更新者</Th>
              <Th>投稿日</Th>
              <Th>更新日</Th>
            </Row>
          </thead>
          <tbody>
          { items.map((item) =>
              <Row key={item.id} className={checklist.includes(item.id) ? styles.checked_row: ''}>
                <Td><InputCheckbox onChange={handleCheck} value={item.id} checked={checklist.includes(item.id)} className={styles.table_check}/></Td>
                <Td>{item.id}</Td>
                <Td><EditLink to={`/admin/items/${item.id}/edit`}>編集</EditLink></Td>
                <Td>{item.is_published_text}</Td>
                <Td>{item.product_number}</Td>
                <Td>{item.item_name}</Td>
                <Td>{item.price_text}</Td>
                <Td>{item.cost_text}</Td>
                <Td>{item.color_variation.join(' / ') }</Td>
                <Td>{item.size_variation.join(' / ') }</Td>
                <Td>{item.made_in}</Td>
                <Td>{item.mixture_ratio}</Td>
                <Td>{item.brand_name}</Td>
                <Td>{item.gender_category}</Td>
                <Td>{item.main_category}</Td>
                <Td>{item.sub_category}</Td>
                <Td>{item.tags.join(' / ') }</Td>
                <Td>{item.full_name && item.full_name_kana && (`${item.full_name}(${item.full_name_kana})`)}</Td>
                <Td>{item.posted_at}</Td>
                <Td>{item.modified_at}</Td>
              </Row>
            )
          }
          </tbody>
        </table>
      </div>
      {/* <p>* サイズ・カラーはSKUに登録されたものが一覧に表示されてます</p> */}
    </>
  );
});


export default ItemTable;