
const MAX_FILE_SIZE = 5 * 1024 * 1024;


const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];


export const FILE_ERRORS = {
  SIZE_TOO_LARGE: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
  INVALID_TYPE: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
  NO_FILE: 'No file selected'
};


export const validateImageFile = (file: File): string | null => {
  if (!file) return FILE_ERRORS.NO_FILE;
  if (file.size > MAX_FILE_SIZE) return FILE_ERRORS.SIZE_TOO_LARGE;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return FILE_ERRORS.INVALID_TYPE;
  return null;
};


export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};


export const revokeImagePreview = (previewUrl: string): void => {
  URL.revokeObjectURL(previewUrl);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const compressImage = async (file: File, maxWidth = 1200): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        // compression quality
        file.type,
        0.8 
        
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
  });
};