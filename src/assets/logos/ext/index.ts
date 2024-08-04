import type { ImageMetadata } from "astro";
import crous from "./Crous.png";
import cvec from "./CVEC.png";
import paris from "./Paris.png";
import su from "./SU.png";

export const extLogos = {
  crous,
  cvec,
  paris,
  su,
} as const;

export function getEventIcon(name: string): ImageMetadata {
  return extLogos[name] || su;
}

export default {
  ...extLogos,
};
