export const festival = {
  nom: "Play Sorbonne Festival",
  edition: "10e édition",
  dateIso: "2026-09-19",
  dateTexte: "Samedi 19 septembre 2026",
  jourCourt: "Samedi 19.09.2026",
  horaires: "10h00 → 19h00",
  ouvre: "10:00",
  ferme: "19:00",
  adresse: "4 place Jussieu, Paris 5e",
  campus: "campus Pierre-et-Marie-Curie, Sorbonne Université",
  acces: "Métro Jussieu, lignes 7 et 10",
  prix: "Entrée libre sur inscription",
  inscription:
    "https://www.helloasso.com/associations/play-sorbonne-universite/evenements/play-sorbonne-festival-2026",
  surface: "14 000 m²",
  exposants: 150,
  affiche: "Design : Lou Cardon",
} as const;

/* ------------------------------------------------------------------ */
/* Les sept lieux de la frise générale, et la zone du plan qui leur    */
/* correspond. `zonePlan: null` = le lieu n'est pas sur le plan.       */
/* ------------------------------------------------------------------ */

export type Lieu = {
  id: string;
  nom: string;
  zonePlan: string | null;
  /* le blanc passe l'AA sur ces deux aplats seulement en version assombrie */
  encreClaire?: boolean;
};

export const lieux: Lieu[] = [
  { id: "foyer", nom: "Foyer", zonePlan: "osu" },
  { id: "pyramide", nom: "Scène Pyramide", zonePlan: "libres", encreClaire: true },
  { id: "conf", nom: "Scène Conférences", zonePlan: "conf" },
  { id: "amphi45a", nom: "Amphi 45A", zonePlan: "tetris" },
  { id: "amphi45b", nom: "Amphi 45B", zonePlan: "pokemon" },
  { id: "atrium", nom: "Atrium", zonePlan: "tournois", encreClaire: true },
  { id: "auditorium", nom: "Auditorium", zonePlan: null },
];

/* ------------------------------------------------------------------ */
/* La frise de la journée                                              */
/* ------------------------------------------------------------------ */

export type Creneau = {
  lieu: string;
  debut: string;
  fin: string;
  titre: string;
  note?: string;
  /* « billet » = créneau de retrait, pas une activité */
  variante?: "billet";
  /* renvoie vers un volet de la programmation, plus bas dans la page */
  volet?: string;
  /* renvoie vers une fiche de tournoi, plus bas dans la page */
  ancre?: string;
};

export const programme: Creneau[] = [
  {
    lieu: "foyer",
    debut: "10:00",
    fin: "16:45",
    titre: "Tournoi osu! et osu!mania 7K",
    note: "Check-in jusqu'à 10h30, finale osu! à 16h45. 32 places osu! et 16 places osu!mania 7K. Inscription en ligne.",
    ancre: "#tournoi-osu",
  },
  {
    lieu: "pyramide",
    debut: "10:00",
    fin: "19:00",
    titre: "Concours Cosplay, activités, quiz et autres évènements fun",
    note: "Just Dance géant, Kahoot, concours cosplay, karaoké et blind test, puis la tombola.",
    volet: "pyramide",
  },
  {
    lieu: "conf",
    debut: "10:30",
    fin: "17:15",
    titre: "Conférences",
    note: "Sept interventions de 45 minutes.",
    volet: "conferences",
  },
  {
    lieu: "amphi45a",
    debut: "10:00",
    fin: "17:45",
    titre: "Tournoi & freeplay TETR.IO",
    note: "Check-in de 10h à 11h. Poules, bracket, top 8 puis finales, remise des prix à 17h45. 32 places, inscription en ligne.",
    ancre: "#tournoi-tetrio",
  },
  {
    lieu: "amphi45b",
    debut: "15:00",
    fin: "18:40",
    titre: "Tournoi Pokémon Close Combat",
    note: "Check-in de 15h à 15h30, remise des prix à 18h30. 16 joueurs, inscription en ligne.",
    ancre: "#tournoi-pokemon",
  },
  {
    lieu: "atrium",
    debut: "10:00",
    fin: "18:30",
    titre: "Tournois Mario Kart World, Super Smash Bros. Ultimate, TFT",
    note: "Check-in dès 10h, début des trois tournois à 11h, remise des prix à 18h30. Inscription en ligne, et sur place à 10h30 pour Mario Kart World.",
    ancre: "#tournois",
  },
  {
    lieu: "auditorium",
    debut: "10:00",
    fin: "10:45",
    titre: "Retrait des billets",
    variante: "billet",
    note: "Billets pour le JDR du matin et de l'après-midi.",
    volet: "auditorium",
  },
  {
    lieu: "auditorium",
    debut: "11:00",
    fin: "13:30",
    titre: "Jeu de rôle interactif, session du matin",
    note: "FibreTigre, Pressea, AngleDroit, Le SadPanda, Lâm et MisterMV.",
    volet: "auditorium",
  },
  {
    lieu: "auditorium",
    debut: "14:00",
    fin: "15:20",
    titre: "Retrait des billets",
    variante: "billet",
    note: "Billets pour le JDR de l'après-midi.",
    volet: "auditorium",
  },
  {
    lieu: "auditorium",
    debut: "15:30",
    fin: "18:00",
    titre: "Jeu de rôle interactif, session de l'après-midi",
    note: "FibreTigre, Lexi, Lydia, Daz et MisterMV.",
    volet: "auditorium",
  },
];

/* ------------------------------------------------------------------ */
/* Les tournois et le concours cosplay : ce qui se joue sur            */
/* inscription                                                         */
/*                                                                     */
/* Chacun ouvre ses inscriptions sur sa propre plateforme : c'est le   */
/* lien `inscription` qui fait foi, pas cette page. `manque` dit ce    */
/* qui n'a pas encore été annoncé, au lieu de le deviner.              */
/* ------------------------------------------------------------------ */

export type EtapeTournoi = {
  debut: string;
  /* absent = un instant, pas une plage (« 17h45, remise des prix ») */
  fin?: string;
  quoi: string;
};

export type Tournoi = {
  id: string;
  nom: string;
  /* le lieu de la frise : la fiche reprend sa couleur */
  lieuId: string;
  plage: string;
  inscription: string;
  /* la plateforme qui porte les inscriptions, nommée en clair */
  hote: string;
  /* inscription sur place, quand elle est annoncée */
  surPlace?: string;
  places?: string;
  format?: string;
  recompense?: string;
  chapo?: string;
  etapes: EtapeTournoi[];
  note?: string;
  /* ce qui n'est pas encore annoncé */
  manque?: string;
};

export const tournois: Tournoi[] = [
  {
    id: "smash",
    nom: "Super Smash Bros. Ultimate",
    lieuId: "atrium",
    plage: "10h00 → 18h30",
    inscription: "https://www.start.gg/tournament/play-sorbonne-2026/details",
    hote: "start.gg",
    etapes: [
      { debut: "10:00", fin: "10:50", quoi: "Check-in" },
      { debut: "11:00", quoi: "Début du tournoi" },
      { debut: "18:30", quoi: "Fin du tournoi et remise des prix" },
    ],
  },
  {
    id: "tft",
    nom: "Teamfight Tactics",
    lieuId: "atrium",
    plage: "10h00 → 18h30",
    inscription:
      "https://play.toornament.com/fr/tournaments/2539147707801890815/",
    hote: "Toornament",
    etapes: [
      { debut: "10:00", quoi: "Check-in des joueurs pré-inscrits" },
      { debut: "11:00", quoi: "Début du tournoi" },
      { debut: "18:30", quoi: "Fin du tournoi et remise des prix" },
    ],
  },
  {
    id: "mariokart",
    nom: "Mario Kart World",
    lieuId: "atrium",
    plage: "10h00 → 18h30",
    inscription:
      "https://play.toornament.com/fr/tournaments/2539147973964118015/",
    hote: "Toornament",
    etapes: [
      { debut: "10:00", quoi: "Check-in des joueurs pré-inscrits" },
      { debut: "10:30", quoi: "Ouverture des inscriptions sur place" },
      { debut: "11:00", quoi: "Début du tournoi" },
      { debut: "18:30", quoi: "Fin du tournoi et remise des prix" },
    ],
  },
  {
    id: "tetrio",
    nom: "TETR.IO",
    lieuId: "amphi45a",
    plage: "10h00 → 17h45",
    inscription: "https://parry.gg/fscup-psu-3",
    hote: "parry.gg",
    places: "32 places",
    etapes: [
      { debut: "10:00", fin: "11:00", quoi: "Check-in" },
      { debut: "11:00", fin: "12:30", quoi: "Phases de poules" },
      { debut: "13:30", fin: "15:30", quoi: "Bracket principal" },
      { debut: "15:30", fin: "17:00", quoi: "Top 8" },
      { debut: "17:00", fin: "17:45", quoi: "Finales" },
      { debut: "17:45", quoi: "Remise des prix" },
    ],
    note: "L'amphi 45A reste ouvert en freeplay en dehors des phases de tournoi.",
  },
  {
    id: "pokemon",
    nom: "Pokémon Close Combat",
    lieuId: "amphi45b",
    plage: "15h00 → 18h40",
    inscription:
      "https://docs.google.com/forms/d/e/1FAIpQLSeyf2YtqP4rZHg82d2tdaT2DAZBEKENWfHJCKesxd9AARs_KA/viewform?usp=dialog",
    hote: "formulaire Google",
    places: "16 joueurs",
    etapes: [
      { debut: "15:00", fin: "15:30", quoi: "Check-in" },
      { debut: "16:00", fin: "16:40", quoi: "Phases de poules" },
      { debut: "16:50", fin: "17:40", quoi: "Demi-finales" },
      { debut: "17:40", fin: "18:30", quoi: "Finale" },
      { debut: "18:30", quoi: "Remise des prix" },
    ],
  },
  {
    id: "osu",
    nom: "osu! et osu!mania 7K",
    lieuId: "foyer",
    plage: "10h00 → 16h45",
    inscription: "https://osu.ppy.sh/community/forums/topics/2239179?n=1",
    hote: "forum osu!",
    places: "32 places osu!, 16 places osu!mania 7K",
    etapes: [
      { debut: "10:00", fin: "10:30", quoi: "Check-in" },
      { debut: "11:00", quoi: "16es de finale osu! · 8es de finale osu!mania 7K" },
      { debut: "12:00", quoi: "8es de finale osu! · quarts de finale osu!mania 7K" },
      { debut: "13:00", quoi: "Quarts de finale osu! · demi-finales osu!mania 7K" },
      { debut: "14:00", quoi: "Demi-finales osu!" },
      { debut: "15:00", quoi: "Finale osu!mania 7K" },
      { debut: "16:45", quoi: "Finale osu!" },
    ],
    note: "Les deux brackets tournent en parallèle : osu! d'un côté, osu!mania 7K de l'autre.",
  },
  {
    id: "cosplay",
    nom: "Concours Cosplay",
    lieuId: "pyramide",
    plage: "15h30 → 17h30",
    inscription: "https://inscription.epic-asso.com/news/29",
    hote: "EPIC",
    etapes: [
      { debut: "15:30", fin: "16:15", quoi: "Passage des cosplayeuses et cosplayeurs" },
      { debut: "17:00", fin: "17:30", quoi: "Résultats et remise des prix" },
    ],
    note: "Sur la scène Pyramide, avec EPIC. Entre les deux, karaoké et blind test.",
  },
];

/* ------------------------------------------------------------------ */
/* La programmation : trois scènes, trois frises, un jeu d'onglets     */
/* ------------------------------------------------------------------ */

export type Seance = {
  debut: string;
  /* absent = un instant, pas une plage (« 17h45, la finale ») */
  fin?: string;
  titre: string;
  /* qui intervient */
  par?: string;
  note?: string;
  /* étiquette courte posée sur la pastille horaire */
  tag?: string;
  /* pour l'auditorium : la session de casting que ce créneau désigne */
  session?: string;
};

export type Volet = {
  id: string;
  label: string;
  /* état affiché sur l'onglet quand le programme n'est pas complet */
  etat?: string;
  /* onglet non ouvrable : le volet est prêt, mais rien n'y est encore
     publié — il n'y a rien à aller voir tant que ça dure */
  inerte?: boolean;
  lieu: string;
  lieuId: string;
  plage: string;
  titre: string;
  chapo: string;
  reperes: { v: string; l: string }[];
  seances: Seance[];
  /* message d'attente, affiché sous la frise */
  attente?: string;
};

export const volets: Volet[] = [
  {
    id: "auditorium",
    label: "Auditorium",
    lieu: "Auditorium",
    lieuId: "auditorium",
    plage: "10h00 → 18h00",
    titre: "Jeu de rôle interactif",
    chapo:
      "Neuf invités montent sur la scène de l'auditorium pour jouer une partie devant la salle. FibreTigre anime les deux parties avec un casting qui change d'une session à l'autre. Pensez à récupérer les billets !",
    reperes: [
      { v: "9", l: "invités" },
      { v: "2 × 2h30", l: "de partie" },
      { v: "Sur billet", l: "retrait sur place" },
    ],
    seances: [
      {
        debut: "10:00",
        fin: "11:00",
        titre: "Retrait des billets",
        tag: "Billets",
        note: "500 billets gratuits pour la session du matin, 500 pour celle de l'après-midi. Premiers arrivés, premiers servis !",
      },
      {
        debut: "11:00",
        fin: "13:30",
        titre: "Jeu de rôle interactif, session du matin",
        par: "FibreTigre, Pressea, AngleDroit, Le SadPanda, Lâm et MisterMV",
        session: "matin",
      },
      {
        debut: "14:00",
        fin: "15:20",
        titre: "Retrait des billets",
        tag: "Billets",
        note: "Pour l'après-midi uniquement",
      },
      {
        debut: "15:30",
        fin: "18:00",
        titre: "Jeu de rôle interactif, session de l'après-midi",
        par: "FibreTigre, Lexi, Lydia, Daz et MisterMV",
        session: "aprem",
      },
    ],
  },

  {
    id: "conferences",
    label: "Conférences",
    lieu: "Scène Conférences",
    lieuId: "conf",
    plage: "10h30 → 17h15",
    titre: "Les conférences",
    chapo:
      "Sept interventions s'enchaînent sur la scène Conférences. Au programme : cryptographie, sémiotique, représentation animale, réalité virtuelle et adaptation littéraire.",
    reperes: [
      { v: "7", l: "interventions" },
      { v: "45 min", l: "chacune" },
    ],
    seances: [
      {
        debut: "10:30",
        fin: "11:15",
        titre: "Représentation animale dans le jeu vidéo",
        par: "Florian Verdier",
      },
      {
        debut: "11:30",
        fin: "12:15",
        titre:
          "Comment les nouvelles productions inspirent-elles les jeunes artistes à casser les codes de la 3D ?",
        par: "Marion Valls et Siheme Bouaou",
      },
      {
        debut: "12:30",
        fin: "13:15",
        titre:
          "Jouer à des jeux de société sans craindre les tricheurs grâce à la cryptographie",
        par: "Xavier Bultel",
      },
      {
        debut: "13:30",
        fin: "14:15",
        titre: "Mentir honteusement aux joueurs sur leurs villes",
        par: "Hugo Saal",
      },
      {
        debut: "14:30",
        fin: "15:15",
        titre: "Adapter Émile Zola en jeu vidéo",
        par: "Alina Gonzalez Mediano et Samuel Freche",
      },
      {
        debut: "15:30",
        fin: "16:15",
        titre:
          "Lire entre les pixels : la sémiotique au cœur de la conception de jeux",
        par: "Gwendolyn Garan",
      },
      {
        debut: "16:30",
        fin: "17:15",
        titre: "La rééducation gamifiée en réalité virtuelle",
        par: "Olivier Pons, Théo Combe, Eulalie Verhulst",
      },
    ],
  },

  {
    id: "pyramide",
    label: "Scène Pyramide",
    lieu: "Scène Pyramide",
    lieuId: "pyramide",
    plage: "10h00 → 19h00",
    titre: "La scène Pyramide",
    chapo:
      "C'est la scène qui ouvre et qui referme la journée : jeux indés, Just Dance géant, Kahoot, concours cosplay, karaoké et blind test s'y succèdent de 10h à 19h, avant la tombola et les remerciements.",
    reperes: [
      { v: "9", l: "rendez-vous" },
      { v: "10h00 → 19h00", l: "de scène" },
      { v: "Accès libre", l: "sans billet" },
    ],
    seances: [
      {
        debut: "10:00",
        fin: "11:00",
        titre:
          "On s'excite en testant des jeux indés comme si c'était encore la coupe du monde !!!!!!!",
        note: "Alors que c'est fini depuis longtemps.",
      },
      {
        debut: "11:15",
        fin: "12:15",
        titre: "Just Dance géant",
        par: "Just Dance Club France",
      },
      {
        debut: "12:30",
        fin: "13:45",
        titre:
          "Venez remporter des lots ! Objectif 1000 personnes sur le Kahoot !",
        note: "Coup de cœur de l'équipe PSU ♥",
      },
      {
        debut: "14:00",
        fin: "15:15",
        titre: "(re) Just Dance géant",
        par: "Just Dance Club France",
      },
      {
        debut: "15:30",
        fin: "16:15",
        titre: "Concours Cosplay",
        par: "EPIC",
      },
      {
        debut: "16:15",
        fin: "17:00",
        titre:
          "Karaoké & blind test : venez perdre vos poumons en attendant les résultats du Concours Cosplay !?!!??!",
      },
      {
        debut: "17:00",
        fin: "17:30",
        titre: "Résultats du Concours Cosplay",
        par: "EPIC",
      },
      {
        debut: "17:45",
        titre: "Finale des Fruits contre les Légumes !",
      },
      {
        debut: "18:30",
        fin: "19:00",
        titre: "Tombola & remerciements",
        tag: "Clôture",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Les têtes d'affiche de l'auditorium                                 */
/* ------------------------------------------------------------------ */

export type Invite = {
  id: string;
  nom: string;
  /* rôle à la table, jamais déduit du nom ni du pseudonyme de la personne */
  role: string;
  sessions: string[];
  /* largeur du détourage à 520 px de haut, sert de ratio de mise en rang */
  ratio: number;
  ordre: number;
};

export const sessions = [
  { id: "matin", label: "Session du matin", plage: "11h00 – 13h30" },
  { id: "aprem", label: "Session de l'après-midi", plage: "15h30 – 18h00" },
];

export const invites: Invite[] = [
  { id: "angledroit", nom: "AngleDroit", role: "À la table", sessions: ["matin"], ratio: 258, ordre: 1 },
  { id: "lam", nom: "Lâm", role: "À la table", sessions: ["matin"], ratio: 246, ordre: 2 },
  { id: "lesadpanda", nom: "Le SadPanda", role: "À la table", sessions: ["matin"], ratio: 292, ordre: 3 },
  { id: "pressea", nom: "Pressea", role: "À la table", sessions: ["matin"], ratio: 337, ordre: 4 },
  { id: "fibretigre", nom: "FibreTigre", role: "Anime la partie", sessions: ["matin", "aprem"], ratio: 328, ordre: 10 },
  { id: "mistermv", nom: "MisterMV", role: "À la table", sessions: ["matin", "aprem"], ratio: 324, ordre: 8 },
  { id: "lexi", nom: "Lexi", role: "À la table", sessions: ["aprem"], ratio: 281, ordre: 7 },
  { id: "lydia", nom: "Lydia", role: "À la table", sessions: ["aprem"], ratio: 295, ordre: 6 },
  { id: "daz", nom: "Daz", role: "À la table", sessions: ["aprem"], ratio: 387, ordre: 5 },
];

/* ------------------------------------------------------------------ */
/* Les expositions : pas d'horaire, pas de file d'attente              */
/* ------------------------------------------------------------------ */

export const expositions = [
  {
    nom: "Informatissage",
    desc: "Techniques textiles et imagerie informatique.",
    doodle: "psuf-doodle-spaceinvader",
  },
  {
    nom: "Pourquoi les jeux vidéo nous captivent ?",
    desc: "Mécanismes cognitifs et game design.",
    doodle: "psuf-doodle-manette",
  },
];

/* ------------------------------------------------------------------ */
/* Les associations                                                    */
/* La légende du plan les situe : « Espace Jeux vidéos + Bornes +      */
/* Associations », zone `videos`, dans le bâtiment BDL1.               */
/* ------------------------------------------------------------------ */

export type Asso = {
  nom: string;
  /* clé dans src/assets/festival/part */
  img: string;
  lien: string;
};

export const zoneAssos = "videos";

export const associations: Asso[] = [
  { nom: "Dés'n'Dés", img: "desndes", lien: "https://desndesorbonne.fr" },
  { nom: "MEDArcade", img: "medarcade", lien: "https://www.facebook.com/MEDArcade/" },
  { nom: "Make Some Noise", img: "msn", lien: "https://asso-msn.fr" },
  { nom: "Next Gaymer", img: "nextgaymer", lien: "https://nextgaymer.com" },
  { nom: "Diderot et Dragons", img: "diderot", lien: "https://www.instagram.com/diderot_et_dragons/" },
  /* le logo de l'asso écrit « Débord », pas « Débors » comme _infos.csv */
  { nom: "Débord de Missel", img: "debord", lien: "https://ddm.eproshopping.fr" },
];

/* ------------------------------------------------------------------ */
/* Les dix zones du plan, dans l'ordre de la légende officielle        */
/* ------------------------------------------------------------------ */

export type Zone = {
  id: string;
  lib: string;
  /* le lieu de la frise, quand la zone en porte un */
  ou?: string;
  couleur: string;
};

export const zones: Zone[] = [
  { id: "conf", lib: "Espace Conférences + Scène Conférences", couleur: "var(--l-conf)" },
  { id: "libres", lib: "Jeux Libres + Expositions + Scène Pyramide", couleur: "var(--l-pyramide)" },
  { id: "tournois", lib: "Tournois TFT, Super Smash Bros. Ultimate, Mario Kart World", ou: "Atrium", couleur: "var(--l-atrium)" },
  { id: "osu", lib: "Tournoi osu!", ou: "Foyer", couleur: "var(--l-foyer)" },
  { id: "pokemon", lib: "Tournoi Pokémon Close Combat", ou: "Amphi 45B", couleur: "var(--l-amphi45b)" },
  { id: "tetris", lib: "Tournoi Tetris", ou: "Amphi 45A", couleur: "var(--l-amphi45a)" },
  { id: "societe", lib: "Espace Jeux de Société", couleur: "#21C0D6" },
  { id: "videos", lib: "Espace Jeux vidéos + Bornes + Associations", couleur: "#00ABEA" },
  { id: "snack", lib: "Espace Snack + Repas", couleur: "#8C439A" },
  { id: "jdep", lib: "Espace Journées Européennes du Patrimoine", couleur: "#6E479C" },
];

/* ------------------------------------------------------------------ */
/* Les photos des éditions précédentes (kit presse de l'agence)        */
/* ------------------------------------------------------------------ */

export const photos = [
  { f: "ph0", legende: "Les stands", alt: "Une allée de stands du festival, des visiteurs autour des tables de jeu." },
  { f: "ph1", legende: "Les bornes d'arcade", alt: "Des visiteurs devant une rangée de bornes d'arcade décorées." },
  { f: "ph2", legende: "Les jeux libres", alt: "Deux visiteurs jouent à un jeu sur un écran, en accès libre." },
  { f: "ph3", legende: "Les conférences", alt: "Une salle en gradins, tournée vers un écran de projection, pendant une conférence." },
  { f: "ph4", legende: "Les tournois", credit: "photo Rémi Panne", alt: "Des joueurs concentrés, manettes en main, pendant un tournoi de jeu vidéo." },
];

/* ------------------------------------------------------------------ */
/* Outils de frise : conversion des heures en colonnes de quart d'heure */
/* ------------------------------------------------------------------ */

const PAS = 15;
const enMinutes = (h: string) => {
  const [a, b] = h.split(":").map(Number);
  return a * 60 + b;
};

export const OUVERTURE = enMinutes(festival.ouvre);
export const FERMETURE = enMinutes(festival.ferme);
export const NB_COLONNES = (FERMETURE - OUVERTURE) / PAS; // 36

/*
 * Place un créneau sur la grille. La grille est graduée au quart d'heure :
 * un créneau qui ne tombe pas sur une graduation (15h20) occupe la colonne
 * entamée et se fait rogner de la fraction en trop, pour finir au bon endroit.
 */
export function colonnes(debut: string, fin: string) {
  const d = enMinutes(debut);
  const f = enMinutes(fin);
  const col = 2 + Math.floor((d - OUVERTURE) / PAS);
  const finCol = 2 + Math.ceil((f - OUVERTURE) / PAS);
  const largeur = (finCol - col) * PAS;
  const trop = finCol * PAS + OUVERTURE - PAS * 2 - f;
  return {
    grille: `${col}/${finCol}`,
    rogne: trop > 0 ? `${((trop / largeur) * 100).toFixed(1)}%` : null,
  };
}

/* « 10:00 » → « 10h00 » ; « 10:00 »/« 16:30 » → « 10h00 → 16h30 » */
export const heure = (h: string) => h.replace(":", "h");
export const plage = (debut: string, fin: string) =>
  `${heure(debut)} → ${heure(fin)}`;

export const nomLieu = (id: string) =>
  lieux.find((l) => l.id === id)?.nom ?? id;
