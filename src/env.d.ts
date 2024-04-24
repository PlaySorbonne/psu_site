/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
//
interface ImportMetaEnv {
    readonly PUBLIC_DEV_MODE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
