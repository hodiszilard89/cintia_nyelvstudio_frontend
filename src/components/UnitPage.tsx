import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect } from 'react';
import { useSentences } from '../hooks/useSentencies';
import {
  Box, Flex, VStack, Heading, Text, Button, Divider,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  IconButton, HStack, Circle, List, ListItem, ListIcon,
  RadioGroup, Radio, Stack, Badge, Input,
  Textarea, Spinner, Tooltip, ButtonGroup
} from '@chakra-ui/react';
import { BookViewer } from './BookViewer';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiVolume2, FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';

export const UnitPage = () => {
  // --- 1. KÖZÖS ÁLLAPOTOK (Memória) ---
  const [activeTab, setActiveTab] = useState('grammar'); // Alapértelmezett fül: Nyelvtan
  const [currentSlide, setCurrentSlide] = useState(0);

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
  const [activeSentenceId, setActiveSentenceId] = useState<number | null>(null);
  // Tárolja magát a kapcsolatot, hogy később tudjunk rajta üzenni
// --- OKOS FUNKCIÓK ---
  

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


  //---- tanár gomb



  // --- ÚJ: A függvény, amivel a tanár átküldi az új mondatot ---
  const sendSentenceChange = (sentenceId: number) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/app/change-sentence',
        body: sentenceId.toString(),
      });
    }
  };

  //----Websocket vége
  const { id } = useParams();
  const navigate = useNavigate();

  
  // Teszt állapotok
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Fogalmazás állapotok
  const [essayText, setEssayText] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [essayFeedback, setEssayFeedback] = useState<Array<{ text: string, status: 'ok' | 'error', correction?: string, explanation?: string }> | null>(null);

  // --- 2. ADATOK (Mock Data) ---
  const coursebookPages = ['/book/cbook/unit1/oldal1.PNG',
    '/book/cbook/unit1/oldal2.PNG',
    '/book/cbook/unit1/oldal3.PNG',
    '/book/cbook/unit1/oldal4.PNG',
    '/book/cbook/unit1/oldal5.PNG',
    '/book/cbook/unit1/oldal6.PNG'];
  const workbookPages = ['/book/wbook/unit1/wb1.PNG',
    '/book/wbook/unit1/wb2.PNG',
    '/book/wbook/unit1/wb3.PNG',
    '/book/wbook/unit1/wb4.PNG',
    '/book/wbook/unit1/wb5.PNG'];

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

  const translationSentences = [
    { id: 1, hu: "Hol élsz?", en: "Where do you live?" },
    { id: 2, hu: "Szeretsz kávét inni?", en: "Do you like drinking coffee?" },
    { id: 3, hu: "Már megcsináltam a házi feladatomat.", en: "I have already done my homework." },
    { id: 4, hu: "Mit fogsz csinálni a hétvégén?", en: "What are you going to do at the weekend?" }
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

  const handleEvaluateEssay = () => {
    if (essayText.trim().length < 10) return;
    setIsEvaluating(true);
    setTimeout(() => {
      setEssayFeedback([
        { text: "My name is Rafael and I ", status: "ok" },
        { text: "have 30 years", status: "error", correction: "am 30 years old", explanation: "Angolban a 'to be' (létige) használatos az életkor kifejezésére." },
        { text: ". I want to learn English ", status: "ok" },
        { text: "for my job", status: "error", correction: "because of my job", explanation: "Ebben a kontextusban a 'because of' természetesebb a motiváció kifejezésére." },
        { text: ".", status: "ok" }
      ]);
      setIsEvaluating(false);
    }, 2000);
  };

  const speakEnglish = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sajnos a böngésződ nem támogatja a felolvasást.");
    }
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
  const { sentences, loading, error } = useSentences(lessonId, taskNumber); // A taskNumber attól függ, épp melyik fülön van
  // --- 4. MEGJELENÍTÉS (UI) ---
  return (
    <Flex w="full" minH="calc(100vh - 100px)" color="white">

      {/* --- BAL OLDALI MENÜ SÁV --- */}
      <Box w="280px" bg="blackAlpha.400" p={6} borderRight="1px solid" borderColor="whiteAlpha.300">
        <Button variant="link" color="whiteAlpha.600" fontSize="sm" fontWeight="normal" _hover={{ color: "pink", textDecoration: "none" }} mb={6} onClick={() => navigate('/home')}>
          ← Vissza a kurzusokhoz
        </Button>
        <Heading size="md" mb={6} color="pink">Unit {id}</Heading>
        <Divider borderColor="whiteAlpha.400" mb={6} />

        <VStack align="stretch" spacing={3}>

          {/* 1. Nyelvtan Gomb */}
          <Button
            variant={activeTab === 'grammar' ? "solid" : "ghost"}
            bg={activeTab === 'grammar' ? "pink" : "transparent"}
            color={activeTab === 'grammar' ? "white" : "whiteAlpha.800"}
            justifyContent="flex-start"
            _hover={{ bg: activeTab === 'grammar' ? "pink" : "whiteAlpha.200" }}
            onClick={() => setActiveTab('grammar')}
          >
            Nyelvtan (Slides)
          </Button>

          {/* 2. Könyvek Lenyíló Menü (ACCORDION) */}
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
                  <Button
                    size="sm"
                    variant={activeTab === 'coursebook' ? "solid" : "ghost"}
                    bg={activeTab === 'coursebook' ? "pink" : "transparent"}
                    color={activeTab === 'coursebook' ? "white" : "whiteAlpha.800"}
                    justifyContent="flex-start"
                    _hover={{ bg: activeTab === 'coursebook' ? "pink" : "whiteAlpha.200" }}
                    onClick={() => setActiveTab('coursebook')}
                  >
                    📖 Tankönyv
                  </Button>
                  <Button
                    size="sm"
                    variant={activeTab === 'workbook' ? "solid" : "ghost"}
                    bg={activeTab === 'workbook' ? "pink" : "transparent"}
                    color={activeTab === 'workbook' ? "white" : "whiteAlpha.800"}
                    justifyContent="flex-start"
                    _hover={{ bg: activeTab === 'workbook' ? "pink" : "whiteAlpha.200" }}
                    onClick={() => setActiveTab('workbook')}
                  >
                    📝 Munkafüzet
                  </Button>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

         {/* 3. A többi menüpont dinamikusan (Tesztek, Kiejtés 1-4, Fogalmazás) */}
          {[
            { id: 'test', label: 'Teszt & Gyakorlatok' },
            { id: 'pronunciation1', label: 'Kiejtés 1' },
            { id: 'pronunciation2', label: 'Kiejtés 2' },
            { id: 'pronunciation3', label: 'Kiejtés 3' },
            { id: 'pronunciation4', label: 'Kiejtés 4' },
            { id: 'essay', label: 'Fogalmazás' }
          ].map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "solid" : "ghost"}
              bg={activeTab === item.id ? "pink" : "transparent"}
              color={activeTab === item.id ? "white" : "whiteAlpha.800"}
              justifyContent="flex-start"
              _hover={{ bg: activeTab === item.id ? "pink" : "whiteAlpha.200" }}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
              
              {/* ---> ÚJ: Ha az adott menüpont ID-ja benne van a kész listában, kirajzoljuk a zöld pipát! <--- */}
              {completedTasks.includes(item.id) && (
                <Text as="span" color="green.400" ml={2} fontSize="xl" fontWeight="bold">
                  ✓
                </Text>
              )}
            </Button>
          ))}

        </VStack>
      </Box>

      {/* --- JOBB OLDALI TARTALMI RÉSZ --- */}
      <Box flex="1" p={8} overflowY="auto" mx={'auto'} w='auto'>

        {/* --- KÖNYVEK --- */}
        {activeTab === 'coursebook' && <BookViewer title="Tankönyv - Unit 1" pages={coursebookPages} />}
        {activeTab === 'workbook' && <BookViewer title="Munkafüzet - Unit 1" pages={workbookPages} />}

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
                1. ALMENÜ: GYAKORLÁS (A régi, önállóan nyitogatható verzió)
                ========================================== */}
            {pronunciationMode === 'practice' && (
              <Box animation="fadeIn 0.3s">
                <Heading size="lg" mb={2}>Önálló Gyakorlás</Heading>
                <Text color="whiteAlpha.700" mb={6}>
                  Kattints a mondatokra, próbáld meg lefordítani őket, majd ellenőrizd magad és hallgasd meg a kiejtést!
                </Text>

                <Accordion allowToggle>
                  {translationSentences.map((sentence) => (
                    <AccordionItem
                      key={sentence.id}
                      border="none"
                      bg="blackAlpha.300"
                      mb={3}
                      borderRadius="md"
                    >
                      <AccordionButton py={4}>
                        <Box as="span" flex='1' textAlign='left' fontSize="lg" fontWeight="500" color="white">
                          {sentence.id}. {sentence.hu}
                        </Box>
                        <AccordionIcon color="pink.200" />
                      </AccordionButton>

                      <AccordionPanel pb={4} borderTop="1px solid" borderColor="whiteAlpha.100">
                        <Flex justify="space-between" align="center">
                          <Text color="pink.200" fontSize="xl" fontWeight="600">🇬🇧 {sentence.en}</Text>
                          <IconButton
                            aria-label="Meghallgatás"
                            icon={<FiVolume2 size="22px" />}
                            variant="ghost"
                            color="pink.200"
                            borderRadius="full"
                            onClick={(e) => { e.stopPropagation(); speakEnglish(sentence.en); }}
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

                    {translationSentences.map((sentence) => {
                      const isActive = syncData.id === sentence.id && syncData.taskId === activeTab;
                      const isHuVisible = isActive && (syncData.step === 'HU' || syncData.step === 'EN');
                      const isEnVisible = isActive && syncData.step === 'EN';

                      // ---> ÚJ: Megnézzük, hogy ez a mondat szerepel-e már a kész listában <---
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
                          // Ha aktív, rózsaszín a széle. Ha már kész van (de nem aktív), akkor zöld!
                          borderLeft={isActive || isCompleted ? "4px solid" : "none"}
                          borderColor={isActive ? "pink.400" : isCompleted ? "green.400" : "transparent"}
                          transition="all 0.3s"
                        >
                          <Box flex="1">
                            <Flex align="center" gap={2}>
                              {/* Ha már kész van és épp nem ezt csinálják, kicsit elhalványítjuk a szöveget */}
                              <Text fontSize="lg" fontWeight="bold" color={isCompleted && !isActive ? "whiteAlpha.500" : "white"}>
                                {sentence.id}. {sentence.hu}
                              </Text>

                              {/* ---> ÚJ: A Zöld Pipa <--- */}
                              {isCompleted && (
                                <Text color="green.400" fontSize="xl" fontWeight="black" textShadow="0 0 5px rgba(72, 187, 120, 0.5)">
                                  ✓
                                </Text>
                              )}
                            </Flex>

                            <Text fontSize="md" color="pink.200" opacity={isCompleted && !isActive ? 0.4 : 0.8}>
                              {sentence.en}
                            </Text>
                          </Box>

                          <Flex gap={3}>
                            <Button
                              size="sm"
                              // Ha már kész van, a gombokat is halványabbra/szürkébbre vesszük, hogy ne zavarjanak
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
                    {/* ---> ÚJ: LEZÁRÓ GOMB A TANÁRNAK (OKOSÍTVA) <--- */}
                    <Box mt={8} p={6} bg="whiteAlpha.100" borderRadius="lg" textAlign="center" border="1px dashed" borderColor="pink.300">
                      <Heading size="md" mb={2} color="white">Készen vagytok?</Heading>
                      <Text color="whiteAlpha.600" mb={4}>Ha véget ért a kikérdezés, zárd le a feladatot, hogy a diák megkapja a dicséretet!</Text>

                      <Button
                        size="lg"
                        colorScheme="pink"
                        onClick={() => sendSyncCommand(0, 'END')}
                        // Itt a varázslat: Letiltjuk a gombot, ha még nem végeztek minddel!
                        isDisabled={completedSentences.length < translationSentences.length}
                      >
                        🎉 Kikérdezés befejezése
                      </Button>

                      {/* Ha még nincs kész minden, kiírjuk pirossal, hogy miért nem tud kattintani */}
                      {completedSentences.length < translationSentences.length && (
                        <Text fontSize="sm" color="pink.300" mt={3}>
                          A gomb akkor válik kattinthatóvá, ha az összes mondatot kikérdezted!
                          ({completedSentences.length} / {translationSentences.length} kész)
                        </Text>
                      )}
                    </Box>
                  </Box>
                ) : (
                  /* --- DIÁK KÉPERNYŐ --- */
                 /* --- DIÁK KÉPERNYŐ --- */
                  <Flex direction="column" align="center" justify="center" minH="40vh" bg="blackAlpha.400" borderRadius="xl" p={8} boxShadow="2xl" position="relative">
                    
                    {/* ---> ÚJ: Csak akkor mutatjuk a buborékokat, ha az adatok a JELENLEGI fülhöz tartoznak <--- */}
                    {syncData.taskId === activeTab && syncData.step !== 'NONE' && (
                      <Flex w="100%" justify="center" wrap="wrap" gap={3} mb={10}>
                        {translationSentences.map((s, index) => {
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

                    {/* --- MAGA A FELADAT --- */}
                    
                    {/* ---> ÚJ: Várakozunk, ha nincs adat, VAGY ha az adat egy másik (régi) fülről maradt itt! <--- */}
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
                            {translationSentences.find(s => s.id === syncData.id)?.hu}
                          </Text>
                        </Box>

                        {syncData.step === 'EN' && (
                          <Box textAlign="center" p={6} bg="pink.500" borderRadius="lg" w="100%" animation="fadeIn 0.5s ease-in-out">
                            <Text fontSize="sm" color="pink.100" textTransform="uppercase" letterSpacing="widest" mb={1}>Helyes megoldás:</Text>
                            <Text fontSize="3xl" fontWeight="bold" color="white">
                              {translationSentences.find(s => s.id === syncData.id)?.en}
                            </Text>
                            
                            {/* A meghallgatás gomb is biztonságosan hívja a kiejtést */}
                            <Button mt={4} colorScheme="whiteAlpha" variant="outline" onClick={() => speakEnglish(translationSentences.find(s => s.id === syncData.id)?.en || "")}>
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
          </Box>
        )}
        {/* --- FOGALMAZÁS --- */}
        {activeTab === 'essay' && (
          <Box maxW="800px" mx="auto">
            <Heading size="lg" mb={2}>Fogalmazás: Bemutatkozás</Heading>
            <Textarea value={essayText} onChange={(e) => setEssayText(e.target.value)} placeholder="Ide írd..." size="lg" minH="200px" bg="blackAlpha.300" borderColor="whiteAlpha.200" mb={6} isDisabled={isEvaluating || essayFeedback !== null} />
            {!essayFeedback && (
              <Flex justify="flex-end">
                <Button colorScheme="pink" size="lg" onClick={handleEvaluateEssay} isDisabled={essayText.length < 10 || isEvaluating}>
                  {isEvaluating ? <Spinner size="sm" mr={3} /> : null}
                  {isEvaluating ? "Az AI dolgozik..." : "Beküldés javításra"}
                </Button>
              </Flex>
            )}
            {essayFeedback && (
              <Box mt={8} p={6} bg="whiteAlpha.100" borderRadius="xl" border="1px solid" borderColor="pink.500">
                <Heading size="md" color="pink.300" mb={4}>Javított verzió</Heading>
                <Box p={5} bg="blackAlpha.400" borderRadius="md" fontSize="lg" lineHeight="tall">
                  {essayFeedback.map((chunk, index) => {
                    if (chunk.status === 'error') {
                      return (
                        <Tooltip key={index} label={<VStack align="start" spacing={1} p={2}><Text fontWeight="bold" color="green.300">Javítás: {chunk.correction}</Text><Text fontSize="sm">{chunk.explanation}</Text></VStack>} bg="gray.800" placement="top" hasArrow>
                          <Text as="span" color="red.300" fontWeight="600" textDecoration="underline" textDecorationStyle="wavy" cursor="help">{chunk.text}</Text>
                        </Tooltip>
                      );
                    }
                    return <Text as="span" key={index} color="white">{chunk.text}</Text>;
                  })}
                </Box>
                <Flex justify="flex-end" mt={6}>
                  <Button variant="outline" colorScheme="pink" onClick={() => { setEssayFeedback(null); setEssayText(""); }}>Új fogalmazás</Button>
                </Flex>
              </Box>
            )}
          </Box>
        )}

      </Box>
    </Flex>
  );
};