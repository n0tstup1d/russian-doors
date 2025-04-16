// utils/importImages.js
export const importAllImages = (context) => {
    return context.keys().map(context);
  };
  
  export const workImages = importAllImages(
    require.context('../../assets/our-work', false, /\.(png|jpe?g|webp)$/i)
  );