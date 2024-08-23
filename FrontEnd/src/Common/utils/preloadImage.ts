export const PreloadImage = ({ src }: { src: string }) => {
  return new Promise<boolean>((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(true);
    image.onerror = () => reject(true);
  });
};
