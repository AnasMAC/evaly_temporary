import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

// Fonction pour exécuter les tests un par un
function runTestsSequentially(testFiles) {
  if (testFiles.length === 0) {
    console.log('Tous les tests ont été exécutés.');
    return;
  }

  const file = testFiles.shift();
  console.log(`Exécution de : ${file}`);

  exec(`npx vitest run ${file}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur lors de l'exécution du test ${file}: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Erreur dans le test ${file}: ${stderr}`);
      return;
    }
    // Afficher les résultats du test
    console.log(`Résultats du test ${file}:`);
    console.log(stdout);

    // Exécuter le test suivant
    runTestsSequentially(testFiles);
  });
}

// Lister tous les fichiers de test dans le répertoire 'tests'
const testDirectory = path.join(process.cwd(), '__tests__');
const testFiles = fs.readdirSync(testDirectory)
  .filter(file => file.endsWith('.test.js') || file.endsWith('.spec.js'))
  .map(file => path.join(testDirectory, file));

// Lancer les tests un par un
runTestsSequentially(testFiles);
