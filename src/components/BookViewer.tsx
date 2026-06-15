import { useState } from 'react';
import { Flex, Text, Image, Button, VStack, Box, Heading } from '@chakra-ui/react';
import type { BookPageDTO } from '../types';
// import { BookAudioDTO } from '../types'; // Ha külön fájlban van a típusod

interface BookViewerProps {
  title: string;
  pages: BookPageDTO[];
  audios?: any[]; // Ide jön majd a BookAudioDTO[] típus! Opcionális (?), ha esetleg egy könyvhöz egyáltalán nincs hang
}

export const BookViewer = ({ title, pages, audios = [] }: BookViewerProps) => {
  const [currentPage, setCurrentPage] = useState(0);
console.log(audios)
  const nextPage = () => {
    if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  // 1. Kiszűrjük az aktuális oldal hanganyagait. 
  // Fontos: A currentPage 0-tól indul (tömb index), de az adatbázisban az oldalszám 1-től (pageNumber)!
  const activeAudios = audios.filter(audio => audio.pageNumber === currentPage + 1);
  const [playOn, setPlayOn] = useState<boolean>(false)

  return (
    <Flex direction="column" align="center" w="100%">

      {/* --- CÍM --- */}
      <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="center" color="white">
        {title}
      </Text>

      {/* --- ÚJ: KÖZÖS KONTÉNER A KÉPNEK ÉS A HANGOKNAK --- */}
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={8}
        w="100%"
        justify="center"
        align={{ base: 'center', lg: 'flex-start' }}
      >

        {/* --- KÉP KONTÉNER --- */}
        <Box flex="1" display="flex" justifyContent="center" w="100%">
          <Image
            src={pages[currentPage].filePath}
            alt={`${title} - ${currentPage + 1}. oldal`}
            maxH="85vh"
            w="100%"
            maxW="1200px"
            objectFit="contain"
            borderRadius="md"
          />
        </Box>

        {/* --- HANGANYAG OLDALSÁV (Csak akkor jelenik meg, ha van találat!) --- */}
        {activeAudios.length > 0 && (
          <VStack
            w={{ base: "100%", lg: "250px" }}
            align="stretch"
            spacing={3}
            p={5}
            bg="whiteAlpha.100"
            borderRadius="xl"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <Heading size="sm" color="pink.300" mb={3} textAlign="center">
              🎧 Hanganyagok ({currentPage + 1}. oldal)
            </Heading>

            {activeAudios.map(audio =>{ 
            const play=new Audio(`/audio/${audio.fileName}`);
           
            return(<>
              <Button
                key={audio.id}
                leftIcon={<span style={{ fontSize: '1.2em' }}>▶️</span>}
                colorScheme="pink"
                variant="solid"
                justifyContent="flex-start"
                boxShadow="sm"
                onClick={() => {
                  // Mivel a public mappában van, elég egy sima perjel a kezdéshez!
                 play.play();
                }}
              >
                {audio.title}
              </Button>
               <Button
                key={audio.id+100}
                leftIcon={<span style={{ fontSize: '1.2em' }}>▶️</span>}
                colorScheme="pink"
                variant="solid"
                justifyContent="flex-start"
                boxShadow="sm"
                onClick={() => {
                  // Mivel a public mappában van, elég egy sima perjel a kezdéshez!
                play.pause();
                }}
              >
               stop
              </Button></>
            )}
            )}
          </VStack>
        )}

      </Flex>

      {/* --- LAPOZÓ GOMBOK --- */}
      <Flex mt={6} gap={8} align="center">
        <Button
          onClick={prevPage}
          isDisabled={currentPage === 0}
          colorScheme="pink"
          variant="outline"
        >
          Előző oldal
        </Button>

        <Text fontSize="xl" fontWeight="bold" color="white">
          {currentPage + 1} / {pages.length}
        </Text>

        <Button
          onClick={nextPage}
          isDisabled={currentPage === pages.length - 1}
          colorScheme="pink"
          variant="outline"
        >
          Következő oldal
        </Button>
      </Flex>

    </Flex>
  );
};