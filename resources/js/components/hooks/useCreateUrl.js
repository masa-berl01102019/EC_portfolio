export const useCreateUrl = (baseUrl, params) => {

    const arr = [];
    let filter_obj = {};

    if(params.filter) {
        Object.entries(params.filter).map(([key, value]) => {
            let str = '';
            if(key === 'search') { // For search keyword
                // Delete blank in back and forth
                str = value.replace(/^\s+|\s+$/g,'');
                // Replace blank between characters with comma 
                str = str.replace(/\s+/g,',');
            } else if (Array.isArray(value) && value.length > 0) { // For checkbox
                // Convert Arrays into strings which is split by comma
                str = value.join(',');
            }  else if(typeof value === "string" || value instanceof String) { // For select
                // Delete blank in back and forth
                str = value.replace(/^\s+|\s+$/g,'');
            }
            // * Put 'f_' in front of key in order to distinguish between filter and sort
            filter_obj = {
                ...filter_obj,
                ['f_' + [key]]: str
            }
        });
    }

    let obj = {
        page: params.paginate.current_page ? params.paginate.current_page: '',
        per_page: params.paginate.per_page ? params.paginate.per_page: '',
        ...params.sort,
        ...filter_obj
    }

    Object.entries(obj).map(([key, value]) => {
        // assign if the value isn't blank
        if(value !== '') {
            // store strings at Arrays like 'key=value'
            arr.push(`${key}=${value}`);
        }
    });

    // Checking if there is generated url parameter in array
    if(arr.length > 0) {
        // return url with url parameter
        return baseUrl + '?' + arr.join('&');
    } else {
        // return url without url parameter
        return baseUrl;
    }

};

