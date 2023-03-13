import { useRecoilState } from 'recoil'
import { paramState } from '../store/paramState';

const useCreateParams = (model) => {

  // Get parameter which is managed globally 
  const [params, setParams] = useRecoilState(paramState(model));

  /**
   * sort-related function the below
  */

  const handleSort = (e) => {
    // console.log('handleSort', params);
    setParams({
      ...params,
      sort: {
        ...params.sort,
        [e.target.name]: e.target.value
      }
    });
  }

  /**
  * paginate-related function the below
  */

  const handleCurrentPage = (pageNumber) => {
    // console.log('handleCurrentPage', params);
    setParams({
      ...params,
      paginate: {
        ...params.paginate,
        'current_page': pageNumber
      }
    });
  };

  const handlePerPage = (e) => {
    // console.log('handlePerPage', params);
    setParams({
      ...params,
      paginate: {
        ...params.paginate,
        'per_page': Number(e.target.value)
      }
    });
  };

  /**
  * filter-related function the below
  */

  // for input text / selectbox / input radio 
  const handleFilter = (e) => {
    // console.log('handleFilter', params);
    setParams({
      ...params,
      filter: {
        ...params.filter,
        [e.target.name]: e.target.value
      }
    });
  }

  // for input checkbox
  const handleFilterCheckbox = (e) => {
    // console.log('handleFilterCheckbox', params);
    let new_arr = [];
    const name = e.target.name; // name attribute of input is set DB column name
    const value = Number(e.target.value);
    // Checking if there is Specified DB column name at Array
    if (params.filter[name].includes(value)) {
      new_arr = params.filter[name].filter(item => item !== value);
    } else {
      new_arr = [...params.filter[name]];
      new_arr.push(value);
    }
    setParams({
      ...params,
      filter: {
        ...params.filter,
        [name]: new_arr
      }
    });
  };

  // for input checkbox clear
  const handleClearFilterCheckbox = (e) => {
    // console.log('handleClearFilterCheckbox', params);
    const name = e.target.name; // name attribute of input is set DB column name
    setParams({
      ...params,
      filter: {
        ...params.filter,
        [name]: []
      }
    });
  };

  const handleFilterDate = (date, name) => {
    // Format argument (date)  * date will be passed like 'Sat Feb 17 2018 14:43:00 GMT+0900' (timezone: Asia/Tokyo)
    let formatted_date = date !== null ? date.getFullYear() + "-" + ("00" + (date.getMonth() + 1)).slice(-2) + "-" + ("00" + date.getDate()).slice(-2) : null;

    // Not to call setParams function unless formatted_date variable is correct date format or completely blank
    if (formatted_date != null && formatted_date.match(/\d{4}\-\d{2}\-\d{2}/) != null || date == null) {
      setParams({
        ...params,
        filter: {
          ...params.filter,
          [name]: formatted_date
        }
      });
    }
  };

  const handleFilterDateClear = () => {
    setParams({
      ...params,
      filter: {
        ...params.filter,
        target_span: '',
        from: null,
        to: null,
      }
    });
  };

  const handleFilterCategory = (e) => {
    // console.log('handleFilterCategory', params);
    let new_obj;
    // Child category ID will be clear when parent category ID is changed
    if (e.target.name === 'gender_category') {
      new_obj = { 'gender_category': e.target.value, 'main_category': '', 'sub_category': '' };
    } else if (e.target.name === 'main_category') {
      new_obj = { 'main_category': e.target.value, 'sub_category': '' };
    } else {
      new_obj = { 'sub_category': e.target.value };
    }
    setParams({
      ...params,
      filter: {
        ...params.filter,
        ...new_obj
      }
    });
  }

  // For bread breadcrumb
  const handleBreadCrumbs = (target, brand, gender = '', main = '', sub = '') => {
    // console.log('handleBreadCrumbs', params);
    let new_obj;
    if (target === 'brand') {
      new_obj = { 'brand': [Number(brand)], 'gender_category': '', 'main_category': '', 'sub_category': '' };
    } else if (target === 'gender_category') {
      new_obj = { 'brand': [Number(brand)], 'gender_category': String(gender), 'main_category': '', 'sub_category': '' };
    } else if (target === 'main_category') {
      new_obj = { 'brand': [Number(brand)], 'gender_category': String(gender), 'main_category': String(main), 'sub_category': '' };
    } else {
      new_obj = { 'brand': [Number(brand)], 'gender_category': String(gender), 'main_category': String(main), 'sub_category': String(sub) };
    }
    setParams({
      ...params,
      filter: {
        ...params.filter,
        ...new_obj
      }
    });
  }

  return { params, setParams, handleSort, handleCurrentPage, handlePerPage, handleFilter, handleFilterCheckbox, handleClearFilterCheckbox, handleFilterCategory, handleFilterDate, handleFilterDateClear, handleBreadCrumbs };
}

export default useCreateParams;
