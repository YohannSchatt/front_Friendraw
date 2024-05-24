import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  build: {
    outDir: 'dist', // Répertoire de sortie pour les fichiers de build
    assetsDir: '.', // Répertoire des ressources
  },

  // Spécifie le point d'entrée de votre application
  // Par défaut, Vite recherche "main.js" dans le répertoire racine
  // Vous pouvez également modifier cela si nécessaire
  // Cela dépend de votre structure de projet
  // Si vous utilisez un autre point d'entrée, assurez-vous de le spécifier ici
  // Pour une application Vanilla JS, par exemple, le point d'entrée pourrait être "index.html"
  // entry: 'main.js',

  // Vous pouvez ajouter d'autres options de configuration ici selon vos besoins
});
