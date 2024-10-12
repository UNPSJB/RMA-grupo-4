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
  useColorMode // Importar useColorMode
} from '@chakra-ui/react';

const HelpModal = ({ isOpen, onClose }) => {
  const { colorMode } = useColorMode(); // Obtener el estado del color mode

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'sm', md: 'lg', lg: 'xl' }}>
      <ModalOverlay />
      <ModalContent
        width={{ base: '90%', md: '80%', lg: '70%' }}
        maxW="900px"
        maxH="80vh"
        height="auto"
        borderRadius="2xl"
        bg={colorMode === 'light' ? 'white' : 'gray.800'} // Cambiar fondo según el tema
        boxShadow="10px 10px 20px rgba(0, 0, 0, 0.7)"
      >
        <ModalHeader textAlign="center" bg={colorMode === 'light' ? 'gray.200' : 'gray.900'} color={colorMode === 'light' ? 'black' : 'white'} borderTopRadius="2xl">
          Ayuda
        </ModalHeader>
        <ModalCloseButton color={colorMode === 'light' ? 'black' : 'white'} />

        <ModalBody p={6} bg={colorMode === 'light' ? 'white' : 'gray.800'} color={colorMode === 'light' ? 'black' : 'white'} overflowY="auto">
          <Stack spacing={6}>
            <Box>
              <Heading size="md" mb={2} color="orange.300">¿Cómo usar la aplicación?</Heading>
              <Text fontSize="md">
                Esta aplicación te permite acceder a datos históricos y realizar análisis. Para comenzar, simplemente navega a la sección deseada utilizando el menú.
              </Text>
            </Box>

            <Box>
              <Heading size="md" mb={2} color="orange.300">Preguntas Frecuentes</Heading>
              <Stack spacing={4} pl={4} borderLeft="4px solid orange.300">
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
              <Heading size="md" mb={2} color="orange.300">Contactar Soporte</Heading>
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
            bg="orange.500"
            borderRadius="30px"
            boxShadow="10px 10px 20px rgba(0, 0, 0, 0.7)"
            _hover={{
              bg: 'orange.600',
              transform: 'scale(1.05)',
            }}
            _active={{
              bg: 'orange.700',
              transform: 'translateY(2px)',
            }}
            color={colorMode === 'light' ? 'black' : 'white'} // Cambiar color de texto según el tema
          >
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HelpModal;
