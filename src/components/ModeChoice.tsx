import { Button } from '@chakra-ui/react';
import type { SidebarButtonProps } from '../types';


export const ChoiceButton = ({ isActive, onClick, children, ...rest }: SidebarButtonProps) => {
    return (
        <Button
            colorScheme={isActive ? 'pink' : 'gray'}
            variant={isActive ? 'solid' : 'outline'}
            onClick={onClick}
            {...rest} // Ezzel átmegy pl. a width="100%" vagy bármi extra formázás, amit később rádobnál
        >
            {children}
        </Button>
    );
};