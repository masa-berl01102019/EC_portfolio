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
