// Client de l'API publique de gamedevs.playsorbonne.fr (instance gestion_gamedevs).
// Les données sont récupérées au moment du build : le site étant statique, il
// faut relancer le workflow de déploiement (cron ou manuel) pour les rafraîchir.

export interface JeuT {
  id: number;
  nom_jeu: string;
  type_de_jeu: { code: "1" | "2" | "3"; label: string };
  site_jeu: string | null;
  description_jeu: string | null;
  style_jeu: string | null;
  logo_jeu: string | null;
  visuels_jeu: string | null;
  mascotte_jeu: string | null;
  // image choisie côté gestion pour représenter le jeu (slider + pages)
  image_site: string | null;
}

export interface DevT {
  id: number;
  nom_studio: string;
  insta: string;
  logo_studio: string | null;
  visuels_studio: string | null;
  mascotte_studio: string | null;
  jeux: JeuT[];
}

const API_URL = (
  import.meta.env.GAMEDEVS_API ?? "https://gamedevs.playsorbonne.fr"
).replace(/\/$/, "");

let devsCache: Promise<DevT[]> | undefined;

/*
 * Studios acceptés + affichés et leurs jeux affichés, depuis l'API publique.
 * Un seul fetch par build. Toute erreur fait échouer le build : on préfère
 * garder l'ancienne version du site en ligne que publier des pages vides.
 */
export function getDevs(): Promise<DevT[]> {
  devsCache ??= fetchDevs();
  return devsCache;
}

async function fetchDevs(): Promise<DevT[]> {
  const url = `${API_URL}/api/public/devs`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(
      `API gamedevs injoignable (${url}) : ${res.status} ${res.statusText}`,
    );
  const { devs } = await res.json();
  return devs as DevT[];
}

// code "3" = à la fois plateau et vidéo
export const estJeuDePlateau = (jeu: JeuT) =>
  jeu.type_de_jeu.code === "1" || jeu.type_de_jeu.code === "3";
export const estJeuVideo = (jeu: JeuT) =>
  jeu.type_de_jeu.code === "2" || jeu.type_de_jeu.code === "3";

// visuels_jeu peut être une vidéo : on l'écarte des galeries d'images
const EXTENSIONS_VIDEO = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
export const estVideo = (url: string) =>
  EXTENSIONS_VIDEO.some((ext) => url.toLowerCase().endsWith(ext));

/*
 * Toutes les images d'un jeu (l'image de référence en premier),
 * sans doublons ni vidéos.
 */
export function imagesJeu(jeu: JeuT): string[] {
  const urls = [jeu.image_site, jeu.logo_jeu, jeu.visuels_jeu, jeu.mascotte_jeu];
  return [
    ...new Set(urls.filter((url): url is string => !!url && !estVideo(url))),
  ];
}

export function devSlug(dev: DevT): string {
  const nom = dev.nom_studio
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return nom ? `${dev.id}-${nom}` : `${dev.id}`;
}

export const instaUrl = (insta: string) =>
  `https://www.instagram.com/${insta.replace(/^@/, "")}`;
