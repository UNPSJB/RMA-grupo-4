import React from 'react';
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Box, 
  Text, 
  Heading, 
  Stack, 
  useColorMode 
} from '@chakra-ui/react';
import usoAyuda from './usoAyuda';

const HelpModal = ({ isOpen, onClose, userRole }) => {
  const { colorMode } = useColorMode();
  const customColor = colorMode === 'light' ? 'rgb(0, 31, 63)' : 'orange.300';
  const botonAyuda = usoAyuda(userRole, onClose);

  console.log(botonAyuda);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'sm', md: 'lg', lg: 'xl' }}>
      <ModalOverlay />
      <ModalContent
        width={{ base: '90%', md: '80%', lg: '70%' }}
        maxW="900px"
        maxH="80vh"
        height="auto"
        borderRadius="2xl"
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        boxShadow="10px 10px 20px rgba(0, 0, 0, 0.7)"
      >
        <ModalHeader
          textAlign="center"
          bg={colorMode === 'light' ? 'gray.200' : 'gray.900'}
          color={colorMode === 'light' ? 'black' : 'white'}
          borderTopRadius="2xl"
        >
          Ayuda
        </ModalHeader>
        <ModalCloseButton color={colorMode === 'light' ? 'black' : 'white'} />
        <ModalBody
          p={6}
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          color={colorMode === 'light' ? 'black' : 'white'}
          overflowY="auto"
        >
          <Stack spacing={6}>
            {/* Aquí puedes mostrar contenido adicional basado en el rol */}
            {botonAyuda}
          </Stack>
        </ModalBody>
        <ModalFooter bg={colorMode === 'light' ? 'gray.200' : 'gray.900'} borderBottomRadius="2xl">
          <Button
            colorScheme="orange"
            onClick={onClose}
            mr={3}
            bg={colorMode === 'light' ? 'rgb(0, 31, 63)' : 'orange.500'}
            borderRadius="30px"
            boxShadow="10px 10px 20px rgba(0, 0, 0, 0.7)"
            _hover={{
              bg: colorMode === 'light' ? 'rgb(0, 45, 80)' : 'orange.600',
              transform: 'scale(1.05)',
            }}
            _active={{
              bg: colorMode === 'light' ? 'rgb(0, 20, 50)' : 'orange.700',
              transform: 'translateY(2px)',
            }}
            color={colorMode === 'light' ? 'white' : 'white'}
          >
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HelpModal;