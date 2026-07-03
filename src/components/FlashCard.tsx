import {Box, Text} from '@chakra-ui/react'
import { speakEnglish } from '../utils';
import type { MachGameWord } from '../types';

export const FlashCard = ({card,isSelected, onClick}:{card:MachGameWord, isSelected:boolean, onClick:(id:string)=>void}) => {
    return (
        <Box
            key={card.id}
            onClick={() => {onClick(card.id); if (card.type==='en' && !isSelected)speakEnglish(card.text)}}
            opacity={card.isMatched ? 0 : 1}
            visibility={card.isMatched ? "hidden" : "visible"}
            transform={isSelected ? "scale(0.90)" : "scale(1)"}
            transition="all 0.2s"
            bg={isSelected ? (card.type === 'en' ? "blue.500" : "pink.500") : "whiteAlpha.200"}
            color={isSelected ? "white" : "whiteAlpha.900"}
            border="2px solid"
            borderColor={isSelected ? "whiteAlpha.500" : "transparent"}
            borderRadius="lg"
            p={4}
            cursor={card.isMatched ? "default" : "pointer"}
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            minH="80px"
            boxShadow={isSelected ? "inner" : "sm"}
            _hover={!card.isMatched && !isSelected ? { bg: "whiteAlpha.300" } : {}}
        >
            <Text fontWeight="bold" fontSize="md" wordBreak="break-word">
                {card.text}
            </Text>
        </Box>
    )
}