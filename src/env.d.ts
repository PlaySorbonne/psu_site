/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
//
interface ImportMetaEnv {
    readonly PUBLIC_DEV_MODE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// swiper ne fournit pas de déclarations pour ses entrées CSS
declare module "swiper/css";
declare module "swiper/css/navigation";
declare module "swiper/css/pagination";
