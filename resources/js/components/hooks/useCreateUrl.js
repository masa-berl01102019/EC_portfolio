import React from 'react';

export const useCreateUrl = (baseUrl, params) => {

    // 配列の初期化
    const arr = [];

    // オブジェクトの整形　* sortはオブジェクト形式を展開して代入　paginationはパラメータ作成に必要な値を引っ張って代入
    let obj = {
        page: params.paginate ? params.paginate.current_page: '',
        per_page: params.paginate ? params.paginate.per_page: '',
        ...params.sort
    }

    // ステートはオブジェクト形式なのでObject.entries()で配列形式に変換してmap()で展開
    Object.entries(obj).map(([key, value]) => {
        // ステートがから文字列の場合は処理を飛ばす条件分岐
        if(value !== '') {
            // key=valueの形にして配列に格納
            arr.push(`${key}=${value}`);
        }
    });

    // 生成されたパラーメタが配列が空かどうか条件分岐
    if(arr.length !== 0) {
        // 引数で受けたurlにクエリパラメータがついているかどうかチェックして生成されたパラメータを代入したURLを返却
        return baseUrl + '?' + arr.join('&');
    } else {
        // パラメータなしのURLを返却
        return baseUrl;
    }

};

