// Client de l'API publique de gamedevs.playsorbonne.fr (instance gestion_gamedevs).
// Les données sont récupérées au moment du build : le site étant statique, il
// faut relancer le workflow de déploiement (cron ou manuel) pour les rafraîchir.

// pièce jointe "autre" explicitement destinée au site
export interface AutreT {
  nom: string;
  url: string;
  type: "image" | "video" | "pdf" | "autre";
}

export interface JeuT {
  id: number;
  nom_jeu: string;
  type_de_jeu: { code: "1" | "2" | "3"; label: string };
  site_jeu: string | null;
  description_jeu: string | null;
  style_jeu: string | null;
  liens?: string[];
  logo_jeu: string | null;
  visuels_jeu: string | null;
  visuels?: string[];
  mascotte_jeu: string | null;
  video_jeu?: string | null;
  // image choisie côté gestion pour représenter le jeu (slider + pages)
  image_site: string | null;
}

export interface DevT {
  id: number;
  nom_studio: string;
  insta: string;
  // description destinée au site (différente de celle des orgas)
  description_studio?: string;
  // liens marqués "pour le site" côté gestion
  liens?: string[];
  logo_studio: string | null;
  visuels_studio: string | null;
  // tous les visuels (visuels_studio en premier) ; peut contenir vidéos et PDF
  visuels?: string[];
  mascotte_studio: string | null;
  video_studio?: string | null;
  autres?: AutreT[];
  jeux: JeuT[];
}

// un média affichable dans une galerie
export interface MediaT {
  type: "image" | "video";
  url: string;
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
  await repereImagesTropLourdes(devs as DevT[]);
  return devs as DevT[];
}

const TAILLE_MAX_IMAGE = 10 * 1024 * 1024; // 10 Mo

const estPeutEtreAnime = (url: string) =>
  [".gif", ".webp"].some((ext) => url.toLowerCase().endsWith(ext));

export const urlAbsolue = (url: string) =>
  url.startsWith("http") ? url : `${API_URL}${url}`;

// nouveau champ multiple s'il est présent, sinon l'ancien champ simple
const visuelsJeu = (jeu: JeuT) =>
  jeu.visuels ?? (jeu.visuels_jeu ? [jeu.visuels_jeu] : []);
const visuelsStudio = (dev: DevT) =>
  dev.visuels ?? (dev.visuels_studio ? [dev.visuels_studio] : []);

const imagesTropLourdes = new Set<string>();

/*
 * L'API ne renvoie pas la taille des fichiers : on la lit au build via une
 * requête HEAD par image (content-length). Au moindre doute (pas de réponse,
 * pas d'en-tête), on garde l'image.
 */
async function repereImagesTropLourdes(devs: DevT[]): Promise<void> {
  const urls = new Set<string>();
  for (const dev of devs) {
    const candidats = [
      dev.logo_studio,
      ...visuelsStudio(dev),
      dev.mascotte_studio,
      ...(dev.autres ?? []).map((pj) => pj.url),
      ...dev.jeux.flatMap((jeu) => [
        jeu.image_site,
        jeu.logo_jeu,
        ...visuelsJeu(jeu),
        jeu.mascotte_jeu,
      ]),
    ];
    for (const url of candidats) if (url && estPeutEtreAnime(url)) urls.add(url);
  }

  await Promise.all(
    [...urls].map(async (url) => {
      try {
        const res = await fetch(urlAbsolue(url), { method: "HEAD" });
        const taille = Number(res.headers.get("content-length"));
        if (taille > TAILLE_MAX_IMAGE) {
          console.warn(
            `<!> animation écartée (${(taille / 1024 / 1024).toFixed(1)} Mo > ${
              TAILLE_MAX_IMAGE / 1024 / 1024
            } Mo) : ${url}`,
          );
          imagesTropLourdes.add(url);
        }
      } catch {
        // pas de réponse : au bénéfice du doute, on garde l'image
      }
    }),
  );
}

// image au format supporté ET pas une animation trop lourde
export const imageAffichable = (url: string) =>
  estImage(url) && !imagesTropLourdes.has(url);

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

// formats vidéo acceptés par gestion_gamedevs (lisibles par <video>, sauf
// parfois .mov hors Safari : on tente quand même l'affichage)
const EXTENSIONS_VIDEO = [".mp4", ".webm", ".mov", ".m4v"];
export const estVideo = (url: string) =>
  EXTENSIONS_VIDEO.some((ext) => url.toLowerCase().endsWith(ext));

/*
 * Toutes les images d'un jeu (l'image de référence en premier),
 * sans doublons ni fichiers non-image ou trop lourds.
 */
export function imagesJeu(jeu: JeuT): string[] {
  const urls = [
    jeu.image_site,
    jeu.logo_jeu,
    ...visuelsJeu(jeu),
    jeu.mascotte_jeu,
  ];
  return [
    ...new Set(
      urls.filter((url): url is string => !!url && imageAffichable(url)),
    ),
  ];
}

/*
 * Tous les médias d'un jeu pour la galerie : ses images (référence en
 * premier), puis ses vidéos (champ dédié + vidéos glissées dans les visuels).
 */
export function mediasJeu(jeu: JeuT): MediaT[] {
  const videos = [...visuelsJeu(jeu), jeu.video_jeu].filter(
    (url): url is string => !!url && estVideo(url),
  );
  return [
    ...imagesJeu(jeu).map((url): MediaT => ({ type: "image", url })),
    ...[...new Set(videos)].map((url): MediaT => ({ type: "video", url })),
  ];
}

/*
 * Médias de la galerie d'un studio : ses visuels, sa vidéo, et ses pièces
 * jointes images/vidéos destinées au site. Le logo et la mascotte restent
 * réservés à la bannière et aux vignettes.
 */
export function mediasStudio(dev: DevT): MediaT[] {
  const fichiers = [
    ...visuelsStudio(dev),
    dev.video_studio,
    ...(dev.autres ?? [])
      .filter((pj) => pj.type === "image" || pj.type === "video")
      .map((pj) => pj.url),
  ].filter((url): url is string => !!url);
  const medias = [...new Set(fichiers)].flatMap((url): MediaT[] => {
    if (imageAffichable(url)) return [{ type: "image", url }];
    if (estVideo(url)) return [{ type: "video", url }];
    return [];
  });
  // images d'abord, vidéos ensuite (même ordre que dans les galeries)
  return [
    ...medias.filter((m) => m.type === "image"),
    ...medias.filter((m) => m.type === "video"),
  ];
}

// pièces jointes PDF destinées au site, à proposer en téléchargement
export function documentsStudio(dev: DevT): AutreT[] {
  return (dev.autres ?? []).filter((pj) => pj.type === "pdf");
}

// logo du studio, s'il est affichable (format supporté, pas trop lourd)
export function logoStudio(dev: DevT): string | null {
  return dev.logo_studio && imageAffichable(dev.logo_studio)
    ? dev.logo_studio
    : null;
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
 * Liens supplémentaires (champs `liens` de la MR #2), nettoyés, dédoublonnés
 * et étiquetés par leur nom de domaine pour l'affichage.
 */
export function liensAffichables(
  liens: string[] | undefined,
): { url: string; label: string }[] {
  const propres = liens
    ?.map(nettoieLien)
    .filter((url): url is string => !!url);
  return [...new Set(propres)].flatMap((url) => {
    try {
      return [{ url, label: new URL(url).hostname.replace(/^www\./, "") }];
    } catch {
      return [];
    }
  });
}

/*
 * Lien "En savoir plus" d'un jeu : site du jeu, sinon un de ses liens, sinon
 * site web ou Instagram du studio (même champ, voir lienInsta), sinon
 * n'importe quel lien d'un autre jeu du studio.
 */
export function lienJeu(jeu: JeuT, dev: DevT): string | null {
  return (
    nettoieLien(jeu.site_jeu) ??
    liensAffichables(jeu.liens)[0]?.url ??
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
    ...visuelsStudio(dev),
  ];
  return (
    candidats.find((url): url is string => !!url && imageAffichable(url)) ??
    null
  );
}
