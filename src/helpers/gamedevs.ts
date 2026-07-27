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

// visuels_jeu peut être une vidéo, un PDF, un zip… : on ne garde que les
// formats d'image, tout autre fichier fait échouer l'optimisation d'Astro
// (pas de .heic : sharp ne sait pas le décoder)
const EXTENSIONS_IMAGE = [
  ".png",
  ".jpg",
  ".jpeg",
  ".jfif",
  ".webp",
  ".gif",
  ".avif",
  ".svg",
];
export const estImage = (url: string) =>
  EXTENSIONS_IMAGE.some((ext) => url.toLowerCase().endsWith(ext));

/*
 * Toutes les images d'un jeu (l'image de référence en premier),
 * sans doublons ni fichiers non-image.
 */
export function imagesJeu(jeu: JeuT): string[] {
  const urls = [jeu.image_site, jeu.logo_jeu, jeu.visuels_jeu, jeu.mascotte_jeu];
  return [
    ...new Set(urls.filter((url): url is string => !!url && estImage(url))),
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

/*
 * Nettoie un lien saisi librement dans le formulaire gestion : espaces
 * autour, schéma manquant (www.exemple.com), valeurs vides ou "-"…
 * Renvoie null si la valeur ne ressemble pas à un lien.
 */
export function nettoieLien(brut: string | null | undefined): string | null {
  const lien = brut?.trim();
  if (!lien || /\s/.test(lien) || !lien.includes(".")) return null;
  return /^https?:\/\//i.test(lien) ? lien : `https://${lien}`;
}

/*
 * insta est saisi librement : pseudo (avec ou sans @, pouvant contenir des
 * points), URL Instagram avec paramètres de partage (?igsh=…), voire simple
 * site web. Renvoie un lien propre et le texte à afficher.
 */
export function lienInsta(
  brut: string | null | undefined,
): { url: string; label: string } | null {
  const insta = brut?.trim();
  if (!insta) return null;
  // une URL commence par http(s) ou www. ; tout le reste est un pseudo
  // (les pseudos peuvent contenir des points, ex. "madmango.games")
  if (/^(https?:\/\/|www\.)/i.test(insta)) {
    const url = nettoieLien(insta);
    if (!url) return null;
    try {
      const { hostname, pathname } = new URL(url);
      if (hostname.replace(/^www\./, "") === "instagram.com") {
        const pseudo = pathname.split("/").filter(Boolean)[0];
        if (pseudo)
          return {
            url: `https://www.instagram.com/${pseudo}/`,
            label: `@${pseudo}`,
          };
      }
      // pas Instagram : c'est en fait le site web du studio
      return { url, label: hostname.replace(/^www\./, "") };
    } catch {
      return null;
    }
  }
  const pseudo = insta.replace(/^@/, "");
  return { url: `https://www.instagram.com/${pseudo}/`, label: `@${pseudo}` };
}

/*
 * Lien "En savoir plus" d'un jeu : site du jeu, sinon site web ou Instagram
 * du studio (même champ, voir lienInsta), sinon n'importe quel lien d'un
 * autre jeu du studio.
 */
export function lienJeu(jeu: JeuT, dev: DevT): string | null {
  return (
    nettoieLien(jeu.site_jeu) ??
    lienInsta(dev.insta)?.url ??
    dev.jeux.map((j) => nettoieLien(j.site_jeu)).find(Boolean) ??
    null
  );
}

/*
 * Image représentative d'un studio pour la liste : son logo, sinon le logo
 * d'un de ses jeux, sinon n'importe quelle image d'un jeu, sinon ses visuels.
 */
export function imageStudio(dev: DevT): string | null {
  const candidats = [
    dev.logo_studio,
    ...dev.jeux.map((jeu) => jeu.logo_jeu),
    ...dev.jeux.flatMap((jeu) => imagesJeu(jeu)),
    dev.mascotte_studio,
    dev.visuels_studio,
  ];
  return candidats.find((url): url is string => !!url && estImage(url)) ?? null;
}
