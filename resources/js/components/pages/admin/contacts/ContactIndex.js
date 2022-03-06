import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';
import Pagination from 'react-js-pagination'; // パラメータ https://www.npmjs.com/package/react-js-pagination
import useFetchApiData from "../../../hooks/useFetchApiData";
import useInputCheckBox from "../../../hooks/useInputCheckBox";
import useCreateParams from "../../../hooks/useCreateParams";
import {useCreateUrl} from "../../../hooks/useCreateUrl";
import { useParamsContext } from '../../../context/ParamsContext';

function ContactIndex() {

    // urlの設定
    const baseUrl = `/api/admin/contacts`;
    // paramsの適用範囲を決めるscope名を定義
    const model = 'CONTACT';
    // URLパラメータ変更のフックの呼び出し
    const [dateRangeStart, dateRangeEnd, dateRangeField, {handleFilter, handleFilterCheckbox, handleFilterDateRange, handleCurrentPage, handlePerPage, handleSort}] = useCreateParams();
    // checkboxフックの呼び出し
    const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();
    // useContext呼び出し
    const {params, setParams, scope, setScope} = useParamsContext();
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', [],  model);
    // APIから取得したデータを変数に格納
    const contacts = data.data? data.data: null;

    useEffect(() => {
        // paramsのデフォルト値と適用範囲を設定
        if(scope === null || scope !== model) { // 全てのページにおいての初回読み込みなので初期値を代入
            console.log('CONTACTにてparamsの初期値をセットしてscopeを変更');
            setParams({
                ...params,
                sort: { 'last_name_kana' : '', 'created_at' : '', 'updated_at' : '' },
                filter: { 'keyword' : '', 'response_status' : [], 'dateRange': {} },
            });
            setScope(model);
        }
        // ユーザー削除に成功した場合にdelete:trueが帰ってくるので条件分岐
        if(data.delete && data.delete === true) {
            // ページネーションの設定を保持して再度読み込み
            dispatch({ type: 'READ', url: useCreateUrl(baseUrl, params) });
            // ステートの配列を初期化
            setChecklist([]);
        }
    },[data]);

    // 描画のみを担当
    return (
        isLoading ? (
            <CircularProgress disableShrink />
        ) : errorMessage && errorMessage.httpRequestError ? (
            <p style={{'color': 'red'}}>{errorMessage.httpRequestError}</p>
        ) : (
            <>
                <h1>お問い合わせ一覧</h1>
                <button onClick={() => {
                    let answer = confirm(`選択項目${checklist.length}件を解除しますか？`);
                    answer && handleUnCheckAll();
                }}>選択解除</button>
                <button onClick={ () => {
                    let answer = confirm(`選択項目${checklist.length}件を削除しますか？`);
                    answer && dispatch({type:'DELETE', url:`/api/admin/contacts`, form:checklist});
                }}>一括削除</button>
                <button onClick={ () => {
                        dispatch({ type:'CREATE', url:`/api/admin/contacts/csv`, form:checklist })
                }}>CSV出力</button>

                {   Object.keys(params.filter).length > 0 && scope === model &&

                    <div className={'filter'}>
                        <h3>フィルター機能</h3>
                        <div>
                            <span>キーワード検索</span>
                            <input type='text' name='keyword' onBlur={handleFilter} defaultValue={params.filter.keyword} placeholder={'名前を検索'}/>
                        </div>
                        <div>
                            <span style={{'marginRight': '20px'}}>対応状況</span>
                            <label><input type='checkbox' name='response_status' onChange={handleFilterCheckbox} value={0} checked={params.filter.response_status.includes(0)} />未対応</label>
                            <label><input type='checkbox' name='response_status' onChange={handleFilterCheckbox} value={1} checked={params.filter.response_status.includes(1)} />対応中</label>
                            <label><input type='checkbox' name='response_status' onChange={handleFilterCheckbox} value={2} checked={params.filter.response_status.includes(2)} />対応済</label>
                        </div>
                        <div>
                            <span>期間指定</span>
                            <select name='field' ref={dateRangeField} value={Object.keys(params.filter.dateRange)[0]} onChange={handleFilterDateRange}>
                                <option value={'clear'}>フィールド選択</option>
                                <option value={'created_at'}>お問い合わせ日</option>
                                <option value={'updated_at'}>対応日</option>
                            </select>
                            <input type='number' name='start' ref={dateRangeStart} onBlur={handleFilterDateRange} defaultValue={Object.values(params.filter.dateRange).length > 0 ? Object.values(params.filter.dateRange)[0][0]: ''} placeholder={'19500101'} />　〜　
                            <input type='number' name='end' ref={dateRangeEnd} onBlur={handleFilterDateRange} defaultValue={Object.values(params.filter.dateRange).length > 0 ? Object.values(params.filter.dateRange)[0][1]: ''} placeholder={'1980101'} />
                        </div>
                    </div>
                }

                {   Object.keys(params.sort).length > 0 && scope === model &&

                    <div className={'sort'}>
                        <h3>ソート機能</h3>
                        <label>氏名(カナ)
                            <select name='last_name_kana' value={params.sort.last_name_kana} onChange={handleSort}>
                                <option value={''}>未選択</option>
                                <option value={'desc'}>降順</option>
                                <option value={'asc'}>昇順</option>
                            </select>
                        </label>
                        <label>お問い合わせ日
                            <select name='created_at' value={params.sort.created_at} onChange={handleSort}>
                                <option value={''}>未選択</option>
                                <option value={'desc'}>降順</option>
                                <option value={'asc'}>昇順</option>
                            </select>
                        </label>
                        <label>対応日
                            <select name='updated_at' value={params.sort.updated_at} onChange={handleSort}>
                                <option value={''}>未選択</option>
                                <option value={'desc'}>降順</option>
                                <option value={'asc'}>昇順</option>
                            </select>
                        </label>
                    </div>
                }

                <table border="1" style={{'display': 'block', 'overflowX': 'scroll', 'borderCollapse': 'collapse', 'whiteSpace': 'nowrap'}}>
                    <thead>
                        <tr>
                            <th><button onClick={() => { handleCheckAll(contacts) }}>全選択</button></th>
                            <th>ID</th>
                            <th>編集</th>
                            <th>会員ID</th>
                            <th>氏名</th>
                            <th>氏名(カナ)</th>
                            <th>電話番号</th>
                            <th>メールアドレス</th>
                            <th>お問い合わせ日</th>
                            <th>タイトル</th>
                            <th>お問い合わせ内容</th>
                            <th>対応状況</th>
                            <th>対応者</th>
                            <th>備考欄</th>
                            <th>対応日</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        // 最初にUserIndex() -> DataFetchApi() -> UserIndex() と呼び出されてる間でも先に描画が走るがdata.contactsは空なのでエラーになってしまう
                        // なのでdata.contactsがあれば表示すると条件をつければいい
                        contacts && !errorMessage &&
                        contacts.map((contact) =>
                            <tr key={contact.id}>
                                {/* ページネーションで別のページに遷移した際にチェックが外れてしまわないようにlist.includes()でステートの配列に含まれてる値IDとユーザーのIDが一致する時にチェックがつくようにセット */}
                                <td><input type='checkbox' onChange={handleCheck} value={contact.id} checked={ checklist.includes(contact.id) } /></td>
                                <td>{contact.id}</td>
                                <td><Link to={`/admin/contacts/${contact.id}/edit`}>編集</Link></td>
                                <td>{contact.user_id}</td>
                                <td>{contact.full_name}</td>
                                <td>{contact.full_name_kana}</td>
                                <td>{contact.tel}</td>
                                <td>{contact.email}</td>
                                <td>{contact.created_at}</td>
                                <td><span style={{ 'display':'block', 'width': '318px', 'overflowX':'hidden' }}>{contact.title}</span></td>
                                <td><span style={{ 'display':'block', 'width': '318px', 'overflowX':'hidden' }}>{contact.body}</span></td>
                                <td>{contact.response_status_text}</td>
                                <td>{contact.full_name && contact.full_name_kana && (`${contact.full_name}(${contact.full_name_kana})`)}</td>
                                <td><span style={{ 'display':'block', 'width': '318px', 'overflowX':'hidden' }}>{contact.memo}</span></td>
                                <td>{contact.updated_at}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
                { data.meta &&
                    <>
                        <label>行数<input type='number' onBlur={handlePerPage} defaultValue={data.meta.per_page} style={{'width': '40px'}} /></label>
                        <div>検索結果{data.meta.total}</div>
                        <div>現在のページ{data.meta.current_page}</div>
                        <Pagination
                            activePage={data.meta.current_page}
                            itemsCountPerPage={data.meta.per_page}
                            totalItemsCount={data.meta.total}
                            pageRangeDisplayed={data.meta.page_range_displayed}
                            onChange={handleCurrentPage}
                        />
                    </>
                }
            </>
        )
    );
}

export default ContactIndex;



