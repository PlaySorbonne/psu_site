# Site Web de l'association [PSU](https://playsorbonne.fr) !

(quand y a marqué (dev) dans le titre, c'est que ça concerne la partie code, vous aurez pas besoin de ça si vous modifier que le markdown)

## Installation

Il faut [nodeJs et npm](https://nodejs.org/en/download/) d'installé sur votre machine.

à l'aide de npm, vous pourrez installer Yarn, qui est un gestionnaire de paquets utilisé pour ce projet.Tapez dans le terminal

```bash
npm install -g yarn
```

Ensuite, il faut installer les dépendances du projet, pour cela, tapez dans le terminal **à la racine du projet** :

```bash
yarn
```

## Lancer le projet

Pour lancer l'environnement de développement, (site web local qui permet de voir les changements en direct), tapez dans le terminal à la racine du projet :

```bash
yarn dev
```

Si vous voulez compiler la version production du site, tapez dans le terminal à la racine du projet :

```bash
yarn build
```

Cela va créer un dossier /dist qui contient le site web compilé.

(<!> La branch main est automatisé, n'importe quel commit est envoyé compilé et mis à jour sur https://playsorbonne.fr <!>)

## Syntaxe des markdowns / markdowns avancés

Tout les markdowns respectent la syntaxe de base du markdown (à peu près la même que celle sur discord ! Je vous laisse vous renseigner des bases [ici](https://www.markdownguide.org/basic-syntax/) et une bonne partie de syntaxe basique html), mais il y a quelques subtilités :

Les ici markdowns sont précédés d'un "frontmatter", c'est un bloc de texte entre 2 lignes de 3 tirets, il permet de définir des variables qui seront utilisés par le code pour générer la page.

Par exemple, le fichier `src/pages/luxludi/gamejam.md` contient :

```yaml
---
layout: ../../layouts/events/LuxLudiE.astro
title: Des game jams !
cover: /assets/events/cover/gamejam.webp
description: "descritpion de la page..."
---
// contenu
```

Dans les mardownsX (qui finissent par mdX), il est possible d'utiliser des composants custom (définis dans `/src/components`), par exemple, le fichier `src/pages/luxludi/gamejam.mdx` contient :

```mdx
import ImageText from "@/components/markdown/gamejam/ImageText.astro";

<ImageText img="/assets/gamejam/JP_universite.jpg">

## Gagnant jeu de plateau

blablabla

<ImageText />
```

Ces composants prennent des variables en paramètres (ici img (qui est un lien vers une image dans le dossier `public`)), et peuvent prendre du contenu markdown aussi (ici le contenu entre les balises `<ImageText>` et `</ImageText>`).

Noyus verrons plus bas les différents composants custom, et comment les utiliser. Juste sachez les plus importants sont `<Section>` et `<SectionB>` qui encapsulent une section, avec sectionB celui avec un background sombre.

(TODO j'aimerais dégager à terme les "import")

### Les variables du frontmatter

- **layout** : le layout utilisé pour générer la page, c'est le code qui va déterminer comment traiter le markdown, il est possible de créer des layouts personnalisés, mais il y en a déjà quelques uns de prêt à l'emploi dans le dossier `/src/layouts`. Petite subtilité, le chemin du layout est relatif au dossier `/src/layouts`, par exemple, le layout utilisé dans le fichier `src/pages/luxludi/gamejam.md` est `../../layouts/events/LuxLudiE.astro`, il est donc situé dans le dossier `/src/layouts/events/LuxLudiE.astro`. Nous verrons plus bas les différents layouts.

- **title** : le titre de la page, il sert comme titre de la page, comme titre dans le carrousel, et comme titre dans les listes d'événements.

- subtitle : (optionnel) le sous-titre de la page, il sert comme sous-titre dans le carrousel.

- **cover** : lien de l'image de couverture de la page, elle est utilisé dans le carrousel. Elle doit être mise dans le dossier **public**, et le lien indiqué est le lien sans "/public/" au début. (C'est le lien final aussi de l'image en production).

- **description** : la description de la page, elle est utilisé dans les listes d'événements _et dans les meta tags de la page (TODO)_. (meta tags = les informations qui sont utilisés par les moteurs de recherche pour référencer le site & liens sur les réseaux sociaux)

- **icon** : L'icone de la page, elle est utilisé dans les listes d'événements. De même que cover, il faut indiquer le lien de l'image à partir du dossier /public.

- showDescription (optionnel) : si true, crée une section avec le titre de la page et la description (celle indiqué en variable). (true/false)

- eventTitle (optionnel) : Change le titre de la liste des événements. (par défaut : "nos événements")

- eventDescription (optionnel) : ajoute le texte à la description de la liste des événements.

- isClub : (optionnel) si la page est un club, elle sera pas affiché dans les listes d'événements, _et elle sera affiché dans la liste des clubs (TODO)._ (true/false)

- alt : (optionnel) le texte alternatif de l'image de couverture de la page, il est utilisé pour les personnes qui ne peuvent pas voir l'image, et pour les moteurs de recherche. à défaut d'être renseigné, le titre de la page est utilisé.

- noLink : (optionnel) La page sera affiché sur le carroussel et/ou dans les listes d'événements, mais elle ne sera pas accessible en cliquant dessus si marqué à true. (true/false)

- dontList : (optionnel) La page ne sera pas affiché dans le caroussel et/ou les listes d'événements si marqué à true. (true/false)

- priority : (optionnel) La priorité de la page, elle est utilisé pour trier les pages dans les listes d'événements, par défaut, elle est à 0, plus elle est grande, plus la page sera en haut de la liste. (nombre)

- nav : (optionnel) truc un peu moche qui va pas durer longtemps, il va dégager. C'est pour indiquer quoi afficher dans la barre de navigation. Si vous avez la fois la syntaxe ressemble à ça :

```yaml
nav:
  - name: projet pixel
    link: "#pixel"
  - name: modalités
    link: "#modalites"
  - name: participation
    link: "#participation"
  - name: contact
    link: "#contact"
  - name: évaluation
    link: "#evaluation"
```

Avec link le lien, ça peut être n'importe quoi. (Souvent utilisé avec #id pour les liens vers des éléments de la page qui ont un id). L'indentation est importante btw.

## description de l'arborescence

### Les branch du projet

Il y a 2 branchs principales :

- **/main** : la branch principale², c'est celle qui est compilé et mise en ligne sur https://playsorbonne.fr

- **/features** : la branch de développement, une fois une fonctionnalité terminé, elle est mergé dans main, elle aussi est compilé et mise en ligne sur https://demo.playsorbonne.fr

### Les dossiers du projet

- **/src** : contient tout les fichiers sources du projet

- **/src/pages** : les pages de l'application, c'est ici que se trouve le contenu des pages. Tout ici est modifiable même sans connaitre du code !

- **/src/assets** : contient les fichiers statiques (images, etc..) utilisé dans le code

- **/public** : contient les fichiers statiques référencés dans les mds

- **/src/components** : les composants "réutilisable" de l'application

- **/src/layouts** : les layouts de l'application, cad tout ce qui est commun à plusieurs pages et le code expliquant comment traiter les markdowns

- **/src/plugins** : les plugins custom du markdown (WIP)

#### pages

Les pages sont des fichiers markdowns (.md) ou MDX (.mdx) qui sont traités par le code pour générer les pages du site web. La syntaxe et subtilités sont expliqués plus bas.

Le chemin des pages est important, il détermine l'url de la page, par exemple, le fichier `src/pages/luxludi/gamejam.md sera accessible à l'url https://playsorbonne.fr/luxludi/gamejam`

Petite subtilité, les fichiers index.md(x) sont traités comme le fichier source du dossier, par exemple, le fichier `src/pages/luxludi/index.md(x)` sera accessible à l'url https://playsorbonne.fr/luxludi/

#### Les layouts

##### events

Les layouts qui se trouvent dans `/src/layouts/events` sont les layouts des pages d'événements (ou plutôt des pages qui n'ont pas de fils).

- **/src/layouts/events/Event.astro** : le layout de base, il contient le carrousel et la liste des événements. Il est utilisé par les layouts suivants.

tout les autres événements sont des layouts qui dérivent de celui là, ils ont juste la couleurs qui changes (et l'inversage des couleurs des gradients des fois).

- **/src/layouts/events/PsuE.astro** : le layout des pages des événements PSU.

- **/src/layouts/events/LuxLudiE.astro** : le layout des pages des événements LuxLudi.

- **/src/layouts/events/PlsE.astro** : le layout des pages des événements de la PLS.

- **/src/layouts/events/DlcE.astro** : le layout des pages des événements de DLC.

##### parent

Les layouts qui se trouvent dans `/src/layouts/parent` sont les layouts des pages qui ont des fils (cad des pages qui sont dans un dossier).

- **/src/layouts/parent/Parent.astro** : le layout de base, il contient le carrousel et la liste des événements. Il est utilisé par les layouts suivants.

tout les autres événements sont des layouts qui dérivent de celui là, ils ont juste la couleurs qui changes (et l'inversage des couleurs des gradients des fois).

- **/src/layouts/parent/PsuP.astro** : le layout des pages des événements PSU.

- **/src/layouts/parent/LuxLudiP.astro** : le layout des pages des événements LuxLudi.

- **/src/layouts/parent/PlsP.astro** : le layout des pages des événements de la PLS.

- **/src/layouts/parent/DlcP.astro** : le layout des pages des événements de DLC.

##### partials (dev)

partials parce que c'est censé et conçu pour être utilisé par un autre layout, ces des layouts qui ne peuvent pas existé tout seul. C'est pas super important, y en a un seul et c'est :

- `/src/layouts/partials/HeaderL.astro` : le head de la page, il contient les meta tags, les liens vers les font custom, etc...

la descritpion des variables est dans le fichier.

##### FrontPage (dev)

Le layout qui se trouve à `/src/layouts/FrontPage.astro` est le layout principal, tout les autres layout dérivent de celui là, il trace les grandes lignes tel que le carrousel et la liste des événements (optionnel). La description des variables est dans le fichier

#### Les composants

##### markdowns

Quand vous les utilisez dans un .mdx, voici la syntaxe :

```mdx
import ComponentName from "@/components/markdown/ComponentName.astro"; // ça va dégager woula

<ComponentName prop1="value1" prop2="value2" prop3="value3">

# markdown omg

waa **markdown**

</ComponentName>
```

- **Section** : un composant qui affiche une section. Indispensable ! une page doit au moins avoir un Section(B).

- **SectionB** : un composant qui affiche une section avec un background sombre.

- **ColorLigne**: ligne de gradient de couleur toute joulie.

- **ImageText** : un composant qui affiche une image, il prends 2 props : img (le lien de l'image) et right (true/false, si l'image est à droite ou à gauche. Défaut à false (donc image à gauche)).

- **YtEmbed** : un composant qui affiche une vidéo youtube, il prends 2 props : ytLink (le lien de la vidéo youtube) et title (le titre de la vidéo, optionnel).
