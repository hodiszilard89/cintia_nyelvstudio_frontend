import { Box, HStack, Link } from '@chakra-ui/react';
import { useState } from 'react';

const menuItems = ['Főoldal', 'Rólunk','Árak','Tanfolyamok', 'Blog', 'Kapcsolat']; // Példa adatok

export const Navigation = () => {
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { offsetLeft, offsetWidth } = e.currentTarget;
    setIndicator({ left: offsetLeft, width: offsetWidth, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setIndicator(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <Box position="relative" onMouseLeave={handleMouseLeave}>
      <HStack gap={8} fontWeight="600">
        {menuItems.map((item) => (
          <Link
            fontSize={"xl"}
            key={item}
            href="#"
            onMouseEnter={handleMouseEnter}
            pb={2}
            textDecoration="none"
            _hover={{
              color: 'white',
              textDecoration: 'none',
              // Ha a mozgó alsó csíkot használod (az abszolút pozíciós Box-ot lejjebb), 
              // ezt az _after-t érdemes lehet kivenni, nehogy két vonal jelenjen meg egyszerre!
              _after: { width: '100%' } 
            }}
          >
            {item}
          </Link>
        ))}
      </HStack>
      
      {/* A közös, mozgó aláhúzás */}
      <Box
        position="absolute"
        bottom={0}
        left={`${indicator.left}px`}
        width={`${indicator.width}px`}
        height="2px"
        bg="white"
        opacity={indicator.opacity}
        transition="all 0.3s ease-in-out"
      />
    </Box>
  );
};