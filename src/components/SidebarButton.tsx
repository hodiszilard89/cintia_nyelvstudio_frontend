
import { Button} from '@chakra-ui/react';
import type { SidebarButtonProps } from '../types';


export const SidebarButton = ({ isActive, onClick, children, ...rest }: SidebarButtonProps) => {
  return (
    <Button
      variant={isActive ? "solid" : "ghost"}
      bg={isActive ? "pink" : "transparent"}
      color={isActive ? "white" : "whiteAlpha.800"}
      justifyContent="flex-start"
      _hover={{ bg: isActive ? "pink" : "whiteAlpha.200" }}
      onClick={onClick}
      {...rest} // Ezzel átmegy pl. a width="100%" vagy bármi extra formázás, amit később rádobnál
    >
      {children}
    </Button>
  );
};