export const useDownloadCsv = (data, fileName) => {
  // Decode encoded file name ＊ replace '+' with space because space will be '+' when decode it 
  const decodedFileName = decodeURI(fileName).replace(/\+/g, " ");
  // Attach BOM （Not to garble in Excel）
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  // Create data by Blob
  const blob = new Blob([bom, data], { type: "text/csv" });
  // Create link for download 
  const link = document.createElement('a');
  // Create an ObjectURL from Blob and assign it to link.
  link.href = window.URL.createObjectURL(blob);
  // Assign file name to download attribute
  link.download = decodedFileName;
  // Click created URL and execute download 
  link.click();
  // Release ObjectURL 
  window.URL.revokeObjectURL(link.href);
};
