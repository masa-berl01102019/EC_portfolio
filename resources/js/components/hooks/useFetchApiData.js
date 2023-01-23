import {useQuery, useMutation, useQueryClient} from 'react-query';
import axios from 'axios';
import useSetErrorMsg from "./useSetErrorMsg";
import {useDownloadCsv, getFileName} from "./useDownloadCsv";
import useToastify from '../context/ToastifyContext';


const useFetchApiData = (url, model) => {
    // checking whether api request is for admin  
    const isAdmin = url.startsWith('/api/admin/');
    // error handling
    const [errorMessage, {setErrorMessage, handleApiErrorMessage}] = useSetErrorMsg(null);
    // messageを表示する
    const toast = useToastify();
    // Appのreact-queryのプロバイダーで渡したqueryClientを取得 * keyを指定してデータを再取得 / キャッシュを取得 / キャッシュを更新 等を行える
    const queryClient = useQueryClient();
    // get data
    const { data: {data} } = useQuery(
      [model, url],
      async () => {
        setErrorMessage(null);
        return await axios({ method: 'get', url: url });
      },
      { 
        onSuccess: (res) => console.log(res.data),
        onError: (err) =>  handleApiErrorMessage(err),
      }
    );
    // create method
    const {mutate: createData} = useMutation(
      async (obj) => {
        setErrorMessage(null);
        const {url, form, headers} = obj;
        console.log(url, form, headers);
        return await axios({ method: 'post', url: url, data: form, headers: headers });
      },
      { 
        onSuccess: (res, obj) => {
          // 成功メッセージを表示
          isAdmin && toast({message: res.data.message});
          // 成功後のアクションをcallback関数として引数で受け取りあれば実行
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
        console.log(url, form, headers);
        return await axios({ method: 'put', url: url, data: form, headers: headers });
      },
      { 
        onSuccess: (res, obj) => {
          // 成功メッセージを表示
          isAdmin && toast({message: res.data.message});
          // 成功後のアクションをcallback関数として引数で受け取りあれば実行
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
        console.log(url, form, headers);
        return await axios({ method: 'delete', url: url, data: form, headers: headers });
      },
      { 
        onSuccess: (res, obj) => {
          // 成功メッセージを表示
          isAdmin && toast({message: res.data.message});
          // 成功後のアクションをcallback関数として引数で受け取りあれば実行
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
        console.log(url, form);
        return await axios({ method: 'post', url: url, data: form });
      },
      { 
        onSuccess: (res) => {
          // CSVのファイル名はHTTPレスポンスヘッダーのcontent-dispositionに格納されてるので取得
          const contentDisposition = res.headers['content-disposition'];
          // ファイル名を取得
          const fileName = getFileName(contentDisposition);
          // CSVを出力
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