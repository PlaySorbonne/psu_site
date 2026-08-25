import discord from "./discord.svg";
import insta from "./insta.svg";
import twitter from "./twitter.svg";
import youtube from "./youtube.svg";
import twitch from "./twitch.svg";
import Default from "./default.svg";

export const socialsIcons = {
  discord,
  insta,
  twitter,
  youtube,
  twitch,
  unknown: Default,
} as const;

export function getSocialIcon(name: string) {
  return socialsIcons[name as keyof typeof socialsIcons] || Default;
}

export default {
  ...socialsIcons,
};
