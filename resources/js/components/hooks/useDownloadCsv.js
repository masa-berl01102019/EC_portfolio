import React from 'react';

export const useDownloadCsv = (data, fileName) => {
  // Attach BOM （Not to garble in Excel）
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  // Create data by Blob
  const blob = new Blob([bom, data], { type: "text/csv" });
  // Create link for download 
  const link = document.createElement('a');
  // Create an ObjectURL from Blob and assign it to link.
  link.href = window.URL.createObjectURL(blob);
  // Assign file name to download attribute
  link.download = fileName;
  // Click created URL and execute download 
  link.click();
  // Release ObjectURL 
  window.URL.revokeObjectURL(link.href);
};

export const getFileName = (contentDisposition) => {
  // File name is stored like 'attachment; filename=.csv; filename*=utf-8''file name which is URI encoded.csv' in HTTP response header
  // Get the file name from argument
  let fileName = contentDisposition.substring(contentDisposition.indexOf("''") + 2);
  // Decode encoded file name ＊ replace '+' with space because space will be '+' when decode it 
  fileName = decodeURI(fileName).replace(/\+/g, " ");
  // return file name
  return fileName;
}
