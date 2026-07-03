import { Box, Text, IconButton } from "@chakra-ui/react";
import { FiVolume2} from 'react-icons/fi';
export const FlipCard = ({
  word,
  speakEnglish,
  isFlipped,
  onFlip
}: {
  word: any,
  speakEnglish: (text: string) => void,
  isFlipped: boolean,
  onFlip: () => void
}) => {
  return (
    <Box
      w="100%"
      h="140px"
      style={{ perspective: '1000px' }}
      cursor="pointer"
      onClick={onFlip} // Itt hívjuk meg a szülő által átadott függvényt
    >
      <Box
        w="100%"
        h="100%"
        position="relative"
        transition="transform 0.6s"
        style={{ transformStyle: 'preserve-3d' }}
        transform={isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}
      >
        {/* KÁRTYA ELŐLAPJA (MAGYAR SZÓ) */}
        <Box
          position="absolute"
          w="100%"
          h="100%"
          style={{ backfaceVisibility: 'hidden' }}
          bg="blackAlpha.400"
          borderRadius="xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="md"
          border="2px solid"
          borderColor="whiteAlpha.200"
          p={4}
        >
          <Text fontSize="xl" fontWeight="bold" color="white" textAlign="center">
            {word.huTranslation}
          </Text>
        </Box>

        {/* KÁRTYA HÁTLAPJA (ANGOL SZÓ + HANG) */}
        <Box
          position="absolute"
          w="100%"
          h="100%"
          style={{ backfaceVisibility: 'hidden' }}
          transform="rotateY(180deg)"
          bg="pink.500"
          borderRadius="xl"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          boxShadow="md"
          p={4}
        >
          <Text fontSize="2xl" fontWeight="bold" color="white" textAlign="center" lineHeight="tight">
            {word.enWord}
          </Text>
          {word.phonetic && (
            <Text fontSize="sm" color="pink.100" fontStyle="italic" mt={1}>
              {word.phonetic}
            </Text>
          )}

          <IconButton
            mt={3}
            aria-label="Hang"
            icon={<FiVolume2 />}
            size="sm"
            colorScheme="whiteAlpha"
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
        </Box>
      </Box>
    </Box>
  );
};