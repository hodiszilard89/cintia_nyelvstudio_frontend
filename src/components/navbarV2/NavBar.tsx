import { Flex } from '@chakra-ui/react';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { AuthButton } from './AuthButton';

export const Navbar = () => {
  return (
    <Flex as="header" justify="space-between" align="center" px={16} py={6}>
      <Logo />
      <Navigation />
      <AuthButton />
    </Flex>
  );
};