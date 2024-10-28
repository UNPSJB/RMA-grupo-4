import React from 'react';
import { Box, SimpleGrid, Text, VStack, Icon, Button, useColorMode } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaPlus, FaList, FaArrowLeft } from 'react-icons/fa';

export default function Nodos() {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const cards = [
    { id: 1, title: 'Agregar Nodo', route: '/agregar-nodo', icon: FaPlus },
    { id: 2, title: 'Modificar Nodo', route: '/modificar-nodo', icon: FaEdit },
    { id: 3, title: 'Eliminar Nodo', route: '/eliminar-nodo', icon: FaTrash },
    { id: 4, title: 'Lista de Nodos', route: '/lista-nodos', icon: FaList },
  ];

  return (
    <Box p={5}>
      <Button
        onClick={() => navigate(-1)} // Navegación hacia atrás
        leftIcon={<FaArrowLeft />}
        colorScheme={colorMode === 'dark' ? 'orange' : 'teal'} // Cambia según tu paleta de colores
        variant="solid"
        mb={5}
        color={colorMode === 'dark' ? 'white' : 'black'}
        bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
        _hover={{
          bg: colorMode === 'dark' ? 'gray.600' : 'gray.200',
          transform: 'scale(1.05)',
        }}
      >
        Volver
      </Button>

      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        spacing={5}
        justifyContent="center"
        maxW="1000px"
        mx="auto"
      >
        {cards.map((card) => (
          <VStack
            key={card.id}
            p={4}
            bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
            borderRadius="28px"
            boxShadow={
              colorMode === 'dark'
                ? '6px 6px 10px #1a202c, -6px -6px 10px #2d3748'
                : '6px 6px 10px #9b9b9b, -6px -6px 10px #ffffff'
            }
            cursor="pointer"
            w="100%"
            h="200px"
            maxW="200px"
            alignItems="center"
            justifyContent="center"
            transition="all 0.3s ease-in-out"
            _hover={{
              transform: 'scale(1.05)',
              boxShadow:
                colorMode === 'dark'
                  ? '6px 6px 15px #1a202c, -6px -6px 15px #2d3748, 0px 4px 15px rgba(0, 0, 0, 0.5)'
                  : '6px 6px 15px #9b9b9b, -6px -6px 15px #ffffff, 0px 4px 15px rgba(0, 0, 0, 0.5)',
            }}
            onClick={() => navigate(card.route)}
          >
            <Icon
              as={card.icon}
              w={10}
              h={10}
              color={colorMode === 'dark' ? 'orange.400' : 'rgb(0, 31, 63)'}
              mb={2}
            />
            <Text fontWeight="bold" color={colorMode === 'dark' ? 'white' : 'black'}>
              {card.title}
            </Text>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
}
