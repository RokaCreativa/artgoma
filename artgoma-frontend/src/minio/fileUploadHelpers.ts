export function createFormData(files: File[]): FormData {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("file", file);
  });
  return formData;
}

export const MAX_FILE_SIZE_NEXTJS_ROUTE = 10 * 1024 * 1024; // 10 MB
