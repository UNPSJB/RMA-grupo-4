import React from 'react';
import { Box, SimpleGrid, Text, VStack, Icon, useColorMode } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaKey, FaNetworkWired } from 'react-icons/fa';

export default function Admin() {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  // Definición de las rutas e íconos de cada card
  const cards = [
    { id: 1, title: 'Usuarios', route: '/usuarios', icon: FaUser },
    { id: 2, title: 'Roles', route: '/roles', icon: FaKey },
    { id: 3, title: 'Nodos', route: '/nodos', icon: FaNetworkWired },
    // Agrega más cards según sea necesario
  ];

  return (
    <Box p={5}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 5 }}
        spacing={5}
        justifyContent="center"
        maxW="1000px"
        mx="auto" // Centrado y márgenes automáticos a los costados
      >
        {cards.map((card) => (
          <VStack
            key={card.id}
            p={4}
            bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
            borderRadius="lg"
            boxShadow="md"
            cursor="pointer"
            w="100%"
            h="200px"
            maxW="200px"
            alignItems="center"
            justifyContent="center"
            transition="all 0.3s ease-in-out"
            _hover={{
              bg: colorMode === 'dark' ? 'gray.600' : 'gray.200',
              transform: 'scale(1.05)',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
            }}
            onClick={() => navigate(card.route)}
          >
            <Icon as={card.icon} w={10} h={10} color="orange.400" mb={2} />
            <Text fontWeight="bold" color={colorMode === 'dark' ? 'white' : 'black'}>
              {card.title}
            </Text>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
}
