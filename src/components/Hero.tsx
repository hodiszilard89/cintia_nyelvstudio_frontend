import { Flex, VStack, Heading, Text, Button, HStack } from '@chakra-ui/react';

export const Hero = () => {
  return (
    <Flex 
      w="full" 
      h="calc(100vh - 100px)" 
      align="center" 
      justify="center"
      px={3}
    >
      <VStack spacing={8} textAlign="center" maxW="3xl">
        
        {/* Fő címsor */}
        <Heading as="h1" size="3xl" fontWeight="extrabold" lineHeight="shorter">
          Beszélj idegen nyelveken magabiztosan!
        </Heading>
        
        {/* Alcím / Leírás */}
        <Text fontSize="xl" opacity={0.8}>
          Nyiss kaput a világra beszédközpontú nyelvóráinkkal. Tanulj új nyelveket rugalmas beosztásban, motiváló környezetben, tapasztalt tanárok segítségével.
        </Text>
        
        {/* Gombok */}
        <HStack spacing={6} pt={4}>
          <Button 
             size="lg" 
            variant="outline" 
            borderColor="white"  
            color="white" 
            borderRadius="full" 
            px={8}
            _hover={{ bg: 'white', color: 'purple.900' }}
          >
            Kurzusaink
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            borderColor="white" 
            color="white" 
            borderRadius="full" 
            px={8}
            _hover={{ bg: 'white', color: 'purple.900' }}
          >
            Ingyenes szintfelmérő
          </Button>
        </HStack>

      </VStack>
    </Flex>
  );
};