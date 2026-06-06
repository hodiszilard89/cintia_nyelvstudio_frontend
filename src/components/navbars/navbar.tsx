
import { Flex, Box, Button, Heading, HStack } from '@chakra-ui/react';
import { NavLink } from './NavLink';
/**
 * Fő navigációs sáv a weboldal tetején.
 * a menüpont alatt megjelenő vonal jelzi a fókuszt
 */
export const Navbar = () => {
    return (
        <Flex as="header" justify="space-between" align="center" px={16} py={6}>
            <Box>
                {/* Logó placeholder */}
                <Heading size="md" color="#3b1c68">Cinia</Heading>
            </Box>

            <HStack gap={10} fontWeight="600" color="gray.800">
                <NavLink href='#'>Kezdőlap</NavLink>
                <NavLink href='#'>Tanfolyamok</NavLink>
                <NavLink href='#'>Árak</NavLink>
                <NavLink href='#'>Rólunk</NavLink>
                <NavLink href='#'>Kapcsolat</NavLink>
            </HStack>

            <Box>
                <Button
                    variant="outline"
                    borderColor="gray.800"
                    color="gray.800"
                    borderRadius="full"
                    px={8}
                    _hover={{ borderColor: 'purple.600', color: 'purple.600', bg: 'transparent' }}
                >
                    Belépés
                </Button>
            </Box>
        </Flex>
    );
};