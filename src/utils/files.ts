export const readFileAsBase64 = async (file: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const downloadFile = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "");
  link.click();
};

export const dataURLtoFile = (dataURL: BlobPart, filename: string) => {
  let arr = (dataURL as string).split(","),
      match = arr[0].match(/:(.*?);/),
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
  const mime = match && match.length > 1 ? match[1] : ''
  while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}