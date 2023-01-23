import React, {useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';
import useFetchApiData from "../../../hooks/useFetchApiData";
import useForm from "../../../hooks/useForm";

// TODO 期間指定のフィルター機能を修正(カレンダーで選択する / パラメータがセットされてる時にクリアボタンを表示する)

function CategoryIndex() {

    // urlの設定
    const baseUrl = `/api/admin/categories`;
    // APIと接続して返り値を取得
    const [{isLoading, errorMessage, data}, dispatch] = useFetchApiData(baseUrl, 'get', []);
    // APIから取得したデータを変数に格納
    const categories = data.categories? data.categories: null;
    // 新規登録用フォーム項目の初期値をuseStateで管理
    const [formData, {handleFormData}] = useForm({'category_name': '', 'parent_id': ''});
    // 選択されたカテゴリーのIDをuseStateで管理
    const [editableForm, setEeditableForm] = useState(null);
    // 編集用の入力値をuseStateで管理
    const [editCategory, setEditCategory] = useState(null);

    useEffect(() => {
        // ユーザー削除に成功した場合にdelete:trueが帰ってくるので条件分岐
        if(data.update === true || data.create === true || data.delete === true) {
            // ページネーションの設定を保持して再度読み込み
            dispatch({ type: 'READ', url: baseUrl });
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
                <h1>カテゴリーマスタ</h1>
                { errorMessage && <p style={{'color': 'red'}}>{errorMessage.category_name}</p> }
                { errorMessage && <p style={{'color': 'red'}}>{errorMessage.parent_id}</p> }
                <br />
                <br/>
                <ul>
                    { categories &&
                        categories.map((category) =>
                            <li key={category.id} style={{'display': 'flex', 'justifyContent': 'space-between', 'width': '900px', 'marginBottom': '30px','borderLeft': '1px solid #666', 'padding': '0 8px 4px'}}>
                                { category.id === editableForm ? (
                                    <div>                                    
                                        <input type="text" name="category_name" onChange={e => setEditCategory(e.target.value)} defaultValue={category.category_name} placeholder='カテゴリー名' style={{'width': '60%'}}/>
                                        <button onClick={() => { dispatch({type:'UPDATE', form: {category_name: `${editCategory}`},  url:`/api/admin/categories/${category.id}`});}}>編集</button>
                                        <button onClick={ () => {
                                            let answer = confirm(`選択カテゴリーを本当に削除しますか？`);
                                            answer && dispatch({type:'DELETE', url:`/api/admin/categories/${category.id}`});
                                        }}>削除</button>
                                    </div>
                                    ) : (
                                    <div style={{'color' : 'skyblue'}} onClick={() => {
                                        setEditCategory(category.category_name);
                                        setEeditableForm(category.id);
                                    }}>{category.category_name}</div>
                                  )
                                }
                                <ul>
                                    { category.children &&
                                        category.children.map((child) =>
                                            <li key={child.id} style={{'display': 'flex', 'justifyContent': 'space-between', 'width': '600px', 'marginBottom': '30px', 'borderLeft': '1px solid #666', 'padding': '0 8px 4px'}}>
                                                { child.id === editableForm ? (
                                                    <div>                                    
                                                        <input type="text" name="category_name" onChange={e => setEditCategory(e.target.value)} defaultValue={child.category_name} placeholder='カテゴリー名' style={{'width': '60%'}}/>
                                                        <button onClick={() => { dispatch({type:'UPDATE', form: {category_name: `${editCategory}`},  url:`/api/admin/categories/${child.id}`});}}>編集</button>
                                                        <button onClick={ () => {
                                                            let answer = confirm(`選択カテゴリーを本当に削除しますか？`);
                                                            answer && dispatch({type:'DELETE', url:`/api/admin/categories/${child.id}`});
                                                        }}>削除</button>
                                                    </div>
                                                    ) : (
                                                    <div style={{'color' : 'skyblue'}} onClick={() => {
                                                        setEditCategory(child.category_name);
                                                        setEeditableForm(child.id);
                                                    }}>{child.category_name}</div>
                                                )
                                                }
                                                <ul style={{'borderLeft': '1px solid #666', 'borderLeft': '1px solid #666'}}>
                                                    { child.grand_children &&
                                                        child.grand_children.map((grand_child) =>
                                                            <li key={grand_child.id}  style={{'display': 'flex', 'width': '300px', 'padding': '0 8px 4px'}}>
                                                                { grand_child.id === editableForm ? (
                                                                    <div>                                    
                                                                        <input type="text" name="category_name" onChange={e => setEditCategory(e.target.value)} defaultValue={grand_child.category_name} placeholder='カテゴリー名' style={{'width': '60%'}}/>
                                                                        <button onClick={() => { dispatch({type:'UPDATE', form: {category_name: `${editCategory}`},  url:`/api/admin/categories/${grand_child.id}`});}}>編集</button>
                                                                        <button onClick={ () => {
                                                                            let answer = confirm(`選択カテゴリーを本当に削除しますか？`);
                                                                            answer && dispatch({type:'DELETE', url:`/api/admin/categories/${grand_child.id}`});
                                                                        }}>削除</button>
                                                                    </div>
                                                                    ) : (
                                                                    <div style={{'color' : 'skyblue'}} onClick={() => {
                                                                        setEditCategory(grand_child.category_name);
                                                                        setEeditableForm(grand_child.id);
                                                                    }}>{grand_child.category_name}</div>
                                                                )
                                                                }
                                                            </li>
                                                        )
                                                    }
                                                    <li>
                                                        <input type='text' name='category_name' onBlur={handleFormData} placeholder='カテゴリー名' style={{'width': '60%'}}/>
                                                        <button type="submit" onClick={() => { dispatch({type: 'CREATE', form: {category_name: `${formData.category_name}`, parent_id: `${child.id}`}, url:'/api/admin/categories'}) }}>追加</button>
                                                    </li>
                                                </ul>
                                            </li>
                                        )
                                    }
                                    <li>
                                        <input type='text' name='category_name' onBlur={handleFormData} placeholder='カテゴリー名' style={{'width': '35%'}}/>
                                        <button type="submit" onClick={() => { dispatch({type: 'CREATE', form: {category_name: `${formData.category_name}`, parent_id: `${category.id}`}, url:'/api/admin/categories'}) }}>追加</button>
                                    </li>
                                </ul>
                            </li>
                        )
                    }
                </ul>
            </>
        )
    );
}

export default CategoryIndex;



