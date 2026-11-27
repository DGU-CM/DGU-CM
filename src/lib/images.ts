import type { ImageMetadata } from 'astro';

type Mod = { default: ImageMetadata };
const photos = import.meta.glob<Mod>('../assets/photos/*.{jpg,jpeg,png,webp}', { eager: true });


export const photoImg = (file?: string) => {
  if (!file) return undefined;
  const hit = photos[`../assets/photos/${file}`];
  if (!hit) throw new Error(`사진 파일을 찾을 수 없습니다: src/assets/photos/${file}`);
  return hit.default;
};
