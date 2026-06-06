import { 
  Box, Flex, Avatar, Heading, Text, SimpleGrid, 
  Progress, VStack, HStack, Card, CardBody, Icon, Divider 
} from '@chakra-ui/react';
import { 
  FiAward, FiBookOpen, FiClock, FiCheckCircle, 
  FiStar, FiZap, FiTarget, FiMic, FiEdit3 
} from 'react-icons/fi';

// --- MOCK ADATOK: Diák statisztikái ---
const mockStudentStats = {
  name: "Kovács János",
  email: "kovacs.janos@gmail.com",
  picture: "https://bit.ly/dan-abramov", 
  level: "Kezdő (A1)",
  totalXP: 2450,
  completedUnits: 3,
  totalUnits: 14,
  hoursSpent: 12.5,
  averageTestScore: 85 
};

// --- MOCK ADATOK: Jelvények (Badges) ---
const mockBadges = [
  { id: 1, title: 'Jégtörő', description: 'Befejezted a legelső modulodat.', icon: FiAward, isUnlocked: true, color: 'blue.400' },
  { id: 2, title: 'Tökéletes Teszt', description: '100%-os eredményt értél el egy teszten.', icon: FiStar, isUnlocked: true, color: 'yellow.400' },
  { id: 3, title: 'Szorgalmas', description: 'Több mint 10 órát töltöttél tanulással.', icon: FiZap, isUnlocked: true, color: 'orange.400' },
  { id: 4, title: 'Szónok', description: 'Gyakoroltad a kiejtést legalább 50 mondatnál.', icon: FiMic, isUnlocked: false, color: 'pink.400' },
  { id: 5, title: 'Nyelvmester', description: 'Sikeresen elvégezted mind a 14 modult.', icon: FiTarget, isUnlocked: false, color: 'green.400' },
  { id: 6, title: 'Shakespeare', description: 'Hibátlan fogalmazást írtál az AI értékelése alapján.', icon: FiEdit3, isUnlocked: false, color: 'purple.400' },
];

export const Profile = () => {
  const progressPercent = (mockStudentStats.completedUnits / mockStudentStats.totalUnits) * 100;

  return (
    <Box w="full" maxW="1000px" mx="auto" py={12} px={6} color="white">
      
      {/* 1. FEJLÉC: Felhasználói alapinfók (A korábbi kódod) */}
      <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" bg="blackAlpha.400" p={8} borderRadius="2xl" mb={8} border="1px solid" borderColor="whiteAlpha.100">
        <HStack spacing={6} direction={{ base: 'column', md: 'row' }} align="center">
          <Avatar size="2xl" name={mockStudentStats.name} src={mockStudentStats.picture} border="4px solid" borderColor="pink.400" />
          <VStack align={{ base: 'center', md: 'flex-start' }} spacing={1}>
            <Heading size="xl">{mockStudentStats.name}</Heading>
            <Text color="whiteAlpha.700" fontSize="lg">{mockStudentStats.email}</Text>
            <Text color="pink.300" fontWeight="bold" fontSize="md">{mockStudentStats.level} szint</Text>
          </VStack>
        </HStack>

        <VStack mt={{ base: 6, md: 0 }} bg="whiteAlpha.100" p={4} borderRadius="xl" align="center" minW="150px">
          <Icon as={FiAward} color="yellow.400" boxSize={8} />
          <Text fontSize="sm" color="whiteAlpha.600" textTransform="uppercase" fontWeight="bold">Összes pont</Text>
          <Text fontSize="2xl" fontWeight="bold" color="pink.300">{mockStudentStats.totalXP} XP</Text>
        </VStack>
      </Flex>

      {/* 2. HALADÁSI SÁV */}
      <Card bg="blackAlpha.300" border="1px solid" borderColor="whiteAlpha.100" borderRadius="2xl" mb={8}>
        <CardBody p={6}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="600" fontSize="lg" color="white">Teljes haladás a kurzusban</Text>
            <Text color="pink.300" fontWeight="bold">{mockStudentStats.completedUnits} / {mockStudentStats.totalUnits} Unit kész</Text>
          </Flex>
          <Progress value={progressPercent} colorScheme="pink" borderRadius="full" size="lg" bg="whiteAlpha.200" />
        </CardBody>
      </Card>

      {/* 3. STATISZTIKAI RÁCS */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} mb={12}>
        <Card bg="whiteAlpha.100" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
          <CardBody display="flex" alignItems="center" gap={4}>
            <Flex bg="blue.500" p={3} borderRadius="lg"><Icon as={FiClock} boxSize={6} color="white" /></Flex>
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" color="whiteAlpha.600">Tanulási idő</Text>
              <Text fontSize="xl" fontWeight="bold" color="white">{mockStudentStats.hoursSpent} óra</Text>
            </VStack>
          </CardBody>
        </Card>

        <Card bg="whiteAlpha.100" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
          <CardBody display="flex" alignItems="center" gap={4}>
            <Flex bg="green.500" p={3} borderRadius="lg"><Icon as={FiCheckCircle} boxSize={6} color="white" /></Flex>
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" color="whiteAlpha.600">Átlagos teszt eredmény</Text>
              <Text fontSize="xl" fontWeight="bold" color="white">{mockStudentStats.averageTestScore}%</Text>
            </VStack>
          </CardBody>
        </Card>

        <Card bg="whiteAlpha.100" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
          <CardBody display="flex" alignItems="center" gap={4}>
            <Flex bg="purple.500" p={3} borderRadius="lg"><Icon as={FiBookOpen} boxSize={6} color="white" /></Flex>
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" color="whiteAlpha.600">Aktuális modul</Text>
              <Text fontSize="xl" fontWeight="bold" color="white">Unit {mockStudentStats.completedUnits + 1}</Text>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* --- 4. ÚJ: KITÜNTETÉSEK (BADGES) SZEKCIÓ --- */}
      <Box>
        <Heading size="lg" mb={6} color="pink.300">
          Megszerzett Kitüntetések
        </Heading>
        <Divider borderColor="whiteAlpha.300" mb={8} />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {mockBadges.map((badge) => (
            <Flex 
              key={badge.id} 
              bg={badge.isUnlocked ? "whiteAlpha.100" : "blackAlpha.400"} 
              p={5} 
              borderRadius="xl"
              borderWidth="1px"
              borderColor={badge.isUnlocked ? "whiteAlpha.300" : "transparent"}
              opacity={badge.isUnlocked ? 1 : 0.4}
              align="center"
              gap={4}
              transition="all 0.3s"
              _hover={badge.isUnlocked ? { transform: 'translateY(-3px)', bg: 'whiteAlpha.200' } : {}}
            >
              {/* Az ikon köre */}
              <Flex 
                justify="center" 
                align="center" 
                w="60px" 
                h="60px" 
                borderRadius="full" 
                bg={badge.isUnlocked ? "blackAlpha.500" : "transparent"}
                border="2px solid"
                borderColor={badge.isUnlocked ? badge.color : "gray.500"}
              >
                <Icon as={badge.icon} boxSize={7} color={badge.isUnlocked ? badge.color : "gray.500"} />
              </Flex>

              {/* Szöveges rész */}
              <VStack align="start" spacing={1} flex="1">
                <HStack w="full" justify="space-between">
                  <Text fontWeight="bold" fontSize="md" color={badge.isUnlocked ? "white" : "gray.400"}>
                    {badge.title}
                  </Text>
                  {/* Ha zárva van, kap egy kis címkét */}
                  {!badge.isUnlocked && (
                    <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">Zárva</Text>
                  )}
                </HStack>
                <Text fontSize="sm" color="whiteAlpha.600" lineHeight="tight">
                  {badge.description}
                </Text>
              </VStack>
            </Flex>
          ))}
        </SimpleGrid>
      </Box>

    </Box>
  );
};