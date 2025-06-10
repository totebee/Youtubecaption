import { Box, Flex, Button, Heading, Spacer } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { User } from '../lib/supabase';
import { supabase } from '../lib/supabase';

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Box bg="blue.500" px={4} py={4}>
      <Flex maxW="1200px" mx="auto" align="center">
        <Heading as={RouterLink} to="/" size="md" color="white">
          YouTube Caption Generator
        </Heading>
        <Spacer />
        {user ? (
          <Flex gap={4}>
            <Button as={RouterLink} to="/dashboard" colorScheme="whiteAlpha">
              Dashboard
            </Button>
            <Button onClick={handleSignOut} colorScheme="whiteAlpha">
              Sign Out
            </Button>
          </Flex>
        ) : (
          <Flex gap={4}>
            <Button as={RouterLink} to="/login" colorScheme="whiteAlpha">
              Login
            </Button>
            <Button as={RouterLink} to="/signup" colorScheme="whiteAlpha">
              Sign Up
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
} 