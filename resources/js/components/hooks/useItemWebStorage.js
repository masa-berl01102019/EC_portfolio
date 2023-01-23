

const useItemWebStorage = () => {

    const handleViewItemWebStorage = (item, cookie_id_arr = []) => {
        
        //  local_storageの商品情報をdecodeして変数に格納 
        const local_storage = JSON.parse(localStorage.getItem('viewed_items'));
        //  cookieが消えてもlocalStrageは残り続けてしまうのでcookieと同期
        const storage_arr = local_storage && local_storage.length > 0 ? local_storage.filter(list => cookie_id_arr.includes(list.id)) : [];
        // local_storageの商品情報からIDのみを配列で抜き出す;
        const storage_id_arr = storage_arr.length > 0 ? storage_arr.map(list => list.id) : [];

        // オブジェクトの生成
        const storage_info = {
            'id' : item.id,
            'brand_name' : item.brand_name,
            'item_name' : item.item_name,
            'included_tax_price_text' : item.included_tax_price_text,
            'top_image' : item.top_image,
            'url' : window.location.href,
        };

        // localStorageに保存されてる商品IDと渡ってきたIDが一致しないもしくは空の場合
        if(!storage_id_arr.includes(item.id) || storage_arr.length == 0) {
            // 配列の先頭に追加
            storage_arr.unshift(storage_info);
            // local storageに保存
            localStorage.setItem('viewed_items', JSON.stringify(storage_arr));
        }

    }

    return {handleViewItemWebStorage};
}

export default useItemWebStorage;
