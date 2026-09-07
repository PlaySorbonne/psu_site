/*
 * Petit bus d'évènements de la page /festival.
 *
 * Il sert à coupler des sections qui ne se touchent pas dans le DOM :
 * survoler un lieu dans la frise de la journée éclaire sa zone sur le
 * plan, et réciproquement. Trois messages seulement :
 *
 *   lieu:survol   { id }            un lieu de la frise est survolé (null = plus rien)
 *   lieu:choix    { id }            un lieu de la frise est choisi au clic
 *   plan:survol   { lieu }          une zone du plan est survolée
 *   plan:vise     { zone }          une autre section demande d'éclairer une zone
 *
 * Les abonnements sont vidés avant chaque échange de page du ClientRouter :
 * sans ça, ils pointeraient sur les éléments de la page précédente.
 */

type Ecoute = (detail: any) => void;

const abonnes = new Map<string, Set<Ecoute>>();

export const bus = {
  on(nom: string, f: Ecoute) {
    let s = abonnes.get(nom);
    if (!s) abonnes.set(nom, (s = new Set()));
    s.add(f);
  },
  emit(nom: string, detail?: any) {
    const s = abonnes.get(nom);
    if (!s) return;
    /* une écoute qui jette ne doit pas empêcher les suivantes */
    s.forEach((f) => {
      try {
        f(detail);
      } catch (e) {
        /* rien : le couplage entre sections est un bonus, pas un dû */
      }
    });
  },
};

document.addEventListener("astro:before-swap", () => abonnes.clear());
