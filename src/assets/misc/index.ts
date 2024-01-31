import dices from "./dices.svg";
import leftArrow from "./left-arrow.svg";
import rightArrow from "./right-arrow.svg";
import mic from "./mic.svg";
import penRuler from "./pen_ruler.svg";
import proj from "./proj.svg";
import tetris from "./tetris.svg";
import trophy from "./trophy.svg";

export const miscIcons = {
  dices,
  leftArrow,
  rightArrow,
  mic,
  penRuler,
  proj,
  tetris,
  trophy,
} as const;

// kinda useless but whatever
export function getMiscIcon(name: keyof typeof miscIcons) {
  return miscIcons[name];
}

export default {
  ...miscIcons,
};
