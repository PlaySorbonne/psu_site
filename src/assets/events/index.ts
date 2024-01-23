import type { ImageMetadata } from "astro";
import unknown from "./base.png";
import conf from "./conf.png";
import smash from "./smash.png";
import travaux from "./travaux.webp";

export const eventsIcons = {
  unknown,
  conf,
  smash,
  travaux
} as const;

export function getEventIcon(name: string): ImageMetadata{
  return eventsIcons[name] || unknown;
}

export default {
  ...eventsIcons,
};
