<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Download CSV
 * @param array $csv_body
 * @param array $csv_header
 * @param string $filename
 */
function csvExport($csv_body, $csv_header, $filename)
{
    // create an instace of the SplFileObject class
    $file = new \SplFileObject('php://output', 'w');
    // Attach BOM （Not to garble in Excel）* EXCEL is shift-JIS by default
    $file->fwrite(pack('C*', 0xEF, 0xBB, 0xBF));
    // Read header line of CSV
    $file->fputcsv($csv_header);
    // Retrieve values from an associative array row by row and store them in the array
    for ($i = 0; $i < count($csv_body); $i++) {
        $file->fputcsv($csv_body[$i]);
    }
    // Set request header
    $headers = array(
        'Content-Type' => 'text/csv',
        'Content-Disposition' => 'attachment; filename*=UTF-8\'\'' . rawurlencode($filename)
    );
    return response()->make($file, 200, $headers);
}

/**
 * Removes duplicate values and creates a new array
 * @param array $arr
 */
function uniqueArray($arr)
{
    return array_values(array_unique($arr));
}

/**
 * Store / update images
 * @param object $file
 * @param string $old_img_url
 */
function saveImage($file, $old_img_url = null)
{
    // Store the file which is generated random file name under 'storage/app/public/img'
    $path_as = Storage::putFile('public/img', $file);
    // Change path of the file which is stored in order to call from front-end
    $db_reserve_path = str_replace('public/img/', '/storage/img/', $path_as);
    // Check whether there is an old image url which want to change
    if ($old_img_url !== null) {
        // Change path of the old file which is gotten from DB
        $old_img = str_replace('/storage/img/', 'public/img/', $old_img_url);
        // Delete the file after checking its existence
        if (Storage::exists($old_img)) Storage::delete($old_img);
    }
    return $db_reserve_path;
}

/**
 * Get an array assigned tag IDs related with item ID which will be passed
 * @param int $item_id
 * @return array
 */
function getRelatedTagId($item_id)
{
    return DB::table('item_tag')->where('item_id', $item_id)->pluck('tag_id')->toArray();
}

/**
 * Get an array assigned catwgoey IDs related with item ID which will be passed
 * @param int $item_id
 * @return array
 */
function getRelatedCategoryId($item_id)
{
    return DB::table('category_item')->where('item_id', $item_id)->pluck('category_id')->toArray();
}
