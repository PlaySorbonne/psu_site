import type { MarkdownInstance } from "astro";

export interface Slide {
  title: string;
  subtitle?: string;
  src: string;
  alt: string;
  link?: string;
  noLink?: boolean;
  priority?: boolean;
  inCarrousel?: boolean;
}

/*
  * Sort slides by priority and remove duplicates
  * @param slides Array of slides
  * @returns Sorted array of slides
*/
export function sortSlides(slides: Slide[]): Slide[] {
  let priority: Slide[] = [];
  let other: Slide[] = [];
  slides.forEach((slide) => {
    if (slide.inCarrousel === false) return;
    if (slide.priority) priority.push(slide);
    else other.push(slide);
  });
  return priority.concat(other).reduce((acc, cur) => {
    if (acc.find((e) => e.src === cur.src)) return acc;
    return acc.concat(cur);
  }, [] as Slide[]);
}

export function rawMDtoSlide(e: MarkdownInstance<Slide>): Slide {
  return {
    title: e.frontmatter.title,
    subtitle: e.frontmatter.subtitle,
    src: e.frontmatter.src,
    alt: e.frontmatter.alt ?? "",
    priority: e.frontmatter.priority ?? false,
    link: e.url,
    noLink: e.frontmatter.noLink ?? false,
  };
}

export function rawMDtoSortedArray(e: MarkdownInstance<Slide>[]): Slide[] {
  return sortSlides(e.map(rawMDtoSlide));
}