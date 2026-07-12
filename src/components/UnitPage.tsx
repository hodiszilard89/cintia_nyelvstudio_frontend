import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect } from 'react';
import { useSentences } from '../hooks/useSentencies';
import {
  Box, Flex, VStack, Heading, Text, Button, Divider,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  IconButton, HStack, Circle, List, ListItem, ListIcon,
  RadioGroup, Radio, Stack, Badge, Input, ButtonGroup, SimpleGrid
} from '@chakra-ui/react';
import { useVocabulary } from '../hooks/useVocabulary'
import { BookViewer } from './BookViewer';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiVolume2, FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import { useBookAudio } from '../hooks/useBookAudio';
import { useBookPage } from '../hooks/useBookPages';
import { formatTime, shuffleArray, speakEnglish } from '../utils';
import { FlipCard as FlipCard2 } from './FlipCard_2';
import { FlashCard } from './FlashCard';
import { SidebarButton } from './SidebarButton';
import { useEssay } from '../hooks/useEssay';
import { EssayEditor } from './EssayEditor';
import { ChoiceButton } from './ModeChoice';
import type { MachGameWord } from '../types';

// Egyetlen független kártya, ami a saját forgását kezeli

//fő oldal
export const UnitPage = () => {
  const { id } = useParams<{ id: string }>();
  const lessonId = Number(id) || 1;
  // 1. A memóriában ott van a lecke összes hanganyaga (pl. 15 darab mp3 adat)
  const { audios } = useBookAudio(lessonId);
  const { pages } = useBookPage(lessonId);


  // 3. Kiszűrjük CSAK azokat a hangokat, amik a 2. oldalhoz kellenek

  // --- 1. KÖZÖS ÁLLAPOTOK (Memória) ---
  const [activeTab, setActiveTab] = useState('vocabulary'); // Alapértelmezett fül: Nyelvtan
  const [currentSlide, setCurrentSlide] = useState(0);
  const getCurrentTaskNumber = (tabName: string) => {
    // Megkeresi az első számot a szövegben (pl. "pronunciation2" -> "2")
    const match = tabName.match(/\d+/);
    return match ? Number(match[0]) : 1; // Ha nem talál számot, alapértelmezetten 1
  };
  // --- IDŐZÍTŐ ÁLLAPOTOK ---

  const navigate = useNavigate();
  const [timer, setTimer] = useState<number>(0); // Eltelt idő másodpercekben
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false); // Fut-e az óra
  // 1. Letöltjük a teljes csomagot a leckéhez (csak egyszer fut le)
  const { sentences, loading, error } = useSentences(lessonId);

  // 2. Kiszámoljuk, hanyadik feladat fülön állunk (pl. "pronunciation2" -> 2)
  const currentTaskNumber = getCurrentTaskNumber(activeTab);
  // ---> ÚJ: Kiszámoljuk az egyedi feladatszámokat a mondatokból <---
  // A Set eltávolítja a duplikációkat, így ha van húsz 1-es feladat, csak egy 1-est kapunk vissza.
  // A .sort() pedig sorba rendezi őket, hogy a Kiejtés 1 biztosan a Kiejtés 2 előtt legyen.
  const uniqueTaskNumbers = Array.from(new Set(sentences.map(s => s.taskNumber))).sort((a, b) => a - b);
  // 3. KLIENSOLDALI SZŰRÉS: Kiszűrjük a 90 mondatból azt a ~20-at, ami ide kell
  // Ez a sor minden fülváltásnál lefut a memóriában, méghozzá azonnal (0 millimásodperc alatt)!
  const activeSentences = sentences.filter(s => s.taskNumber === currentTaskNumber);
  // Az időzítő effekt: másodpercenként növeli a timer értékét, ha aktív
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  // Segédfüggvény, ami a másodperceket szép MM:SS formátumba alakítja (pl. 65 -> 01:05)

  const { words, loading: wordsLoading, error: wordsError } = useVocabulary(lessonId);
  // A 'match' lesz a párosító játékunk
  const [vocabMode, setVocabMode] = useState<'list' | 'flashcard' | 'match'>('list');
  // --- PÁROSÍTÓ JÁTÉK ÁLLAPOTAI ---
  const [gameCards, setGameCards] = useState<MachGameWord[]>([]); // A játék 40 (vagy kevesebb) kártyája
  const [selectedCards, setSelectedCards] = useState<string[]>([]); // Az épp kiválasztott 1 vagy 2 kártya ID-ja

  // Játék indítása / Újrakeverés
  const startMatchGame = () => {
    if (!words || words.length === 0) return;

    // Maximum 20 szót választunk ki véletlenszerűen
    const shuffledWords = shuffleArray(words).slice(0, 20)

    const newCards: MachGameWord[] = [];
    shuffledWords.forEach(word => {
      newCards.push({ id: `en-${word.id}`, text: word.enWord, type: 'en', wordId: word.id, isMatched: false });
      newCards.push({ id: `hu-${word.id}`, text: word.huTranslation, type: 'hu', wordId: word.id, isMatched: false });
    });

    // A 40 kártyát jól összekeverjük
    setGameCards(shuffleArray(newCards));
    setSelectedCards([]);
    // IDŐZÍTŐ INDÍTÁSA
    setTimer(0);
    setIsTimerActive(false);
  };

  // Amikor betölt az oldal, vagy átvált a játékra, rögtön generálunk egy pályát
  useEffect(() => {
    if (vocabMode === 'match') {
      startMatchGame();
    }
  }, [vocabMode, words]);

  // Kattintás egy játékkártyára

  // Kattintás egy játékkártyára
  const handleGameCardClick = (cardId: string) => {
    // 1. Ha már 2 kártya ki van választva (épp pörög a setTimeout), ne engedjünk harmadikat kattintani
    if (selectedCards.length === 2) return;
    // ---> ÚJDONSÁG: Ha az óra még nem megy, és az idő 0, akkor ez az ELSŐ kattintás! Indulhat az idő! <---
    if (!isTimerActive && timer === 0) {
      setIsTimerActive(true);
    }
    // 2. ÚJDONSÁG: Ha egy MÁR KIVÁLASZTOTT kártyára kattint újra, akkor levesszük a kijelölést!
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
      return;
    }

    // 3. Hozzáadjuk a most kattintott kártyát a listához
    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    // 4. Ha megvan a 2 kiválasztott kártya, ellenőrizzük őket
    if (newSelected.length === 2) {
      const card1 = gameCards.find(c => c.id === newSelected[0]);
      const card2 = gameCards.find(c => c.id === newSelected[1]);

      // Ha a szó ID megegyezik, de a nyelv más (egyik 'en', másik 'hu') -> JÓ MEGOLDÁS!
      if (card1 && card2 && card1.wordId === card2.wordId && card1.type !== card2.type) {
        setTimeout(() => {
          // Most már csak simán frissítjük a kártyákat, a leállítást a useEffect intézi!
          setGameCards(prev => prev.map(c =>
            (c.id === card1.id || c.id === card2.id) ? { ...c, isMatched: true } : c
          ));
          setSelectedCards([]);
        }, 200);
      } else {
        // ROSSZ MEGOLDÁS
        setTimeout(() => {
          setSelectedCards([]);
        }, 200); // Gyorsan (0.4 mp) visszavonja a kijelölést
      }
    }
  };

  const handleShuffle = () => {
    setShuffledWords(shuffleArray(shuffledWords));
    setCardPage(0);
    setFlippedCardId(null); // Bezárjuk a nyitott kártyát keveréskor
  };
  // ÚJ: Követi a kártyák oldalszámát (0-tól indul)
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);
  const [cardPage, setCardPage] = useState(0);
  const CARDS_PER_PAGE = 15;


  // ---> ÚJ: Itt tároljuk az összekevert szavakat <---
  const [shuffledWords, setShuffledWords] = useState<any[]>([]);



  // Amikor a backendről megérkeznek az adatok, azonnal összekeverjük őket
  useEffect(() => {
    if (words && words.length > 0) {
      setShuffledWords(shuffleArray(words));
    }
  }, [words]);

  // Ezt a függvényt hívja majd meg a "Keverés" gomb
  ;


  // ... a többi useState alatt:

  // ---> ÚJ: Ide gyűjtjük a befejezett fő feladatokat (hogy kitehessük a menübe a pipát)
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  // ---> ÚJ: Ide gyűjtjük a már felmondott mondatok ID-jait <---
  const [completedSentences, setCompletedSentences] = useState<number[]>([]);
  // --- ALMENÜ ÁLLAPOT A KIEJTÉSHEZ ---
  const [pronunciationMode, setPronunciationMode] = useState<'practice' | 'exam'>('practice');
  // --- WEBSOCKET ÁLLAPOTOK (ÚJ LOGIKA) ---
  // Tároljuk az ID-t, és azt is, hogy mit kell látni: 'NONE' (semmit), 'HU' (csak magyar), 'EN' (magyar + angol)
  // Kibővítjük a fázisokat egy 'END' (Vége) állapottal is
  // ---> JAVÍTOTT VERZIÓ (Benne van a taskId a típusban és az induló értékben is) <---
  const [syncData, setSyncData] = useState<{ taskId: string | null, id: number | null, step: 'NONE' | 'HU' | 'EN' | 'END' }>({
    taskId: null,
    id: null,
    step: 'NONE'
  });
  const sendSyncCommand = (sentenceId: number, step: 'HU' | 'EN' | 'END') => {
    if (stompClient && stompClient.connected) {
      // Beletesszük, hogy épp melyik fülön (taskId) áll a tanár
      const payload = { taskId: activeTab, id: sentenceId, step: step };
      stompClient.publish({
        destination: '/app/change-sentence',
        body: JSON.stringify(payload),
      });
    }
  };
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isTeacher, setIsTeacher] = useState(false); // A kapcsoló marad teszteléshez
  // --- WEBSOCKET ÁLLAPOTOK ---
  // Tárolja, hogy a szerver szerint melyik mondat az aktív


  // Ez a kód akkor fut le, amikor a diák/tanár belép az oldalra
  useEffect(() => {
    // 1. Létrehozzuk a kapcsolatot a Java szerverrel
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str), // Kiírja a konzolra, ha sikerült csatlakozni

      onConnect: () => {
        console.log('✅ Sikeresen csatlakoztunk a WebSockethez!');
        client.subscribe('/topic/pronunciation', (message) => {
          try {
            const receivedData = JSON.parse(message.body);
            setSyncData(receivedData);

            if (receivedData.step === 'EN') {
              setCompletedSentences((prev) => !prev.includes(receivedData.id) ? [...prev, receivedData.id] : prev);
            }

            // ---> ÚJ: Ha vége a feladatnak, kipipáljuk a teljes bal oldali menüpontot! <---
            if (receivedData.step === 'END' && receivedData.taskId) {
              setCompletedTasks((prev) => {
                if (!prev.includes(receivedData.taskId)) return [...prev, receivedData.taskId];
                return prev;
              });
            }

          } catch (e) {
            console.error("Hibás üzenet formátum", e);
          }
        });
      },
    });

    // Indítjuk a csatlakozást
    client.activate();
    setStompClient(client);

    // Amikor a felhasználó elhagyja az oldalt, bontjuk a kapcsolatot
    return () => {
      client.deactivate();
    };
  }, []);

  //----Websocket vége



  // Teszt állapotok
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Fogalmazás állapotok
  const essayLogic = useEssay();

  const grammarSlides = [
    {
      title: "1. A Létige (to be) és rövidítései",
      description: "Az angol nyelv legfontosabb alapköve a létige (am, is, are) megfelelő használata és rövidítése.",
      points: [
        "Én: I am ➡️ I'm",
        "Ő (fiú): He is ➡️ He's",
        "Ő (lány): She is ➡️ She's",
        "Ők: They are ➡️ They're",
        "Mi/Ti: A We és a You mellé is az 'are' kapcsolódik.",
        "Kérdőszavak: what is ➡️ what's | where is ➡️ where's"
      ]
    },
    {
      title: "2. Bemutatkozás és Birtokos névmások",
      description: "Ezekkel a szerkezetekkel tudjuk bemutatni magunkat és másokat, illetve megkérdezni, ki honnan származik.",
      points: [
        "Saját bemutatás: 'My name is' (vagy name's) ➡️ My name's Paula.",
        "Saját származás: 'I'm from' ➡️ I'm from Chicago.",
        "Mások bemutatása: 'This is...' ➡️ This is Rafael. He's from Mexico.",
        "Fiúkra vonatkozó kérdés: 'his' (övé) ➡️ What's his name?",
        "Lányokra vonatkozó kérdés: 'her' (övé) ➡️ What's her name?"
      ]
    },
    {
      title: "3. Mindennapi tárgyak – 'a' vagy 'an'?",
      description: "A tárgyak megnevezésénél (határozatlan névelők) a szó kezdőbetűje dönti el, melyik formát kell használnunk.",
      points: [
        "Az 'a' használata: Mássalhangzóval kezdődő szavaknál (pl. a bag, a ticket).",
        "Az 'an' használata: Magánhangzóval (a,e,i,o,u) kezdődő szavaknál (pl. an apple, an orange).",
        "Többes szám: A szavak végére egyszerűen egy 's' betű kerül."
      ]
    }
  ];

  const testQuestions = [
    { id: 1, type: 'radio', question: "A: Hello. What's your name? \nB: Suzanne. What's ______ name?", options: ["my", "your", "his"], correctAnswer: "your" },
    { id: 2, type: 'radio', question: "Mi a rövidített formája (short form) ennek a mondatnak: 'She is a student.'?", options: ["She're a student.", "Shes a student.", "She's a student."], correctAnswer: "She's a student." },
    { id: 3, type: 'radio', question: "Melyik a helyes névelő? '______ ice-cream'", options: ["a", "an", "two"], correctAnswer: "an" },
    { id: 4, type: 'input', question: "Írd be a hiányzó szót: I ____ from Japan.", correctAnswer: "am" },
    { id: 5, type: 'input', question: "Írd be a hiányzó létigét: My name ____ Anna.", correctAnswer: "is" }
  ];



  // --- 3. FÜGGVÉNYEK (Logika) ---
  const handleAnswerChange = (questionId: number, value: string) => {
    if (isTestSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const submitTest = () => {
    let currentScore = 0;
    testQuestions.forEach(q => {
      const userAnswer = (answers[q.id] || "").trim().toLowerCase();
      const correctAnswer = q.correctAnswer.trim().toLowerCase();
      if (userAnswer === correctAnswer) currentScore += 1;
    });
    setScore(currentScore);
    setIsTestSubmitted(true);
  };

  const resetTest = () => {
    setAnswers({});
    setIsTestSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    // 1. Ha új fülre megyünk, töröljük a belső mondatok pipáit
    setCompletedSentences([]);
  }, [activeTab]);

  useEffect(() => {
    // 2. Ha a diák kap egy jelet, ami másik fülre szól, a gép automatikusan átváltja neki!
    if (!isTeacher && syncData.taskId && syncData.taskId !== activeTab) {
      setActiveTab(syncData.taskId); // Feltételezve, hogy setActiveTab a függvényed neve
    }
  }, [syncData.taskId, isTeacher]); // isTeacher-t is figyeli, hogy csak a diáknál váltson
  // Ezt tedd a UnitPage komponens elejére:

  // A taskNumber attól függ, épp melyik fülön van
  useEffect(() => {
    if (gameCards.length > 0 && gameCards.every(c => c.isMatched)) {
      setIsTimerActive(false);
    }
  }, [gameCards]);
  // --- 4. MEGJELENÍTÉS (UI) ---
  return (
    <Flex w="full" minH="calc(100vh - 200px)" color="white">

      {/* --- BAL OLDALI MENÜ SÁV --- */}
      <Box w="280px" bg="blackAlpha.400" p={6} borderRight="1px solid" borderColor="whiteAlpha.300">
        <Button variant="link" color="whiteAlpha.600" fontSize="sm" fontWeight="normal" _hover={{ color: "pink", textDecoration: "none" }} mb={6} onClick={() => navigate('/home')}>
          ← Vissza a kurzusokhoz
        </Button>
        <Heading size="md" mb={6} color="pink">Unit {id}</Heading>
        <Divider borderColor="whiteAlpha.400" mb={6} />

        <VStack align="stretch" spacing={3}>
          <Accordion allowToggle border="none">
            <AccordionItem border="none">
              <AccordionButton px={4} py={2} borderRadius="md" _hover={{ bg: "whiteAlpha.200" }}>
                <Box as="span" flex='1' textAlign='left' fontWeight="bold" color="whiteAlpha.800">
                  📚 Könyvek
                </Box>
                <AccordionIcon color="whiteAlpha.800" />
              </AccordionButton>
              <AccordionPanel pb={4} pl={6}>
                <VStack align="stretch" spacing={2}>
                  <SidebarButton isActive={activeTab === 'coursebook'}
                    onClick={() => setActiveTab('coursebook')}
                    size="sm"
                    w="100%"
                    justifyContent="flex-start">
                    📖 Tankönyv
                  </SidebarButton>
                  <SidebarButton isActive={activeTab === 'workbook'}
                    onClick={() => setActiveTab('workbook')}
                    size="sm"
                    w="100%"
                    justifyContent="flex-start">
                    📝 Munkafüzet
                  </SidebarButton>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>


          {[
            { id: 'vocabulary', label: ' 📚 Szavak gyűjteménye' },
            { id: 'grammar', label: 'Nyelvtan' },
            { id: 'test', label: 'Teszt & Gyakorlatok' },
            ...uniqueTaskNumbers.map(num => ({
              id: `pronunciation${num}`,
              label: `🗣️ Kiejtés ${num}`
            })),
            { id: 'essay', label: '✍️ Fogalmazás' },
          ].map((item) => (

            <SidebarButton
              key={item.id}
              isActive={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              size="md"
              w="100%"
              justifyContent="flex-start">
              {item.label}

              {/* ---> ÚJ: Ha az adott menüpont ID-ja benne van a kész listában, kirajzoljuk a zöld pipát! <--- */}
              {completedTasks.includes(item.id) && (
                <Text as="span" color="green.400" ml={2} fontSize="xl" fontWeight="bold">
                  ✓
                </Text>
              )}
            </SidebarButton>)
          )}

        </VStack>
      </Box>

      {/* --- JOBB OLDALI TARTALMI RÉSZ --- */}
      <Box flex="1" p={8} overflowY="auto" mx={'auto'} w='auto'>
        {/* ==========================================
    ÚJ ALMENÜ: SZAVAK GYŰJTEMÉNYE
    ========================================== */}
        {activeTab === 'vocabulary' && (
          <Box animation="fadeIn 0.3s" maxW="900px" mx="auto">

            {/* --- ALMENÜ VÁLASZTÓ GOMBOK (Szótár vs. Kártyák) --- */}
            <Flex justify="center" mb={8}>
              <ButtonGroup size="lg" isAttached variant="outline" flexWrap="wrap" justifyContent="center">
                {[
                  { id: 'list', label: '📖 Szótár (Tanulás)' },
                  { id: 'flashcard', label: ' 🗂️ Kártyák (Gyakorlás)' },
                  { id: 'match', label: '🎮 Párosító Játék (Tanulás)' }
                ].map((item) => (
                  <ChoiceButton
                    isActive={vocabMode === item.id}
                    onClick={() => (setVocabMode(item.id as "match" | "list" | "flashcard"))}>
                    {item.label}
                  </ChoiceButton>))}
              </ButtonGroup>
            </Flex>

            {/* --- TÖLTÉS ÉS HIBA KEZELÉSE --- */}
            {wordsLoading && <Text color="whiteAlpha.700" textAlign="center" py={10} fontSize="lg" fontWeight="bold">Szavak betöltése folyamatban... ⏳</Text>}
            {wordsError && <Text color="red.400" textAlign="center" py={10} fontSize="lg" fontWeight="bold">{wordsError} ❌</Text>}
            {!wordsLoading && !wordsError && words.length === 0 && (
              <Text color="whiteAlpha.700" textAlign="center" py={10} fontSize="lg">Nincsenek szavak ehhez a leckéhez.</Text>
            )}

            {!wordsLoading && !wordsError && words.length > 0 && (
              <>
                {/* ==========================================
            1. MÓD: SZÓTÁR (LISTANÉZET)
            ========================================== */}
                {vocabMode === 'list' && (
                  <Box animation="fadeIn 0.3s">
                    <Heading size="lg" mb={2} textAlign="center">Szavak Gyűjteménye</Heading>
                    <Text color="whiteAlpha.700" mb={8} textAlign="center">
                      Tanuld meg a lecke legfontosabb szavait! Kattints a hangszóró ikonra a helyes kiejtésért.
                    </Text>

                    {/* Dinamikus, kétoszlopos rács a letöltött szavakkal */}
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      {words.map((word) => (
                        <Flex
                          key={word.id}
                          bg="blackAlpha.300"
                          p={4}
                          borderRadius="md"
                          align="center"
                          justify="space-between"
                          borderLeft="4px solid"
                          borderColor="pink.400"
                          _hover={{ bg: "blackAlpha.500", transform: "translateY(-2px)" }}
                          transition="all 0.2s"
                        >
                          <Box>
                            <Flex align="baseline" gap={2}>
                              <Text fontSize="lg" fontWeight="bold" color="white">{word.enWord}</Text>
                              {/* Fonetikus átirat, ha van */}
                              {word.phonetic && (
                                <Text fontSize="sm" color="whiteAlpha.500" fontStyle="italic">{word.phonetic}</Text>
                              )}
                            </Flex>
                            <Text fontSize="md" color="pink.200">{word.huTranslation}</Text>
                          </Box>
                          <IconButton
                            aria-label="Meghallgatás"
                            icon={<FiVolume2 size="20px" />}
                            colorScheme="pink"
                            variant="ghost"
                            isRound
                            onClick={(e) => {
                              e.stopPropagation();
                              if (word.audioPath) {
                                new Audio(`http://localhost:8080${word.audioPath}`).play();
                              } else {
                                speakEnglish(word.enWord);
                              }
                            }}
                          />
                        </Flex>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                {/* ==========================================
           {/* ==========================================
            2. MÓD: TANULÓKÁRTYÁK (3x5 RÁCS KÉPEK NÉLKÜL)
            ========================================== */}
                {vocabMode === 'flashcard' && (
                  <Box animation="fadeIn 0.3s" w="100%">

                    {/* Fejléc és Keverés gomb */}
                    <Flex justify="space-between" align="center" mb={6} direction={{ base: "column", md: "row" }} gap={4}>
                      <Box>
                        <Heading size="lg" mb={2}>Szókártyák</Heading>
                        <Text color="whiteAlpha.700">
                          Gondold át angolul a magyar szavakat, majd kattints a kártyára az ellenőrzéshez!
                        </Text>
                      </Box>
                      <Button
                        leftIcon={<span style={{ fontSize: '1.2em' }}>🔀</span>}
                        colorScheme="blue"
                        variant="outline"
                        onClick={handleShuffle}
                      >
                        Újrakeverés
                      </Button>
                    </Flex>

                    {/* A kártyák rácsa */}
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4} mb={8}>
                      {shuffledWords
                        .slice(cardPage * CARDS_PER_PAGE, (cardPage + 1) * CARDS_PER_PAGE)
                        .map((word) => (
                          <FlipCard2
                            key={word.id}
                            word={word}
                            speakEnglish={speakEnglish}
                            // Csak akkor fordul meg, ha az ő ID-ja van a memóriában
                            isFlipped={flippedCardId === word.id}
                            // Kattintáskor beállítja magát aktívnak (vagy bezárja magát, ha már ő volt az aktív)
                            onFlip={() => setFlippedCardId(flippedCardId === word.id ? null : word.id)}
                          />
                        ))}
                    </SimpleGrid>

                    {/* LAPOZÓ */}
                    {shuffledWords.length > CARDS_PER_PAGE && (
                      <Flex justify="center" align="center" gap={6}>
                        <Button
                          onClick={() => setCardPage(prev => Math.max(0, prev - 1))}
                          isDisabled={cardPage === 0}
                          colorScheme="gray"
                        >
                          ← Előző
                        </Button>

                        <Text color="whiteAlpha.700" fontWeight="bold">
                          {cardPage + 1}. oldal / {Math.ceil(shuffledWords.length / CARDS_PER_PAGE)}.
                        </Text>

                        <Button
                          onClick={() => setCardPage(prev => Math.min(Math.ceil(shuffledWords.length / CARDS_PER_PAGE) - 1, prev + 1))}
                          isDisabled={cardPage >= Math.ceil(shuffledWords.length / CARDS_PER_PAGE) - 1}
                          colorScheme="pink"
                        >
                          Következő →
                        </Button>
                      </Flex>
                    )}
                  </Box>

                )}
                {/* ==========================================
            3. MÓD: PÁROSÍTÓ JÁTÉK (MEMORY GAME)
            ========================================== */}
                {/* ==========================================
    3. MÓD: PÁROSÍTÓ JÁTÉK (STOPPERÓRÁVAL)
    ========================================== */}
                {vocabMode === 'match' && (
                  <Box animation="fadeIn 0.3s" w="100%">

                    <Flex justify="space-between" align="center" mb={6} direction={{ base: "column", md: "row" }} gap={4}>
                      <Box>
                        <Heading size="lg" mb={2}>Szó-Párosító</Heading>
                        <Text color="whiteAlpha.700">
                          Találd meg a magyar szavak angol megfelelőjét a lehető leggyorsabban!
                        </Text>
                      </Box>

                      {/* --- IDŐZÍTŐ ÉS ÚJ JÁTÉK GOMB FLEX --- */}
                      <Flex align="center" gap={4}>
                        <Box
                          bg="blackAlpha.400"
                          px={4}
                          py={2}
                          borderRadius="md"
                          border="1px solid"
                          borderColor="pink.300"
                          boxShadow="0 0 10px rgba(236, 72, 153, 0.2)"
                        >
                          <Text color="pink.200" fontWeight="bold" fontSize="xl" fontFamily="monospace">
                            ⏱️ {formatTime(timer)}
                          </Text>
                        </Box>
                        <Button
                          leftIcon={<span style={{ fontSize: '1.2em' }}>🔄</span>}
                          colorScheme="blue"
                          variant="solid"
                          onClick={startMatchGame}
                        >
                          Új Játék
                        </Button>
                      </Flex>
                    </Flex>

                    {/* GYŐZELMI KÉPERNYŐ */}
                    {gameCards.length > 0 && gameCards.every(c => c.isMatched) ? (
                      <VStack spacing={6} py={10} animation="fadeIn 0.5s">
                        <Text fontSize="7xl">🎉</Text>
                        <Heading color="green.300">Szép munka!</Heading>
                        <Text color="whiteAlpha.800" fontSize="lg">Minden szópárt sikeresen megtaláltál!</Text>

                        {/* Itt mutatjuk meg a végső időt */}
                        <Box bg="whiteAlpha.100" p={4} borderRadius="xl" textAlign="center" border="1px dashed" borderColor="green.300">
                          <Text fontSize="sm" color="whiteAlpha.600">IDŐEREDMÉNYED:</Text>
                          <Text fontSize="3xl" fontWeight="black" color="green.300">
                            {formatTime(timer)}
                          </Text>
                        </Box>

                        <Button size="lg" colorScheme="pink" onClick={startMatchGame}>
                          Jöhet a következő 20 szó!
                        </Button>
                      </VStack>
                    ) : (
                      /* A KÁRTYÁK RÁCSA */
                      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={3} mb={8}>
                        {gameCards.map((card) => {
                          const isSelected = selectedCards.includes(card.id);

                          return (
                            <FlashCard card={card} isSelected={isSelected} onClick={handleGameCardClick} />
                            // <Box
                            //   key={card.id}
                            //   onClick={() => handleGameCardClick(card.id)}
                            //   opacity={card.isMatched ? 0 : 1}
                            //   visibility={card.isMatched ? "hidden" : "visible"}
                            //   transform={isSelected ? "scale(0.95)" : "scale(1)"}
                            //   transition="all 0.2s"
                            //   bg={isSelected ? (card.type === 'en' ? "blue.500" : "pink.500") : "whiteAlpha.200"}
                            //   color={isSelected ? "white" : "whiteAlpha.900"}
                            //   border="2px solid"
                            //   borderColor={isSelected ? "whiteAlpha.500" : "transparent"}
                            //   borderRadius="lg"
                            //   p={4}
                            //   cursor={card.isMatched ? "default" : "pointer"}
                            //   display="flex"
                            //   alignItems="center"
                            //   justifyContent="center"
                            //   textAlign="center"
                            //   minH="80px"
                            //   boxShadow={isSelected ? "inner" : "sm"}
                            //   _hover={!card.isMatched && !isSelected ? { bg: "whiteAlpha.300" } : {}}
                            // >
                            //   <Text fontWeight="bold" fontSize="md" wordBreak="break-word">
                            //     {card.text}
                            //   </Text>
                            // </Box>
                          );
                        })}
                      </SimpleGrid>
                    )}
                  </Box>
                )}
              </>
            )}
          </Box>
        )}
        {/* --- KÖNYVEK --- */}

        {activeTab === 'coursebook' && <BookViewer title="Tankönyv - Unit 1" pages={pages} audios={audios} />}
        {activeTab === 'workbook' && <BookViewer title="Munkafüzet - Unit 1" pages={pages} />}

        {/* --- NYELVTAN (Grammar) --- */}
        {activeTab === 'grammar' && (
          <Flex direction="column" align="center" maxW="800px" mx="auto">
            <Box w="full" bg="#2a144a" borderRadius="2xl" p={10} minH="400px" boxShadow="2xl">
              <Heading size="xl" color="pink.300" mb={4}>{grammarSlides[currentSlide].title}</Heading>
              <Text fontSize="lg" color="whiteAlpha.800" mb={8} fontStyle="italic">{grammarSlides[currentSlide].description}</Text>
              <List spacing={4}>
                {grammarSlides[currentSlide].points.map((point, index) => (
                  <ListItem key={index} fontSize="lg" display="flex" alignItems="center">
                    <ListIcon as={FiCheckCircle} color="green.400" mt={1} /> {point}
                  </ListItem>
                ))}
              </List>
            </Box>
            <HStack mt={8} spacing={6}>
              <IconButton aria-label="Előző" icon={<FiChevronLeft size="24px" />} colorScheme="pink" variant="outline" isDisabled={currentSlide === 0} onClick={() => setCurrentSlide(prev => prev - 1)} borderRadius="full" />
              <HStack spacing={3}>
                {grammarSlides.map((_, index) => (
                  <Circle key={index} size="10px" bg={currentSlide === index ? "pink.400" : "whiteAlpha.300"} />
                ))}
              </HStack>
              <IconButton aria-label="Következő" icon={<FiChevronRight size="24px" />} colorScheme="pink" isDisabled={currentSlide === grammarSlides.length - 1} onClick={() => setCurrentSlide(prev => prev + 1)} borderRadius="full" />
            </HStack>
          </Flex>
        )}

        {/* --- TESZT --- */}
        {activeTab === 'test' && (
          <Box maxW="800px" mx="auto">
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="lg">Teszt: Unit 1 - Hello everybody!</Heading>
              {isTestSubmitted && <Badge colorScheme={score >= (testQuestions.length / 2) ? "green" : "red"} p={2} borderRadius="md" fontSize="md">Eredmény: {score} / {testQuestions.length}</Badge>}
            </Flex>
            <VStack spacing={8} align="stretch">
              {testQuestions.map((q, index) => {
                const userAnswer = (answers[q.id] || "").trim().toLowerCase();
                const correctAnswer = q.correctAnswer.trim().toLowerCase();
                const isCorrect = userAnswer === correctAnswer;
                return (
                  <Box key={q.id} bg="blackAlpha.300" p={6} borderRadius="xl" border="1px solid" borderColor={!isTestSubmitted ? "whiteAlpha.200" : isCorrect ? "green.500" : "red.500"}>
                    <Text fontSize="lg" fontWeight="600" mb={4}>{index + 1}. {q.question}</Text>
                    {q.type === 'radio' ? (
                      <RadioGroup onChange={(val) => handleAnswerChange(q.id, val)} value={answers[q.id] || ""}>
                        <Stack direction="column" spacing={3}>
                          {q.options?.map((option, i) => (
                            <Radio key={i} value={option} colorScheme="pink" isDisabled={isTestSubmitted}>
                              <Text color={!isTestSubmitted ? "white" : option.toLowerCase() === correctAnswer ? "green.300" : answers[q.id] === option ? "red.300" : "whiteAlpha.600"}>{option}</Text>
                            </Radio>
                          ))}
                        </Stack>
                      </RadioGroup>
                    ) : (
                      <Box>
                        <Input placeholder="Ide írd a választ..." value={answers[q.id] || ""} onChange={(e) => handleAnswerChange(q.id, e.target.value)} isDisabled={isTestSubmitted} bg="whiteAlpha.100" border="none" color={!isTestSubmitted ? "white" : isCorrect ? "green.300" : "red.300"} />
                        {isTestSubmitted && !isCorrect && <Text color="green.300" fontSize="sm" mt={3} fontWeight="600">✓ Helyes megoldás: {q.correctAnswer}</Text>}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </VStack>
            <Flex mt={8} justify="flex-end">
              {!isTestSubmitted ? (
                <Button size="lg" colorScheme="pink" onClick={submitTest} isDisabled={Object.keys(answers).length !== testQuestions.length}>Teszt kiértékelése</Button>
              ) : (
                <Button size="lg" variant="outline" colorScheme="pink" onClick={resetTest}>Újrapróbálkozás</Button>
              )}
            </Flex>
          </Box>
        )}

        {/* --- KIEJTÉS / FORDÍTÁS --- */}
        {activeTab.startsWith('pronunciation') && (
          <Box maxW="900px" mx="auto">

            {/* --- ALMENÜ VÁLASZTÓ GOMBOK --- */}
            <Flex justify="center" mb={8}>
              <ButtonGroup size="lg" isAttached variant="outline">
                <Button
                  onClick={() => setPronunciationMode('practice')}
                  colorScheme={pronunciationMode === 'practice' ? 'pink' : 'gray'}
                  variant={pronunciationMode === 'practice' ? 'solid' : 'outline'}
                >
                  📝 Gyakorlás
                </Button>
                <Button
                  onClick={() => setPronunciationMode('exam')}
                  colorScheme={pronunciationMode === 'exam' ? 'pink' : 'gray'}
                  variant={pronunciationMode === 'exam' ? 'solid' : 'outline'}
                >
                  🎯 Kikérdezés (Élő)
                </Button>
              </ButtonGroup>
            </Flex>

            {/* ==========================================
      0. TÖLTÉS ÉS HIBA KEZELÉSE
      ========================================== */}
            {loading && <Text color="whiteAlpha.700" textAlign="center" py={10} fontSize="lg" fontWeight="bold">Mondatok betöltése folyamatban... ⏳</Text>}
            {error && <Text color="red.400" textAlign="center" py={10} fontSize="lg" fontWeight="bold">{error} ❌</Text>}
            {!loading && !error && sentences.length === 0 && (
              <Text color="whiteAlpha.700" textAlign="center" py={10} fontSize="lg">Nincsenek mondatok ehhez a feladathoz.</Text>
            )}

            {!loading && !error && sentences.length > 0 && (
              <>
                {/* ==========================================
          1. ALMENÜ: GYAKORLÁS (A régi, önállóan nyitogatható verzió)
          ========================================== */}
                {pronunciationMode === 'practice' && (
                  <Box animation="fadeIn 0.1s">
                    <Heading size="lg" mb={2}>Önálló Gyakorlás</Heading>
                    <Text color="whiteAlpha.700" mb={6}>
                      Kattints a mondatokra, próbáld meg lefordítani őket, majd ellenőrizd magad és hallgasd meg a kiejtést!
                    </Text>

                    <Accordion allowToggle>
                      {activeSentences.map((sentence, index) => (
                        <AccordionItem
                          key={sentence.id}
                          border="none"
                          bg="blackAlpha.300"
                          mb={3}
                          borderRadius="md"
                        >
                          <AccordionButton py={4}>
                            <Box as="span" flex='1' textAlign='left' fontSize="lg" fontWeight="500" color="white">
                              {/* Itt az index + 1-et használjuk az ID helyett, hogy szép sorrendben legyenek számozva */}
                              {index + 1}. {sentence.huText}
                            </Box>
                            <AccordionIcon color="pink.200" />
                          </AccordionButton>

                          <AccordionPanel pb={4} borderTop="1px solid" borderColor="whiteAlpha.100">
                            <Flex justify="space-between" align="center">
                              <Text color="pink.200" fontSize="xl" fontWeight="600">🇬🇧 {sentence.enText}</Text>
                              <IconButton
                                aria-label="Meghallgatás"
                                icon={<FiVolume2 size="22px" />}
                                variant="ghost"
                                color="pink.200"
                                borderRadius="full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // MP3 lejátszása a szerverről, vagy fallback a böngészős felolvasóra
                                  if (sentence.audioPath) {
                                    new Audio(`http://localhost:8080${sentence.audioPath}`).play();
                                  } else {
                                    speakEnglish(sentence.enText);
                                  }
                                }}
                              />
                            </Flex>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>

                  </Box>
                )}

                {/* ==========================================
          2. ALMENÜ: KIKÉRDEZÉS (A WebSocketes, tanár által irányított verzió)
          ========================================== */}
                {pronunciationMode === 'exam' && (
                  <Box animation="fadeIn 0.3s">

                    {/* Tanár / Diák nézetváltó teszteléshez */}
                    <Flex justify="space-between" align="center" mb={8} p={4} bg="whiteAlpha.100" borderRadius="lg" border="1px dashed" borderColor="pink.300">
                      <Heading size="md" color={isTeacher ? "pink.300" : "blue.300"}>
                        Nézet: {isTeacher ? "👨‍🏫 Tanári Vezérlőpult" : "👨‍🎓 Diák Képernyő"}
                      </Heading>
                      <Button size="sm" colorScheme={isTeacher ? "pink" : "blue"} onClick={() => setIsTeacher(!isTeacher)}>
                        Nézet váltása
                      </Button>
                    </Flex>

                    {isTeacher ? (
                      /* --- TANÁRI VEZÉRLŐPULT --- */
                      <Box>
                        <Text color="whiteAlpha.700" mb={6}>Kattints az 1. gombra a magyar szöveg kiküldéséhez, majd a 2. gombra a megoldás felfedéséhez!</Text>

                        {sentences.map((sentence, index) => {
                          const isActive = syncData.id === sentence.id && syncData.taskId === activeTab;
                          const isHuVisible = isActive && (syncData.step === 'HU' || syncData.step === 'EN');
                          const isEnVisible = isActive && syncData.step === 'EN';
                          const isCompleted = completedSentences.includes(sentence.id);

                          return (
                            <Flex
                              key={sentence.id}
                              bg={isActive ? "whiteAlpha.300" : "blackAlpha.400"}
                              p={4}
                              mb={3}
                              borderRadius="md"
                              align="center"
                              justify="space-between"
                              borderLeft={isActive || isCompleted ? "4px solid" : "none"}
                              borderColor={isActive ? "pink.400" : isCompleted ? "green.400" : "transparent"}
                              transition="all 0.3s"
                            >
                              <Box flex="1">
                                <Flex align="center" gap={2}>
                                  <Text fontSize="lg" fontWeight="bold" color={isCompleted && !isActive ? "whiteAlpha.500" : "white"}>
                                    {index + 1}. {sentence.huText}
                                  </Text>

                                  {isCompleted && (
                                    <Text color="green.400" fontSize="xl" fontWeight="black" textShadow="0 0 5px rgba(72, 187, 120, 0.5)">
                                      ✓
                                    </Text>
                                  )}
                                </Flex>

                                <Text fontSize="md" color="pink.200" opacity={isCompleted && !isActive ? 0.4 : 0.8}>
                                  {sentence.enText}
                                </Text>
                              </Box>

                              <Flex gap={3}>
                                <Button
                                  size="sm"
                                  colorScheme={isHuVisible && !isEnVisible ? "green" : isCompleted && !isActive ? "whiteAlpha" : "gray"}
                                  onClick={() => sendSyncCommand(sentence.id, 'HU')}
                                >
                                  {isCompleted && !isActive ? "Újra: Magyar" : "1. Magyar küldése"}
                                </Button>

                                <Button
                                  size="sm"
                                  colorScheme={isEnVisible ? "green" : isCompleted && !isActive ? "whiteAlpha" : "pink"}
                                  isDisabled={!isHuVisible && !isEnVisible && !isCompleted}
                                  onClick={() => sendSyncCommand(sentence.id, 'EN')}
                                >
                                  2. Angol felfedése
                                </Button>
                              </Flex>
                            </Flex>
                          );
                        })}

                        {/* LEZÁRÓ GOMB A TANÁRNAK */}
                        <Box mt={8} p={6} bg="whiteAlpha.100" borderRadius="lg" textAlign="center" border="1px dashed" borderColor="pink.300">
                          <Heading size="md" mb={2} color="white">Készen vagytok?</Heading>
                          <Text color="whiteAlpha.600" mb={4}>Ha véget ért a kikérdezés, zárd le a feladatot, hogy a diák megkapja a dicséretet!</Text>

                          <Button
                            size="lg"
                            colorScheme="pink"
                            onClick={() => sendSyncCommand(0, 'END')}
                            isDisabled={completedSentences.length < sentences.length}
                          >
                            🎉 Kikérdezés befejezése
                          </Button>

                          {completedSentences.length < sentences.length && (
                            <Text fontSize="sm" color="pink.300" mt={3}>
                              A gomb akkor válik kattinthatóvá, ha az összes mondatot kikérdezted!
                              ({completedSentences.length} / {sentences.length} kész)
                            </Text>
                          )}
                        </Box>
                      </Box>
                    ) : (
                      /* --- DIÁK KÉPERNYŐ --- */
                      <Flex direction="column" align="center" justify="center" minH="40vh" bg="blackAlpha.400" borderRadius="xl" p={8} boxShadow="2xl" position="relative">

                        {syncData.taskId === activeTab && syncData.step !== 'NONE' && (
                          <Flex w="100%" justify="center" wrap="wrap" gap={3} mb={10}>
                            {sentences.map((s, index) => {
                              const isCurrent = syncData.id === s.id;
                              const isCompleted = completedSentences.includes(s.id);

                              let bgColor = "whiteAlpha.200";
                              let color = "whiteAlpha.500";
                              let borderColor = "transparent";

                              if (isCurrent) {
                                bgColor = "pink.500";
                                color = "white";
                                borderColor = "pink.200";
                              } else if (isCompleted) {
                                bgColor = "green.500";
                                color = "white";
                              }

                              return (
                                <Flex key={s.id} w="40px" h="40px" borderRadius="full" bg={bgColor} color={color} align="center" justify="center" fontWeight="bold" border="2px solid" borderColor={borderColor} boxShadow={isCurrent ? "0 0 15px rgba(236, 72, 153, 0.6)" : "none"} transition="all 0.4s">
                                  {isCompleted && !isCurrent ? "✓" : (index + 1)}
                                </Flex>
                              );
                            })}
                          </Flex>
                        )}

                        {syncData.taskId !== activeTab || syncData.step === 'NONE' ? (
                          <VStack spacing={4}>
                            <Text fontSize="2xl" color="whiteAlpha.600">Figyeld a képernyőt!</Text>
                            <Text fontSize="lg" color="whiteAlpha.400">Várakozás a tanár utasítására...</Text>
                          </VStack>
                        ) : syncData.step === 'END' ? (
                          <VStack spacing={6} animation="fadeIn 0.5s ease-in-out">
                            <Text fontSize="7xl">🏆</Text>
                            <Heading size="xl" color="pink.300" textAlign="center">Szép munka volt!</Heading>
                            <Text fontSize="lg" color="whiteAlpha.800" textAlign="center" maxW="400px">
                              Sikeresen a végére értél a mai kikérdezésnek. Nagyon ügyes vagy, csak így tovább!
                            </Text>
                          </VStack>
                        ) : (
                          <VStack spacing={8} w="100%">
                            <Box textAlign="center">
                              <Text fontSize="xl" color="whiteAlpha.600" mb={2}>Fordítsd le hangosan angolra:</Text>
                              <Text fontSize="4xl" fontWeight="bold" color="white">
                                {sentences.find(s => s.id === syncData.id)?.huText}
                              </Text>
                            </Box>

                            {syncData.step === 'EN' && (
                              <Box textAlign="center" p={6} bg="pink.500" borderRadius="lg" w="100%" animation="fadeIn 0.5s ease-in-out">
                                <Text fontSize="sm" color="pink.100" textTransform="uppercase" letterSpacing="widest" mb={1}>Helyes megoldás:</Text>
                                <Text fontSize="3xl" fontWeight="bold" color="white">
                                  {sentences.find(s => s.id === syncData.id)?.enText}
                                </Text>

                                <Button mt={4} colorScheme="whiteAlpha" variant="outline" onClick={() => {
                                  const currentSentence = sentences.find(s => s.id === syncData.id);
                                  if (currentSentence?.audioPath) {
                                    new Audio(`http://localhost:8080${currentSentence.audioPath}`).play();
                                  } else {
                                    speakEnglish(currentSentence?.enText || "");
                                  }
                                }}>
                                  Meghallgatás
                                </Button>
                              </Box>
                            )}
                          </VStack>
                        )}
                      </Flex>
                    )}
                  </Box>
                )}
              </>
            )}
          </Box>
        )}
        {/* --- FOGALMAZÁS --- */}
        
        {activeTab === 'essay' && (
          <EssayEditor {...essayLogic} />
        )}

      </Box>
    </Flex>
  );
};