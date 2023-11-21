import discord from "./discord.svg";
import insta from "./insta.svg";
import twitter from "./twitter.svg";
import youtube from "./youtube.svg";
import twitch from "./twitch.svg";
import Default from "./default.svg";

export function getIconSrc(name: string) {
  return (
    {
      discord,
      insta,
      twitter,
      youtube,
      twitch,
      unknown: Default,
    }[name]?.src || Default.src
  );
}

export default {
  discord,
  insta,
  twitter,
  youtube,
  twitch,
  unknown: Default,
};
