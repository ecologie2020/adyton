## Européennes 2019 par bureau de vote

### Source

https://www.data.gouv.fr/fr/datasets/r/77c4450b-7fa7-425c-84da-4f7bf4b97820

### Surprises et traitement

- Le fichier n'est pas en UTF-8, il faut le convertir.
- Le délimiteur est `;` et non `,`.
- Le fichier est très gros, `grep ;$nom_ville;`.
- La ligne 1 ne décrit pas réellement le fichier : elle donne une forme générale mais une ligne correspond à un bureau, pas à une liste, toutes les listes sont sur la même ligne, uniquement détectables par un nombre fixe de champs.
