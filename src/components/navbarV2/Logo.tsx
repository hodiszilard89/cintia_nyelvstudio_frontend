import { Image } from '@chakra-ui/react';
import logoImg from '../../assets/logo2.png'; // Igazítsd a saját útvonaladhoz

export const Logo = () => {
  return <Image src={logoImg} alt="Cinia logó" h={110} />;
};