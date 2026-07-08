import { Box, Flex, Heading, Textarea, Text, Button, Spinner, Tooltip, VStack } from '@chakra-ui/react'
import type {  UseEssayReturn } from '../types';
type EssayEditorProps = UseEssayReturn;
export const EssayEditor = ({
  text,
  setText,
  isEvaluating,
  setIsEvaluating,
  feedback,
  setFeedback,
 
}: EssayEditorProps) => {
  const handleEvaluateEssay = () => {
    if (text.trim().length < 10) return;
    setIsEvaluating(true);
    setTimeout(() => {
      setFeedback([
        { text: "My name is Rafael and I ", status: "ok" },
        { text: "have 30 years", status: "error", correction: "am 30 years old", explanation: "Angolban a 'to be' (létige) használatos az életkor kifejezésére." },
        { text: ". I want to learn English ", status: "ok" },
        { text: "for my job", status: "error", correction: "because of my job", explanation: "Ebben a kontextusban a 'because of' természetesebb a motiváció kifejezésére." },
        { text: ".", status: "ok" }
      ]);
      setIsEvaluating(false);
    }, 2000);
  };
  return (
    <Box maxW="800px" mx="auto">
      <Heading size="lg" mb={2}>Fogalmazás: Bemutatkozás</Heading>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Ide írd..." size="lg" minH="200px" bg="blackAlpha.300" borderColor="whiteAlpha.200" mb={6} isDisabled={isEvaluating || feedback !== null} />
      {!feedback && (
        <Flex justify="flex-end">
          <Button colorScheme="pink" size="lg" onClick={handleEvaluateEssay} isDisabled={text.length < 10 || isEvaluating}>
            {isEvaluating ? <Spinner size="sm" mr={3} /> : null}
            {isEvaluating ? "Az AI dolgozik..." : "Beküldés javításra"}
          </Button>
        </Flex>
      )}
      {feedback && (
        <Box mt={8} p={6} bg="whiteAlpha.100" borderRadius="xl" border="1px solid" borderColor="pink.500">
          <Heading size="md" color="pink.300" mb={4}>Javított verzió</Heading>
          <Box p={5} bg="blackAlpha.400" borderRadius="md" fontSize="lg" lineHeight="tall">
            {feedback.map((chunk, index) => {
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
            <Button variant="outline" colorScheme="pink" onClick={() => { setFeedback(null); setText(""); }}>Új fogalmazás</Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
}


