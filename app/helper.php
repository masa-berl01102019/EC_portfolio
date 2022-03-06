<?php 

use Illuminate\Support\Facades\Storage;

/**
 * CSVダウンロード
 * @param array $csv_body
 * @param array $csv_header
 * @param string $filename
 */
function csvExport($csv_body, $csv_header, $filename)
{
    // SplFileObjectのインスタンスを生成
    $file = new \SplFileObject('php://output', 'w');
    // EXCEL(デフォルトがShift-JIS形式)で開いた時に日本語が文字化けしないように、UTF-8のBOM付きにするためにBOMを書き込み
    $file->fwrite(pack('C*',0xEF,0xBB,0xBF));
    // ヘッダーの読み込み
    $file->fputcsv($csv_header);
    // 一行ずつ連想配列から値を取り出して配列に格納
    for($i = 0; $i < count($csv_body); $i++){
        $file->fputcsv($csv_body[$i]);
    }
    // headerの設定 * フィル名の文字化け対策
    $headers = array(
      'Content-Type' => 'text/csv',
      'Content-Disposition' => 'attachment; filename*=UTF-8\'\''.rawurlencode($filename)
    );
    return response()->make($file, 200, $headers);
}

/**
 * 重複を排除して配列を整形する関数
 *  重複の削除後に配列の連番を振り直さないとフロント側で受け取る際にオブジェクトに勝手に変換されてしまうので
 * @param array $arr
 */
function uniqueArray($arr)
{
    return array_values(array_unique($arr));
}

/**
 * 画像の保存・更新する関数
 * @param object $file
 * @param string $old_img_url
 */
function saveImage($file, $old_img_url = null)
{
    // ランダムなファイル名を生成してstorage/app/public/img配下に保存
    $path_as = Storage::putFile('public/img', $file);
    // 画像を呼び出す場合は/storage/img/ファイル名で呼び出す必要があるのでDB保存用にpathを変更
    $db_reserve_path = str_replace('public/img/', '/storage/img/', $path_as);
    // 第二引数に既にDBに保存されている画像のURLが渡された場合は以下の処理
    if($old_img_url !== null) {
        // 変更時はブログの古いサムネイル画像を削除する必要があるのでパスを取得して変換
        $old_img = str_replace('/storage/img/', 'public/img/', $old_img_url);
        // fileの存在をチェックして削除
        if(Storage::exists($old_img)) Storage::delete($old_img);
    }
    return $db_reserve_path;
}