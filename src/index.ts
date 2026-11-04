// Package entry. The ".js" extension maps to Carousel.tsx at build time and keeps
// the emitted index.d.ts resolvable under Node's ESM resolution (node16/nodenext).
export { default, default as Carousel } from "./Carousel.js";
export type { CarouselProps, FaceProps, PrismProps } from "./Carousel.js";
