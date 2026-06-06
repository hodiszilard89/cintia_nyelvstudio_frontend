import { 
  Box, Flex, VStack, Heading, Text, Button, Divider,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  IconButton, HStack, Circle, List, ListItem, ListIcon,
  RadioGroup, Radio, Stack, Badge, Input,
  Textarea, Spinner, Tooltip // 👈 Új importok a fogalmazáshoz
} from '@chakra-ui/react';
import { useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { FiVolume2, FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';

export const UnitPage = () => {
  // Kinyerjük az URL-ből a Unit azonosítóját
  const { id } = useParams(); 
  const navigate = useNavigate();
  // Ez tárolja, hogy épp melyik menüpont van kiválasztva (alapból a nyelvtan)
  const [activeTab, setActiveTab] = useState('grammar');
  // --- ÚJ ADATOK: Teszt kérdések a munkafüzet alapján ---
const testQuestions = [
  {
    id: 1,
    type: 'radio',
    question: "A: Hello. What's your name? \nB: Suzanne. What's ______ name?",
    options: ["my", "your", "his"],
    correctAnswer: "your"
  },
  {
    id: 2,
    type: 'radio',
    question: "Mi a rövidített formája (short form) ennek a mondatnak: 'She is a student.'?",
    options: ["She're a student.", "Shes a student.", "She's a student."],
    correctAnswer: "She's a student."
  },
  {
    id: 3,
    type: 'radio',
    question: "Melyik a helyes névelő? '______ ice-cream'",
    options: ["a", "an", "two"],
    correctAnswer: "an"
  },
  {
    id: 4,
    type: 'input',
    question: "Írd be a hiányzó szót: I ____ from Japan.",
    correctAnswer: "am"
  },
  {
    id: 5,
    type: 'input',
    question: "Írd be a hiányzó létigét: My name ____ Anna.",
    correctAnswer: "is"
  },
  {
    id: 6,
    type: 'input',
    question: "Írd be a hiányzó kérdőszót: ______ are you from?",
    correctAnswer: "Where"
  }
];

// --- TESZT ÁLLAPOTOK ---
 const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (questionId: number, value: string) => {
    if (isTestSubmitted) return; 
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const submitTest = () => {
    let currentScore = 0;
    testQuestions.forEach(q => {
      // Kisbetűsítjük és levágjuk a szóközöket mindkét oldalról az igazságos ellenőrzésért
      const userAnswer = (answers[q.id] || "").trim().toLowerCase();
      const correctAnswer = q.correctAnswer.trim().toLowerCase();
      
      if (userAnswer === correctAnswer) {
        currentScore += 1;
      }
    });
    setScore(currentScore);
    setIsTestSubmitted(true);
  };

  const resetTest = () => {
    setAnswers({});
    setIsTestSubmitted(false);
    setScore(0);
  };
  // Mock adatok a fordítási feladathoz
const translationSentences = [
  { id: 1, hu: "Hol élsz?", en: "Where do you live?" },
  { id: 2, hu: "Szeretsz kávét inni?", en: "Do you like drinking coffee?" },
  { id: 3, hu: "Tegnap moziban voltam a barátaimmal.", en: "I went to the cinema with my friends yesterday." },
  { id: 4, hu: "Már megcsináltam a házi feladatomat.", en: "I have already done my homework." },
  { id: 5, hu: "Mit fogsz csinálni a hétvégén?", en: "What are you going to do at the weekend?" },
  { id: 6, hu: "Soha nem jártam még Londonban.", en: "I have never been to London." },
  { id: 7, hu: "Ha esni fog, otthon maradunk.", en: "If it rains, we will stay at home." },
  { id: 8, hu: "Bárcsak több szabadidőm lenne.", en: "I wish I had more free time." },
  { id: 9, hu: "A könyvet, amit tegnap vettem, nagyon érdekes.", en: "The book that I bought yesterday is very interesting." },
  { id: 10, hu: "Azt mondta, hogy fáradt.", en: "He said that he was tired." },
];
// --- 👈 ÚJ ADATOK: Nyelvtani Diák ---
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
      "Többes szám: A szavak végére egyszerűen egy 's' betű kerül.",
      "Példák többes számra: two stamps, two apples, two dictionaries."
    ]
  }
];

const [essayText, setEssayText] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Ez tárolja a Geminitől kapott strukturált választ
  const [essayFeedback, setEssayFeedback] = useState<Array<{text: string, status: 'ok'|'error', correction?: string, explanation?: string}> | null>(null);

  // Szimulált backend kérés a Gemini felé
  const handleEvaluateEssay = () => {
    if (essayText.trim().length < 10) return;
    
    setIsEvaluating(true);
    
    // Szimuláljuk, hogy a szerver 2 másodperc alatt válaszol
    setTimeout(() => {
      // Ezt a JSON-t fogja visszaadni a Gemini a valóságban a szöveged alapján:
      setEssayFeedback([
        { text: "My name is Rafael and I ", status: "ok" },
        { text: "have 30 years", status: "error", correction: "am 30 years old", explanation: "Angolban a 'to be' (létige) használatos az életkor kifejezésére, nem a 'have' (birtokolni) ige." },
        { text: ". I live in a house in Mexico. I want to learn English ", status: "ok" },
        { text: "for my job", status: "error", correction: "because of my job", explanation: "Ebben a kontextusban a 'because of' természetesebb a motiváció kifejezésére." },
        { text: ".", status: "ok" }
      ]);
      setIsEvaluating(false);
    }, 2000);
  };

  // A bal oldali menü felépítése a te logikád alapján
  const menuItems = [
    { id: 'grammar', label: 'Nyelvtan (Slides)' },
    { id: 'test', label: 'Teszt & Gyakorlatok' },
    { id: 'pronunciation', label: 'Kiejtés' },
    { id: 'essay', label: 'Fogalmazás' }
  ];

  // --- 👈 ÚJ ÁLLAPOT: Melyik nyelvtani dia van épp nyitva? (0, 1, vagy 2) ---
  const [currentSlide, setCurrentSlide] = useState(0);

  const speakEnglish = (text: string) => {
    // Ellenőrizzük, támogatja-e a böngésző
    if ('speechSynthesis' in window) {
      // Ha épp beszél, állítsa le (ne beszéljenek egymásra)
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // Beállítjuk az angol nyelvet
      utterance.rate = 0.9;     // Kicsit lassítjuk a jobb érthetőségért
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sajnos a böngésződ nem támogatja a felolvasást.");
    }
  };

  return (
    <Flex w="full" minH="calc(100vh - 100px)" color="white">
      
      {/* BAL OLDALI MENÜ (Sidebar) */}
      <Box 
        w="280px" 
        bg="blackAlpha.400" 
        p={6} 
        borderRight="1px solid" 
        borderColor="whiteAlpha.300"
      >
        <Button
          variant="link"
          color="whiteAlpha.600"
          fontSize="sm"
          fontWeight="normal"
          _hover={{ color: "pink", textDecoration: "none" }}
          mb={6} // Térköz a gomb és a Unit címe között
          onClick={() => navigate('/home')}
        >
          ← Vissza a kurzusokhoz
        </Button>
        <Heading size="md" mb={6} color="pink">Unit {id}</Heading>
        <Divider borderColor="whiteAlpha.400" mb={6} />
        
        <VStack align="stretch" spacing={3}>
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "solid" : "ghost"}
              bg={activeTab === item.id ? "pink" : "transparent"}
              color={activeTab === item.id ? "white" : "whiteAlpha.800"}
              justifyContent="flex-start" // Balra igazítja a gomb szövegét
              _hover={{ bg: activeTab === item.id ? "pink" : "whiteAlpha.200" }}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </VStack>
      </Box>

      {/* JOBB OLDALI TARTALOM (Main Content) */}
      <Box flex="1" p={10}>
        
        {/* --- 👈 ÚJ: Lapozható Nyelvtani Szekció --- */}
        {activeTab === 'grammar' && (
          <Flex direction="column" align="center" maxW="800px" mx="auto">
            
            {/* A kártya maga */}
            <Box w="full" bg="#2a144a" borderRadius="2xl" p={10} minH="400px" boxShadow="2xl" position="relative">
              <Heading size="xl" color="pink.300" mb={4}>
                {grammarSlides[currentSlide].title}
              </Heading>
              
              <Text fontSize="lg" color="whiteAlpha.800" mb={8} fontStyle="italic">
                {grammarSlides[currentSlide].description}
              </Text>

              <List spacing={4}>
                {grammarSlides[currentSlide].points.map((point, index) => (
                  <ListItem key={index} fontSize="lg" display="flex" alignItems="center">
                    <ListIcon as={FiCheckCircle} color="green.400" mt={1} />
                    {point}
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Lapozó gombok és navigációs pöttyök */}
            <HStack mt={8} spacing={6}>
              <IconButton 
                aria-label="Előző dia" 
                icon={<FiChevronLeft size="24px" />} 
                colorScheme="pink" 
                variant="outline"
                isDisabled={currentSlide === 0} 
                onClick={() => setCurrentSlide(prev => prev - 1)}
                borderRadius="full"
              />
              
              {/* Pöttyök (Dots) */}
              <HStack spacing={3}>
                {grammarSlides.map((_, index) => (
                  <Circle 
                    key={index} 
                    size="10px" 
                    bg={currentSlide === index ? "pink.400" : "whiteAlpha.300"} 
                    transition="all 0.2s"
                  />
                ))}
              </HStack>

              <IconButton 
                aria-label="Következő dia" 
                icon={<FiChevronRight size="24px" />} 
                colorScheme="pink"
                isDisabled={currentSlide === grammarSlides.length - 1} 
                onClick={() => setCurrentSlide(prev => prev + 1)}
                borderRadius="full"
              />
            </HStack>
            
          </Flex>
        )}

        {/* --- ÚJ: Teszt és Gyakorlatok Szekció --- */}
       {/* --- Teszt és Gyakorlatok Szekció --- */}
        {activeTab === 'test' && (
          <Box maxW="800px" mx="auto">
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="lg">Teszt: Unit 1 - Hello everybody!</Heading>
              {isTestSubmitted && (
                <Badge colorScheme={score >= (testQuestions.length / 2) ? "green" : "red"} p={2} borderRadius="md" fontSize="md">
                  Eredmény: {score} / {testQuestions.length}
                </Badge>
              )}
            </Flex>
            
            <Text color="whiteAlpha.700" mb={8}>
              Válaszd ki vagy írd be a helyes megoldást a munkafüzet feladatai alapján!
            </Text>

            <VStack spacing={8} align="stretch">
              {testQuestions.map((q, index) => {
                // Segédváltozók az ellenőrzéshez
                const userAnswer = (answers[q.id] || "").trim().toLowerCase();
                const correctAnswer = q.correctAnswer.trim().toLowerCase();
                const isCorrect = userAnswer === correctAnswer;

                return (
                  <Box 
                    key={q.id} 
                    bg="blackAlpha.300" 
                    p={6} 
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={
                      !isTestSubmitted ? "whiteAlpha.200" :
                      isCorrect ? "green.500" : "red.500"
                    }
                  >
                    <Text fontSize="lg" fontWeight="600" mb={4} whiteSpace="pre-line">
                      {index + 1}. {q.question}
                    </Text>
                    
                    {/* FELADAT TÍPUSÁNAK ELDÖNTÉSE */}
                    {q.type === 'radio' ? (
                      <RadioGroup 
                        onChange={(val) => handleAnswerChange(q.id, val)} 
                        value={answers[q.id] || ""}
                      >
                        <Stack direction="column" spacing={3}>
                          {q.options?.map((option, i) => (
                            <Radio key={i} value={option} colorScheme="pink" isDisabled={isTestSubmitted}>
                              <Text color={
                                !isTestSubmitted ? "white" :
                                option.toLowerCase() === correctAnswer ? "green.300" : 
                                answers[q.id] === option ? "red.300" : "whiteAlpha.600"
                              }>
                                {option}
                              </Text>
                            </Radio>
                          ))}
                        </Stack>
                      </RadioGroup>
                    ) : (
                      <Box>
                        <Input 
                          placeholder="Ide írd a választ..."
                          value={answers[q.id] || ""}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          isDisabled={isTestSubmitted}
                          bg="whiteAlpha.100"
                          border="none"
                          focusBorderColor="pink.400"
                          color={!isTestSubmitted ? "white" : isCorrect ? "green.300" : "red.300"}
                          fontWeight={isTestSubmitted ? "bold" : "normal"}
                        />
                        {/* Ha hibázott a beírósnál, kiírjuk neki a helyes megfejtést */}
                        {isTestSubmitted && !isCorrect && (
                          <Text color="green.300" fontSize="sm" mt={3} fontWeight="600">
                            ✓ Helyes megoldás: {q.correctAnswer}
                          </Text>
                        )}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </VStack>

            <Flex mt={8} justify="flex-end">
              {!isTestSubmitted ? (
                <Button 
                  size="lg" 
                  colorScheme="pink" 
                  onClick={submitTest}
                  isDisabled={Object.keys(answers).length !== testQuestions.length}
                >
                  Teszt kiértékelése
                </Button>
              ) : (
                <Button size="lg" variant="outline" colorScheme="pink" onClick={resetTest}>
                  Újrapróbálkozás
                </Button>
              )}
            </Flex>
          </Box>
        )}
       {activeTab === 'pronunciation' && (
          <Box maxW="800px" mx="auto">
            <Heading size="lg" mb={2}>Fordítás és Kiejtés</Heading>
            <Text color="whiteAlpha.700" mb={8}>
              Olvasd el a magyar mondatot, próbáld meg lefordítani angolra (és hangosan kimondani), 
              majd kattints a sávra a helyes megoldásért!
            </Text>

            {/* allowMultiple: Engedi, hogy egyszerre több is nyitva legyen */}
            <Accordion allowMultiple>
              {translationSentences.map((sentence) => (
                <AccordionItem 
                  key={sentence.id} 
                  border="none" 
                  bg="blackAlpha.300" 
                  mb={3} 
                  borderRadius="md"
                >
                  <AccordionButton 
                    _hover={{ bg: "whiteAlpha.100" }} 
                    borderRadius="md" 
                    py={4}
                  >
                    <Box as="span" flex='1' textAlign='left' fontSize="lg" fontWeight="500">
                      {sentence.id}. {sentence.hu}
                    </Box>
                    <AccordionIcon color="pink" />
                  </AccordionButton>
                  
                 <AccordionPanel pb={4} borderTop="1px solid" borderColor="whiteAlpha.100">
                    <Flex justify="space-between" align="center">
                      <Text color="pink.200" fontSize="xl" fontWeight="600">
                        🇬🇧 {sentence.en}
                      </Text>
                      
                      {/* Hangszóró ikon gomb */}
                      <IconButton
                        aria-label="Kiejtés meghallgatása"
                        icon={<FiVolume2 size="22px" />}
                        variant="ghost"
                        color="pink.200"
                        borderRadius="full"
                        _hover={{ bg: "whiteAlpha.200", color: "white" }}
                        _active={{ bg: "whiteAlpha.300" }}
                        // Eseménykezelő: ne nyissa ki/csukja be az accordiont, csak olvassa fel
                        onClick={(e) => {
                          e.stopPropagation(); // Fontos, hogy ne triggerelje az AccordionButtont
                          speakEnglish(sentence.en);
                        }}
                      />
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        )}

        {/* --- FOGALMAZÁS SZEKCIÓ --- */}
        {activeTab === 'essay' && (
          <Box maxW="800px" mx="auto">
            <Heading size="lg" mb={2}>Fogalmazás: Bemutatkozás</Heading>
            <Text color="whiteAlpha.700" mb={8}>
              Írj egy rövid bemutatkozást a munkafüzet alapján (név, kor, származás, foglalkozás). 
              A beküldés után az AI azonnal kiértékeli a szövegedet!
            </Text>

            {/* Szövegbeviteli mező */}
            <Textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Ide írd az angol nyelvű fogalmazásodat (pl. My name is Rafael...)"
              size="lg"
              minH="200px"
              bg="blackAlpha.300"
              border="1px solid"
              borderColor="whiteAlpha.200"
              color="white"
              focusBorderColor="pink.400"
              mb={6}
              isDisabled={isEvaluating || essayFeedback !== null}
            />

            {/* Kiértékelés gomb */}
            {!essayFeedback && (
              <Flex justify="flex-end">
                <Button 
                  colorScheme="pink" 
                  size="lg" 
                  onClick={handleEvaluateEssay}
                  isDisabled={essayText.length < 10 || isEvaluating}
                >
                  {isEvaluating ? <Spinner size="sm" mr={3} /> : null}
                  {isEvaluating ? "Az AI dolgozik..." : "Beküldés javításra"}
                </Button>
              </Flex>
            )}

            {/* --- AI KIÉRTÉKELÉS EREDMÉNYE --- */}
            {essayFeedback && (
              <Box mt={8} p={6} bg="whiteAlpha.100" borderRadius="xl" border="1px solid" borderColor="pink.500">
                <Heading size="md" color="pink.300" mb={4}>Javított verzió és visszajelzés</Heading>
                <Text color="whiteAlpha.700" mb={6} fontSize="sm">
                  Vidd az egeret a <Text as="span" color="red.300" textDecoration="underline" textDecorationStyle="wavy">pirossal aláhúzott</Text> részek fölé a magyarázatért!
                </Text>

                <Box p={5} bg="blackAlpha.400" borderRadius="md" fontSize="lg" lineHeight="tall">
                  {essayFeedback.map((chunk, index) => {
                    if (chunk.status === 'error') {
                      return (
                        <Tooltip 
                          key={index} 
                          label={
                            <VStack align="start" spacing={1} p={2}>
                              <Text fontWeight="bold" color="green.300">Javítás: {chunk.correction}</Text>
                              <Text fontSize="sm">{chunk.explanation}</Text>
                            </VStack>
                          } 
                          bg="gray.800" 
                          placement="top" 
                          hasArrow
                        >
                          {/* A hibás rész aláhúzva jelenik meg */}
                          <Text 
                            as="span" 
                            color="red.300" 
                            fontWeight="600"
                            textDecoration="underline" 
                            textDecorationColor="red.500" 
                            textDecorationStyle="wavy" // Hullámos aláhúzás
                            cursor="help"
                          >
                            {chunk.text}
                          </Text>
                        </Tooltip>
                      );
                    }
                    // A helyes részek simán jelennek meg
                    return <Text as="span" key={index} color="white">{chunk.text}</Text>;
                  })}
                </Box>

                <Flex justify="flex-end" mt={6}>
                  <Button 
                    variant="outline" 
                    colorScheme="pink" 
                    onClick={() => {
                      setEssayFeedback(null);
                      setEssayText(""); // Töröljük a mezőt egy új próbálkozáshoz
                    }}
                  >
                    Új fogalmazás írása
                  </Button>
                </Flex>
              </Box>
            )}
          </Box>
        )}

      </Box>
    </Flex>
  );
};