

const useItemWebStorage = () => {

    const handleViewItemWebStorage = (item, cookie_id_arr = []) => {
        
        //  Decode item info from local storage and assign it to variable
        const local_storage = JSON.parse(localStorage.getItem('viewed_items'));
        //  Synchronize localStrage with cookie because value which is stored in localStorage leave permanently.
        const storage_arr = local_storage && local_storage.length > 0 ? local_storage.filter(list => cookie_id_arr.includes(list.id)) : [];
        // Pull item ID out from localStorage
        const storage_id_arr = storage_arr.length > 0 ? storage_arr.map(list => list.id) : [];

        const storage_info = {
            'id' : item.id,
            'brand_name' : item.brand_name,
            'item_name' : item.item_name,
            'included_tax_price_text' : item.included_tax_price_text,
            'top_image' : item.top_image,
            'url' : window.location.href,
        };

        // Check if item ID which is stored in localStorage correspond with item ID passed by argument , or arrays is empty
        if(!storage_id_arr.includes(item.id) || storage_arr.length == 0) {
            // Added item ID to arrays
            storage_arr.unshift(storage_info);
            // Store item ID in localStorage
            localStorage.setItem('viewed_items', JSON.stringify(storage_arr));
        }

    }

    return {handleViewItemWebStorage};
}

export default useItemWebStorage;
