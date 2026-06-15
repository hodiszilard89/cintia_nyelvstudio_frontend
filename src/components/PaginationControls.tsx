import { HStack, Button, Text } from '@chakra-ui/react';
import type { PaginationControlsProps } from '../types';

// 1. Definiáljuk a propok típusát


// 2. Ráillesztjük a típust a destruktúrált propokra
const PaginationControls = ({ 
    currentPage, 
    totalPages, 
    onNext, 
    onPrev 
}: PaginationControlsProps) => {
    return (
        <HStack spacing={4} align="center" justify="center" my={4}>
            <Button 
                onClick={onPrev} 
                isDisabled={currentPage === 0}
                colorScheme="blue"
                variant="outline"
            >
                Előző oldal
            </Button>
            
            <Text fontWeight="medium" fontSize="md">
                Oldal: {currentPage + 1} / {totalPages}
            </Text>
            
            <Button 
                onClick={onNext} 
                isDisabled={currentPage === totalPages - 1}
                colorScheme="blue"
                variant="outline"
            >
                Következő oldal
            </Button>
        </HStack>
    );
};

export default PaginationControls;