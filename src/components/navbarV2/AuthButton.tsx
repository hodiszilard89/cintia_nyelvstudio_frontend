import { 
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalBody, ModalCloseButton, useDisclosure, VStack, Text, Box, HStack, Avatar
} from '@chakra-ui/react';
import { GoogleLogin } from '@react-oauth/google';

import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; // 👈 1. Importáld a navigációt
import { useAuth } from '../AuthContext';

import { useGoogleAuth } from '../../hooks/useGoogleAuth';


export const AuthButton = () => {
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  
  // 👈 Kérjük el a globális állapotkezelőtől a változókat és függvényeket!
  const { user, login, logout } = useAuth(); 


// A komponensen belül, a return előtt deklaráld:
const { verifyToken } = useGoogleAuth();

const handleLoginSuccess = async (credentialResponse: any) => {
  const googleToken = credentialResponse.credential;

  try {
    await verifyToken(googleToken); // A hálózati kérést átadtuk a hooknak
    
    const decoded = jwtDecode<any>(googleToken);
    login(decoded);
    navigate('/home');
  } catch (err) {
    console.error("A backend visszautasította a tokent vagy hiba történt!", err);
  }
};

  // Kijelentkezés
  const handleLogout = () => {
    logout(); // 👈 Törli a globális memóriát
    navigate('/');
  };

if (user) {
    return (
      <HStack gap={4}>
        {/* Kattintható rész: a diák profiljára visz */}
        <HStack 
          gap={3} 
          cursor="pointer" 
          _hover={{ opacity: 0.8 }}
          onClick={() => navigate('/profile')} // 👈 Átdob a profil oldalra
        >
          <Avatar size="sm" name={user.name} src={user.picture} />
          <Text fontWeight="600" color="white" display={{ base: 'none', sm: 'block' }}>
            {user.name}
          </Text>
        </HStack>
        
        <Button size="sm" variant="ghost" color="pink" _hover={{ bg: 'whiteAlpha.200' }} onClick={handleLogout}>
          Kilépés
        </Button>
      </HStack>
    );
  }

  return (
    <>
      <Button onClick={onOpen} variant="outline" bg="pink" borderRadius="full" px={8} _hover={{ borderColor: 'white', color: 'white', bg: 'transparent' }}>
        Belépés
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.600" />
        <ModalContent bg="#2a144a" color="white" borderRadius="xl" p={4}>
          <ModalHeader textAlign="center" fontSize="2xl">Üdvözlünk!</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6}>
              <Text textAlign="center" color="whiteAlpha.800" fontSize="md">
                Jelentkezz be gyorsan és biztonságosan a Google fiókoddal, hogy folytathasd a tanulást.
              </Text>
              <Box w="full" display="flex" justifyContent="center">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => { console.log('Hiba történt.'); }}
                  theme="filled_black" 
                  shape="pill"         
                />
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};