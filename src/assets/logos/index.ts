import dlc from "./dlc.png";
import luxludi from "./luxludi.png";
import psu from "./psu.svg";
import pls from "./pls.png";
import champsu from "./champsu.png"

export const clubLogos = {
  dlc,
  luxludi,
  psu,
  pls,
  champsu
} as const;

/* return by default the psu logo */
export function getClubLogo(name: string) {
  return clubLogos[name] || psu;
}

export default {
  ...clubLogos,
};
