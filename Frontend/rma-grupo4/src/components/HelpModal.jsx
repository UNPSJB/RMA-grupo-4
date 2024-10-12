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

const HelpModal = ({ isOpen, onClose }) => {
  const { colorMode } = useColorMode(); 

  // Cambiar color según el modo
  const customColor = colorMode === 'light' ? 'rgb(0, 31, 63)' : 'orange.300'; 

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
            <Box>
              <Heading size="md" mb={2} color={customColor}>¿Cómo usar la aplicación?</Heading>
              <Text fontSize="md">
                Esta aplicación te permite acceder a datos históricos y realizar análisis. Para comenzar, simplemente navega a la sección deseada utilizando el menú.
              </Text>
            </Box>

            <Box>
              <Heading size="md" mb={2} color={customColor}>Preguntas Frecuentes</Heading>
              <Stack spacing={4} pl={4} borderLeft={`4px solid ${customColor}`}>
                <Box>
                  <Text fontWeight="bold">1. ¿Cómo puedo modificar mis datos?</Text>
                  <Text fontSize="sm">
                    Puedes modificar tus datos accediendo al menú de usuario y seleccionando "Modificar datos de usuario".
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">2. ¿Cómo elimino mi cuenta?</Text>
                  <Text fontSize="sm">
                    Para eliminar tu cuenta, dirígete al menú de usuario y selecciona "Eliminar usuario". Asegúrate de confirmar la acción.
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">3. ¿Dónde puedo encontrar más información?</Text>
                  <Text fontSize="sm">
                    Si necesitas más información, revisa la sección de ayuda o contacta a soporte.
                  </Text>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Heading size="md" mb={2} color={customColor}>Contactar Soporte</Heading>
              <Text fontSize="md">
                Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos en{' '}
                <Box as="span" fontWeight="bold">support@example.com</Box> o llama al{' '}
                <Box as="span" fontWeight="bold">+1 234 567 8901</Box>.
              </Text>
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter bg={colorMode === 'light' ? 'gray.200' : 'gray.900'} borderBottomRadius="2xl">
          <Button 
            colorScheme="orange" 
            onClick={onClose} 
            mr={3}
            bg={colorMode === 'light' ? 'rgb(0, 31, 63)' : 'orange.500'} // Cambiar fondo según el modo
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
            color={colorMode === 'light' ? 'white' : 'white'} // Cambiar color del texto del botón
          >
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HelpModal;
