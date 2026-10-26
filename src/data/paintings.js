import imgLandscape from "../assets/landscape.jpg";
import imgPavilion from "../assets/landscape-with-pavilion.jpg";
import imgMountain from "../assets/mountain-landscape.jpg";
import imgStream from "../assets/landscape-2.jpg";

/**
 * 画卷文件名 → Vite 打包后的 URL。
 * poems.js 里 painting.src 存文件名，这里负责解析成真实路径，
 * 让数据文件保持纯数据、不含构建细节。
 */
export const PAINTING_URLS = {
  "landscape.jpg": imgLandscape,
  "landscape-with-pavilion.jpg": imgPavilion,
  "mountain-landscape.jpg": imgMountain,
  "landscape-2.jpg": imgStream,
};
