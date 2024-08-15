import type { MarkdownInstance, MDXInstance } from "astro";

/*
 * Sort events by priority, remove duplicates and filter out clubs
 * @param slides Array of slides
 * @returns Sorted array of slides
 */
export function sortSlides(
  events: EventT[],
  maxDepth = 2,
  isMain = false
): EventT[] {
  return events
    .filter((e) => !e.dontList) // On filtre les événements à ne pas lister
    .filter((e) => !e.isClub) // On filtre les clubs
    .filter((e) => e.link.split("/").length <= maxDepth + 1) // on retire les pages trop profondes
    .filter((e) => !e.noMainCarrousel || !isMain) // on retire les événements à ne pas afficher dans le carrousel principal
    .reduce((acc, cur) => {
      if (acc.find((e) => e.link === cur.link)) return acc;
      return acc.concat(cur);
    }, [] as EventT[]) // on retire les doublons
    .sort((a, b) => b.priority - a.priority); // on trie par priorité
}

export function rawMDtoSlide(e: MDnXInstance<EventT>): EventT {
  if (!e.frontmatter.description && !e.frontmatter.dontList)
    console.warn(`<!> No description for ${e.url} !!`);
  return {
    title: e.frontmatter.title,
    subtitle: e.frontmatter.subtitle,
    cover: e.frontmatter.cover,
    alt: e.frontmatter.alt ?? "",
    priority: e.frontmatter.priority ?? 0,
    link: e.frontmatter.link ?? e.url,
    noLink: e.frontmatter.noLink ?? false,
    description: e.frontmatter.description ?? LoremText,
    icon: e.frontmatter.icon ?? "",
    isClub: e.frontmatter.isClub ?? false,
    dontList: e.frontmatter.dontList ?? false,
    noMainCarrousel: e.frontmatter.noMainCarrousel ?? false,
    notInListing: e.frontmatter.notInListing ?? false,
    noEvents: e.frontmatter.noEvents ?? false,
  };
}

export function rawMDtoSortedArray(
  e: MDnXInstance<EventT>[],
  maxDepth?: number,
  isMain = false
): EventT[] {
  return sortSlides(e.map(rawMDtoSlide), maxDepth, isMain);
}

export function sliceText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + " ...";
}

export type ClubName = "dlc" | "luxludi" | "psu" | "pls" | "champsu";

export type MDnXInstance<T> = MarkdownInstance<T> | MDXInstance<T>;

export interface EventT {
  title: string; // title of the event, used in the carousel and listing of events
  subtitle?: string; // subtitle, same as title
  cover: string; // cover image used in the carousel
  alt?: string; // alt text for the cover image, defaults to the title
  link: string; // link to the page of the event. If no link is provided, will use the page url
  noLink?: boolean; // if true, the event will not be linked
  priority?: number; // priority of the event, used to sort the carousel and listing
  dontList?: boolean; // if true, the event will not be listed
  description: string; // description of the event, used in the listing and may be used in the event page
  icon?: string; // icon of the event, used in the listing
  isClub?: boolean; // if true, the event is a club
  noMainCarrousel?: boolean; // if true, the event will not be in the main carrousel
  notInListing?: boolean; // if true, the event will not be in the listing
  noEvents?: boolean; // if true, the page will not have an events section
}

const LoremText =
  "lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export function csvJSON(csv:string) {
  const separator = csv.includes(";") ? ";" : ",";
  const lines = csv.split("\n");
  const result = [];
  const headers = lines[0].trim().split(separator);
  

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const obj = {};
    const currentline = lines[i].trim().split(separator).map((e) => e.trim());

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  return result;
}
