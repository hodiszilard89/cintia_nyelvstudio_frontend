// generateAudio.js
import 'dotenv/config';
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';

// Beállítjuk a környezeti változót a letöltött kulcshoz
process.env.GOOGLE_APPLICATION_CREDENTIALS = './google-key.json';

async function generateMp3() {
  // Létrehozzuk a klienst
  const client = new textToSpeech.TextToSpeechClient();

  // A szöveg, amit fel akarunk olvasni
  const text = 'I went to the cinema with my friends yesterday.';

  const request = {
    input: { text: text },
    // Beállítjuk a nyelvet és a prémium Neural2 hangot
    voice: { languageCode: 'en-GB', name: 'en-GB-Neural2-A' },
    // Kérjük, hogy MP3 formátumban adja vissza
    audioConfig: { audioEncoding: 'MP3' },
  };

  console.log('Generálás folyamatban az AI segítségével...');

  try {
    // Elküldjük a kérést a Google-nek
    const [response] = await client.synthesizeSpeech(request);
    
    // Lementjük a kapott bináris adatot egy MP3 fájlba (Node ES module verzió)
    fs.writeFileSync('test-sentence.mp3', response.audioContent, 'binary');
    
    console.log('Siker! Az audio fájl mentve lett: test-sentence.mp3');
  } catch (error) {
    console.error('Hiba történt:', error);
  }
}

generateMp3();