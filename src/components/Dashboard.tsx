import { Box, SimpleGrid, Heading, Text, Flex, Badge, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

// Ez szimulálja a jövőbeli adatbázisodból érkező adatokat
const mockUnits = Array.from({ length: 14 }, (_, index) => {
    const unitNumber = index + 1;
    return {
        id: unitNumber,
        title: `Unit ${unitNumber}`,
        description: `Gyakorlatok és kifejezések a ${unitNumber}. modulhoz.`,
        // Szimuláljuk: az első 3 unit elérhető, a többi zárolt
        isUnlocked: unitNumber <= 3,
        // Szimuláljuk: az első 1 már teljesen elvégzett
        isCompleted: unitNumber <= 1,
    };
});

export const Dashboard = () => {
    const navigate = useNavigate()
    return (
        <Box w="full" maxW="1200px" mx="auto" py={12} px={8}>
            <VStack spacing={8} align="flex-start" mb={10}>
                <Heading as="h2" size="xl" color="white">
                    A te tanulási utad
                </Heading>
                <Text color="whiteAlpha.800" fontSize="lg">
                    Válaszd ki az aktuális modult a folytatáshoz!
                </Text>
            </VStack>

            {/* Grid: Mobilon 1, kis monitoron 2, nagy monitoron 3 vagy 4 oszlop */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                {mockUnits.map((unit) => (
                    <Box
                        key={unit.id}
                        onClick={() => {
                            if (unit.isUnlocked) {
                                navigate(`/unit/${unit.id}`); // Ha nyitva van, ugorjunk oda!
                            }
                        }}
                        bg={unit.isUnlocked ? "whiteAlpha.100" : "blackAlpha.400"}
                        p={6}
                        borderRadius="xl"
                        borderWidth="1px"
                        borderColor={unit.isUnlocked ? "whiteAlpha.300" : "transparent"}
                        // A lezárt elemek halványak és nem mutatnak kattintható egeret
                        opacity={unit.isUnlocked ? 1 : 0.5}
                        cursor={unit.isUnlocked ? "pointer" : "not-allowed"}
                        // Csak az aktív kártyák ugranak fel hoverre
                        transition="all 0.2s ease-in-out"
                        _hover={unit.isUnlocked ? { transform: 'translateY(-4px)', bg: 'whiteAlpha.200', borderColor: 'pink' } : {}}
                    >
                        <Flex justify="space-between" align="center" mb={4}>
                            <Heading size="md" color="white">
                                {unit.title}
                            </Heading>

                            {/* Állapotjelző címkék */}
                            {unit.isCompleted && (
                                <Badge colorScheme="green" variant="subtle" borderRadius="full" px={2}>
                                    Kész
                                </Badge>
                            )}
                            {!unit.isUnlocked && (
                                <Badge colorScheme="gray" variant="solid" borderRadius="full" px={2} bg="gray.600">
                                    Zárva
                                </Badge>
                            )}
                        </Flex>

                        <Text color={unit.isUnlocked ? "whiteAlpha.800" : "gray.500"} fontSize="sm">
                            {unit.description}
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    );
};