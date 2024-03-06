export const resizeImage = (
  imageData,
  maxWidth,
  maxHeight,
  format = "JPEG",
  quality = 100
) => {
  return new Promise((resolve, reject) => {
    imageFileResizer(
      imageData,
      maxWidth,
      maxHeight,
      format,
      quality,
      0,
      (uri) => {
        const originalImage = imageData; // Save original image
        const resizedImage = uri; // Save resized image
        resolve({ originalImage, resizedImage }); // Return an object containing both images
      },
      "base64"
    );
  });
};
