import {useQuery, useMutation, useQueryClient} from 'react-query';
import axios from 'axios';
import useSetErrorMsg from "./useSetErrorMsg";
import {useDownloadCsv, getFileName} from "./useDownloadCsv";
import useToastify from '../context/ToastifyContext';


const useFetchApiData = (url, model) => {
    // Get lang which has been used in browser from localStorage or assign default lang
    const locale = {'X-Request-Locale': localStorage.getItem('lang') || 'en'};
    // Checking whether api request is for admin  
    const isAdmin = url.startsWith('/api/admin/');
    // Call error handling custom hook 
    const [errorMessage, {setErrorMessage, handleApiErrorMessage}] = useSetErrorMsg(null);
    // Call toast custom hook in order to display API message
    const toast = useToastify();
    // Get queryClient which is passed by react-query provider in App.js
    // * It can refetch data / get cache / update cache etc to designate key
    const queryClient = useQueryClient();
    // Get data
    const { data: {data} } = useQuery(
      [model, url],
      async () => {
        setErrorMessage(null);
        return await axios({ method: 'get', url: url, headers: locale });
      },
      { 
        // onSuccess: (res) => console.log(res.data),
        onError: (err) =>  handleApiErrorMessage(err),
      }
    );
    // create method
    const {mutate: createData} = useMutation(
      async (obj) => {
        setErrorMessage(null);
        const {url, form, headers} = obj;
        // console.log(url, form, {...headers, ...locale});
        return await axios({ method: 'post', url: url, data: form, headers: {...headers, ...locale} });
      },
      { 
        onSuccess: (res, obj) => {
          // Display success message
          isAdmin && toast({message: res.data.message});
          // Catch callback function as argument and execute if there is it, after API request is done successfully.
          const {callback} = obj;
          callback !== undefined && callback();
          queryClient.invalidateQueries(model)
        },
        onError: (err) => handleApiErrorMessage(err),
      }
    );
    // update method
    const {mutate: updateData} = useMutation(
      async (obj) => {
        setErrorMessage(null);
        const {url, form, headers} = obj;
        // console.log(url, form, {...headers, ...locale});
        return await axios({ method: 'put', url: url, data: form, headers: {...headers, ...locale} });
      },
      { 
        onSuccess: (res, obj) => {
          isAdmin && toast({message: res.data.message});
          const {callback} = obj;
          callback !== undefined && callback();
          queryClient.invalidateQueries(model)
        },
        onError: (err) => handleApiErrorMessage(err),
      }
    );
    // delete method
    const {mutate: deleteData} = useMutation(
      async (obj) => {
        setErrorMessage(null);
        const {url, form, headers} = obj;
        // console.log(url, form, {...headers, ...locale});
        return await axios({ method: 'delete', url: url, data: form, headers: {...headers, ...locale} });
      },
      { 
        onSuccess: (res, obj) => {
          isAdmin && toast({message: res.data.message});
          const {callback} = obj;
          callback !== undefined && callback();
          queryClient.invalidateQueries(model)
        },
        onError: (err) => handleApiErrorMessage(err),
      }
    );
    // get CSV method
    const {mutate: getCSVData} = useMutation(
      async (obj) => {
        setErrorMessage(null);
        const {url, form} = obj;
        // console.log(url, form, locale);
        return await axios({ method: 'post', url: url, data: form, headers: locale });
      },
      { 
        onSuccess: (res) => {
          // Get file name of CSV which is stored at content-disposition in HTTP response header
          const contentDisposition = res.headers['content-disposition'];
          const fileName = getFileName(contentDisposition);
          // Output CSV file
          useDownloadCsv(res.data, fileName);
          queryClient.invalidateQueries(model);
        },
        onError: (err) => handleApiErrorMessage(err),
      }
    );
    // return data & method
    return {data, errorMessage, createData, deleteData, updateData, getCSVData}
}

export default useFetchApiData;