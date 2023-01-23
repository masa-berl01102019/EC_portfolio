import React from 'react';

export const useDownloadCsv = (data, fileName) => {
    //ダウンロードするCSVファイル名を指定する
    const filename = fileName;
    //BOMを付与する（Excelでの文字化け対策）
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    //Blobでデータを作成する
    const blob = new Blob([bom, data], { type: "text/csv" });
    //ダウンロード用にリンクを作成する
    const link = document.createElement('a');
    //BlobからオブジェクトURLを作成してリンク先に指定する
    link.href = window.URL.createObjectURL(blob);
    //download属性にファイル名を指定する
    link.download = filename;
    //作成したリンクをクリックしてダウンロードを実行する
    link.click();
    //createObjectURLで作成したオブジェクトURLを開放する
    window.URL.revokeObjectURL(link.href);
};

export const getFileName = (contentDisposition) => {
    // 「attachment; filename=.csv; filename*=utf-8''URIエンコードされたファイル名.csv」の形でHTTPレスポンスヘッダーのcontent-dispositionに格納されてるので引数で取得
    // indexOf()でファイル名の開始位置を取得してsubstring()で開始位置以降の文字列を取得
    let fileName = contentDisposition.substring(contentDisposition.indexOf("''") + 2);
    //　エンコードされたファイル名をdecodeURI()でデコード　＊デコードの際にスペースが"+"になるのでスペースへ置換して変数に格納
    fileName = decodeURI(fileName).replace(/\+/g, " ");
    // ファイル名を返却
    return fileName;
}
