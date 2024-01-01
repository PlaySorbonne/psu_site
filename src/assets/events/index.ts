import type { ImageMetadata } from "astro";
import unknown from "./base.png";
import conf from "./conf.png";
import smash from "./smash.png";

export const eventsIcons = {
  unknown,
  conf,
  smash,
} as const;

export function getEventIcon(name: string): ImageMetadata{
  return eventsIcons[name] || unknown;
}

export default {
  ...eventsIcons,
};
