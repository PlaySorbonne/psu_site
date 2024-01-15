import type { MarkdownInstance, MDXInstance } from "astro";

/*
 * Sort events by priority, remove duplicates and filter out clubs
 * @param slides Array of slides
 * @returns Sorted array of slides
 */
export function sortSlides(events: EventT[], maxDepth = 2): EventT[] {
  return events
    .filter((e) => !e.dontList) // On filtre les événements à ne pas lister
    .filter((e) => !e.isClub) // On filtre les clubs
    .filter((e) => e.link.split("/").length <= maxDepth + 1) // on retire les pages trop profondes
    .reduce((acc, cur) => {
      if (acc.find((e) => e.link === cur.link)) return acc;
      return acc.concat(cur);
    }, [] as EventT[]) // on retire les doublons
    .sort((a, b) => b.priority - a.priority); // on trie par priorité
}


export function rawMDtoSlide(e: MDnXInstance<EventT>): EventT {
  return {
    title: e.frontmatter.title,
    subtitle: e.frontmatter.subtitle,
    cover: e.frontmatter.cover,
    alt: e.frontmatter.alt ?? "",
    priority: e.frontmatter.priority ?? 0,
    link: e.url,
    noLink: e.frontmatter.noLink ?? false,
    description: e.frontmatter.description ?? "",
    icon: e.frontmatter.icon ?? "",
    isClub: e.frontmatter.isClub ?? false,
    dontList: e.frontmatter.dontList ?? false,
  };
}

export function rawMDtoSortedArray(
  e: MDnXInstance<EventT>[],
  maxDepth?: number
): EventT[] {
  return sortSlides(e.map(rawMDtoSlide), maxDepth);
}

export function sliceText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + " ...";
}

export type ClubName = "dlc" | "luxludi" | "psu" | "pls" | "champsu";

export type MDnXInstance<T> = MarkdownInstance<T> | MDXInstance<T>;

export type NavItem = {
  name: string;
  link: string;
};

// TODO not used
export interface ParentT {
  title: string;
  nav?: NavItem[];
}

// TODO is support for nav universal?
export interface EventT {
  title: string;
  subtitle?: string;
  cover: string;
  alt: string;
  link: string;
  noLink?: boolean;
  priority?: number;
  dontList?: boolean;
  description: string;
  icon?: string;
  isClub?: boolean;
  nav?: NavItem[];
}

interface Page {
  title: string;
  link?: string;
  children?: Page[];
}

export const pages: Page[] = [
  {
    title: "clubs",
    children: [
      { title: "dlc", link: "/dlc" },
      { title: "luxludi", link: "/luxludi" },
      { title: "pls", link: "/pls" },
    ],
  },
  {
    title: "évenements",
    children: [
      { title: "Festival de Jeu", link: "/festival" },
      { title: "Soirée jeuxdi", link: "/jeux" },
      { title: "Tournois Smash", link: "/dlc/smash" },
      { title: "Game Jam", link: "/luxludi/gamjam" },
      { title: "Jeux Originaux", link: "/luxludi/jeux-org" },
      { title: "Appel à prototypes", link: "/luxludi/proto" },
      { title: "Conférences", link: "/pls/conferences" },
      // { title: "Serveur Minecraft", link: "/minecraft" },
    ],
  },
  /* {
    title: "Jeux Réalisés",
    children: [
      { title: "MemoCombo", link: "/luxludi/memocombo" },
      { title: "Tribunaze", link: "/luxludi/tribunaze" },
    ],
  }, */
];
