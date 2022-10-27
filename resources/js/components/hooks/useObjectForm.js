import React from 'react';
import useHelper from "./useHelper";

 // オブジェクトを送信するラッパー関数
const useObjectForm = (formData, setFormData, dispatch) => {

  // 便利関数の呼び出し
  const {isObject} = useHelper();

  // content-typeを'multipart/form-data'にしないと送信出来ないフォームの送信 ex) 画像等のファイル形式
  const handleSendObjectForm = (sendUrl, callback) => {
    console.log('handleSendObjectForm');
    // FormDataオブジェクトのインスタンス生成
    const params = new FormData();
    // formオブジェクトを展開
    Object.entries(formData).forEach(([key, value]) => {
        // valueが配列形式か判定
        if(Array.isArray(value)) {
            // 配列を展開
            for(let i = 0; i < value.length; i++) {
                // 展開した配列内に複数オブジェクトを持つか単純な配列か判定
                if(isObject(value[i])) {
                    // FormDataは配列やオブジェクトそのままappend()で追加出来ないので formData.images = [ {id:'1', item_id:'2'...} {id:'2', item_id:'3'...}] の場合
                    // 全て展開してkey: valueの形でappend()で代入する際に文字列を下記のように加工すればサーバー側に渡る際にオブジェクトの形式で渡せる
                    Object.entries(value[i]).forEach(([key2, value2]) => {
                        // formオブジェクトはnullを文字列にしてしまうので空文字に修正
                        params.append(key+'['+i+']['+key2+']', value2 === null ? '': value2)
                    })
                } else {
                    // 全て展開してkey[]: valueの形でappend()で代入すればサーバー側に渡る際に配列の形式で渡せる
                    params.append(key+'[]', value[i] === null ? '': value[i])
                }
            }
        } else {
            params.append(key, value === null ? '': value);
        }
    });
    // axiosで画像等のファイル形式を送信する際はcontent-typeを'multipart/form-data'にしないと送信出来ない
    // post形式でないと正しく送れない * axiosの仕様的な問題？？
    // dispatch({type: 'CREATE', form: params, url: sendUrl, headers: {'content-type': 'multipart/form-data'} });
    dispatch({ 
        form: params, 
        url: sendUrl, 
        headers: {'content-type': 'multipart/form-data'}, 
        callback: callback 
    });
  }

  // オブジェクトFormの追加
  const handleInsertObjectForm = (table_name, exceptInitilizeColumns = []) => {
    console.log('handleInsertObjectForm');
    let new_obj = {};
    if(formData[table_name].length > 0) {
        // スプレッド構文でオブジェクトのコピー
        new_obj = {...formData[table_name][0]}
        // オブジェクトを展開して初期化
        for (let key in new_obj) {
            if(exceptInitilizeColumns.includes(key)) continue; // 初期化しないカラム名があればスキップする
            new_obj[key] = ''; // 値の初期化
        }
        // ステートを更新して再描画走らせる
        setFormData({
            ...formData,
            [table_name] : [
                ...formData[table_name],
                new_obj
            ]
        });
    }
  }
 
  // オブジェクトFormの削除
  const handleDeleteObjectForm = (table_name, index, id) => {
    console.log('handleDeleteObjectForm');
    if(formData[table_name].length > 1) {
        // 新規で動的に追加したフォームの場合はＩＤないので条件分岐
        if(id) {
            // 削除のリクエスト送信
            dispatch({type:'DELETE', url:`/api/admin/items/${table_name}/${id}`});
        } else {
            // 配列からindex番目のオブジェクトを1個削除
            formData[table_name].splice(index,1);
            // ステートを更新して再描画走らせる
            setFormData({
                ...formData
            });
        }
    } 
  }

  // オブジェクトFormのカラムの値の更新
  const handleChangeObjectForm = (table_name, index, e) => {
    console.log('handleChangeObjectForm');
    const name = e.target.name; // name属性にDBのカラム名を指定しているので取得
    const recode = formData[table_name][index] // 配列のindex番目のオブジェクト取得
    if(e.target.files && e.target.files.length > 0) { // 画像か判定
      const file = e.target.files && e.target.files[0]; // fileオブジェクトを変数に格納
      const imageUrl = URL.createObjectURL(file); // 新しいオブジェクトURLを生成
      recode[name] = imageUrl; // 配列のindex番目のオブジェクトの特定カラムを更新 *画像プレビューのセット用
      recode['file'] = file; // fileというカラム名を追加してfileオブジェクトを格納
    } else {
      // e.target.valueで渡って来るとき数値も文字列でキャストされた状態で渡って来る
      // 現時点では更新する値は数値のみなので数値にキャストしてる
      recode[name] = e.target.value !== '' ? Number(e.target.value): ''; // 配列のindex番目のオブジェクトの特定カラムを更新
    }
    // ステートを更新
    setFormData({
        ...formData,
        [table_name] : [
            ...formData[table_name],
        ]
    });
  }

  return {handleSendObjectForm, handleInsertObjectForm, handleDeleteObjectForm, handleChangeObjectForm};
}

export default useObjectForm;