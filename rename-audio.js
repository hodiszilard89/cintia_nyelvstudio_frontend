const fs = require('fs');
const path = require('path');

// Ide írd be a mappát, ahol a fájlok vannak. 
// A './' azt jelenti, hogy abban a mappában keres, ahonnan elindítod a scriptet.
const directoryPath = './public/audio'; 

fs.readdir(directoryPath, (err, files) => {
  if (err) return console.log('Hiba a mappa olvasásakor: ' + err);

  files.forEach(file => {
    // Ez a varázslat (Regex): Megkeresi a két, ponttal elválasztott számot a fájlnévből.
    // Pl: felismeri a "71-8.06.mp3"-ből a 8-ast és a 06-ost.
    const match = file.match(/(?:.*[- T\.]*)(\d+)\.(\d+)(?:[^\d].*)?\.(mp3|wma)$/i);

    if (match) {
      const unit = match[1];
      const track = match[2];
      const extension = match[3];

      // Kialakítjuk az új, szép, letisztult nevet: pl. t_8_06.mp3
      // A padStart(2, '0') gondoskodik róla, hogy az 1-esből 01 legyen.
      const newName = `t_${unit}_${track.padStart(2, '0')}.${extension.toLowerCase()}`;
      
      const oldPath = path.join(directoryPath, file);
      const newPath = path.join(directoryPath, newName);

      // Fájl átnevezése
      fs.rename(oldPath, newPath, (renameErr) => {
        if (renameErr) throw renameErr;
        console.log(`✅ Átnevezve: ${file}  -->  ${newName}`);
      });
    } else {
      console.log(`⚠️ Nem sikerült felismerni: ${file}`);
    }
  });
});