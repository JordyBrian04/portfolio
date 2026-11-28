# Contrat des simulations du musée

Chaque projet = un fichier `js/sims/<id>.js` (IIFE, JavaScript sans dépendance, sans réseau).

```js
window.MuseumSims = window.MuseumSims || {};
window.MuseumSims['<id>'] = {
  frame: 'phone',            // écran de téléphone : 320 x 660 px CSS (le musée dessine le boîtier autour)
  steps: ['…', '…'],         // 4 à 6 étapes courtes (7 mots max), affichées en guide à côté du téléphone
  mount(root, ctx) {         // root : div vide 320x660, position:relative, overflow:hidden, police Inter
    // ctx.setStep(i)   surligne l'étape i (0-based) du guide ; à appeler quand le visiteur progresse
    // ctx.toast(txt)   affiche un message court au-dessus du téléphone
    // ctx.reduced      true si prefers-reduced-motion
    return { destroy() {}, reset() {} };   // destroy : retirer écouteurs et minuteurs ; reset : revenir à l'écran 1
  }
};
```

Règles :
- Ajouter la classe `sim-<id>` sur root ; tout le CSS est injecté une seule fois dans `<style id="sim-<id>-css">` et préfixé par `.sim-<id>`.
- L'élément à toucher ensuite reçoit la classe `sim-hint` (anneau pulsé fourni par le musée). Une seule à la fois.
- Souris ET tactile (pointer events). Boutons = `<button type="button">` avec libellé lisible.
- Textes d'interface en français, repris de la fiche ; données fictives uniquement.
- Images autorisées : `assets/musee/<id>.png` si elle existe. Sinon, logo en texte/CSS.
- Pas de `localStorage`, pas de `fetch`, pas d'`alert`.
- Le parcours doit pouvoir se refaire : un bouton « Recommencer » à la fin appelle reset.
