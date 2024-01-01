import type { MarkdownInstance, MDXInstance } from "astro";

/*
 * Sort slides by priority, remove duplicates and filter out clubs
 * @param slides Array of slides
 * @returns Sorted array of slides
 */
export function sortSlides(slides: EventT[]): EventT[] {
  let priority: EventT[] = [];
  let other: EventT[] = [];
  slides.forEach((slide) => {
    // if (slide.inCarrousel === false) return;
    if (slide.priority) priority.push(slide);
    else other.push(slide);
  });
  return priority
    .concat(other)
    .reduce((acc, cur) => {
      if (acc.find((e) => e.src === cur.src)) return acc;
      return acc.concat(cur);
    }, [] as EventT[])
    .filter((e) => !e.isClub);
}

export function filterNonCarrousel(slides: EventT[]): EventT[] {
  return slides.filter((e) => e.inCarrousel !== false);
}

export function rawMDtoSlide(e: MDnXInstance<EventT>): EventT {
  return {
    title: e.frontmatter.title,
    subtitle: e.frontmatter.subtitle,
    src: e.frontmatter.src,
    alt: e.frontmatter.alt ?? "",
    priority: e.frontmatter.priority ?? false,
    link: e.url,
    noLink: e.frontmatter.noLink ?? false,
    description: e.frontmatter.description ?? "",
    icon: e.frontmatter.icon ?? "",
    isClub: e.frontmatter.isClub ?? false,
  };
}

export function rawMDtoSortedArray(e: MDnXInstance<EventT>[]): EventT[] {
  return sortSlides(e.map(rawMDtoSlide));
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
  src: string;
  alt: string;
  link: string;
  noLink?: boolean;
  priority?: boolean;
  inCarrousel?: boolean;
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
