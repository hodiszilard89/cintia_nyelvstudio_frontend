import { useState } from 'react';
import { Button, Flex, Image, Text } from '@chakra-ui/react';

interface BookViewerProps {
  title: string;
  pages: string[];
}

export const BookViewer = ({ title, pages }: BookViewerProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    // Csak egy egyszerű tartóoszlop, HÁTTÉRSZÍN ÉS KERET NÉLKÜL
    <Flex direction="column" align="center" w="100%">

      {/* --- CÍM --- */}
      <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="center" color="white">
        {title}
      </Text>

      {/* --- KÉP --- (Közvetlenül a címsor alatt van, nincs mögötte sötét sáv) */}
      <Image
        src={pages[currentPage]}
        alt={`${title} - ${currentPage + 1}. oldal`}
         maxH="85vh"      // 👈 A képernyő magasságának 85%-áig nőhet
          w="100%"         // 👈 Széltében is kitöltheti a rendelkezésre álló helyet
          maxW="1200px"    // 👈 Maximum 1200px széles lehet (hogy brutál nagy monitoron se essen szét)
          objectFit="contain" // 👈 Megtartja a kép arányait, nem torzítja el
        
        borderRadius="md"
        
      />

      {/* --- LAPOZÓ GOMBOK --- */}
      <Flex mt={6} gap={8} align="center">
        <Button
          onClick={prevPage}
          isDisabled={currentPage === 0}
          colorScheme="pink"
          variant="solid"
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
          variant="solid"
        >
          Következő oldal
        </Button>
      </Flex>

    </Flex>
  );
};