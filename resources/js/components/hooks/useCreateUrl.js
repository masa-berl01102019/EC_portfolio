export const useCreateUrl = (baseUrl, params) => {

    // 配列の初期化
    const arr = [];
    // フィルター用のオブジェクトを生成
    let filter_obj = {};

    if(params.filter) {
        Object.entries(params.filter).map(([key, value]) => {
            // 空の文字列を定義
            let str = '';
            if(key === 'search') { // input 検索用
                // 前後の空白を削除
                str = value.replace(/^\s+|\s+$/g,'');
                // 文字列間のスペースをカンマに置換
                str = str.replace(/\s+/g,',');
            } else if (Array.isArray(value) && value.length > 0) { // checkbox用
                // 配列をカンマ区切りの文字列に変換
                str = value.join(',');
            }  else if(typeof value === "string" || value instanceof String) { // select用
                // 前後の空白を削除
                str = value.replace(/^\s+|\s+$/g,'');
            }
            // オブジェクトに分割代入 * filterとsortを区別するためにfilterに関しては「f_」をつける
            filter_obj = {
                ...filter_obj,
                ['f_' + [key]]: str
            }
        });
    }

    // オブジェクトの整形 * sortはオブジェクト形式を展開して代入 paginationはパラメータ作成に必要な値を引っ張って代入
    let obj = {
        page: params.paginate.current_page ? params.paginate.current_page: '',
        per_page: params.paginate.per_page ? params.paginate.per_page: '',
        ...params.sort,
        ...filter_obj
    }

    // ステートはオブジェクト形式なのでObject.entries()で配列形式に変換してmap()で展開
    Object.entries(obj).map(([key, value]) => {
        // valueが空文字列の場合はクエリ文字列を生成する配列から抜く
        if(value !== '') {
            // key=valueの形にして配列に格納
            arr.push(`${key}=${value}`);
        }
    });

    // 生成されたパラーメタが配列が空かどうか条件分岐
    if(arr.length > 0) {
        // 引数で受けたurlにクエリパラメータがついているかどうかチェックして生成されたパラメータを代入したURLを返却
        return baseUrl + '?' + arr.join('&');
    } else {
        // パラメータなしのURLを返却
        return baseUrl;
    }

};

