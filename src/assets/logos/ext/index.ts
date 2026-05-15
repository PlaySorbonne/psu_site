import type { ImageMetadata } from "astro";
import crous from "./Crous.png";
import cvec from "./CVEC.png";
import su from "./SU.png";

export const extLogos = {
  crous,
  cvec,
  su,
} as const;

export function getEventIcon(name: string): ImageMetadata {
  return extLogos[name] || su;
}

export default {
  ...extLogos,
};
