const fs = require('fs');
const execSync = require('child_process').execSync;

// Odczytaj bieżącą wersję z package.json
const version = require('./package.json').version;
let [major, minor, patch] = version.split('.').map(Number);

// Sprawdź, czy to jest środowisko Preview
const isPreview = process.env.VERCEL_ENV === 'preview';
let previewPatch = patch;

// Jeśli to pull request, zwiększ końcówkę wersji
if (isPreview) {
  // Pobierz numer pull requesta (możesz użyć zmiennej środowiskowej)
  const prNumber = process.env.VERCEL_GIT_PULL_REQUEST_NUMBER || '0';
  previewPatch = parseInt(prNumber, 10);
}

// Pobierz autora i tytuł ostatniego commita
const lastReleasedBy = execSync('git log -1 --pretty=format:"%an"').toString().trim();
const lastChange = execSync('git log -1 --pretty=format:"%s"').toString().trim();
const releaseDate = new Date().toISOString();

// Zbuduj nową wersję
const newVersion = `${major}.${minor}.${previewPatch}`;

// Zbuduj obiekt z informacjami o wersji
const appVersion = {
  version: newVersion,
  lastReleasedBy,
  lastChange,
  releaseDate
};

// Zapisz dane do appVersion.json w folderze public
fs.writeFileSync('./public/appVersion.json', JSON.stringify(appVersion, null, 2));

console.log('Generated appVersion.json:', appVersion);
