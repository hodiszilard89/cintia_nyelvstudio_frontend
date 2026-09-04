import { Box, HStack, Link } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: 'Főoldal', path: '/' },
  { label: 'Rólunk', path: '/rolunk' },
  { label: 'Árak', path: '/arak' },
  { label: 'Tanfolyamok', path: '/tanfolyamok' },
  { label: 'Blog', path: '/blog' },
  { label: 'Kapcsolat', path: '/kapcsolat' },
];

export const Navigation = () => {
  const navigate = useNavigate();
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { offsetLeft, offsetWidth } = e.currentTarget;
    setIndicator({ left: offsetLeft, width: offsetWidth, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setIndicator(prev => ({ ...prev, opacity: 0 }));
  };
  console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  return (
    <Box position="relative" onMouseLeave={handleMouseLeave}>
      <HStack gap={8} fontWeight="600">
        {menuItems.map((item) => (
          <Link
            fontSize={"xl"}
            key={item.path}
            onClick={() => navigate(item.path)}
            onMouseEnter={handleMouseEnter}
            pb={2}
            textDecoration="none"
            _hover={{
              color: 'white',
              textDecoration: 'none',
              _after: { width: '100%' } 
            }}
          >
            {item.label}
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