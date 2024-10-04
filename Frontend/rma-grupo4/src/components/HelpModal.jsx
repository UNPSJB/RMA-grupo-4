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
  Stack 
} from '@chakra-ui/react';

const HelpModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'sm', md: 'lg', lg: 'xl' }}>
    <ModalOverlay />
    <ModalContent
      width={{ base: '90%', md: '80%', lg: '70%' }} // Ancho responsivo
      maxW="900px" // Ancho máximo
      maxH="80vh" // Altura máxima
      height="auto"
      borderRadius="md"
      boxShadow="lg"
    >
      <ModalHeader textAlign="center" bg="gray.800" color="white" borderTopRadius="md">
        Ayuda
      </ModalHeader>
      <ModalCloseButton color="white" />

      <ModalBody p={6} bg="gray.700" color="white" overflowY="auto">
        <Stack spacing={6}>
          {/* Sección 1: Cómo usar la aplicación */}
          <Box>
            <Heading size="md" mb={2} color="teal.200">¿Cómo usar la aplicación?</Heading>
            <Text fontSize="md">
              Esta aplicación te permite acceder a datos históricos y realizar análisis. Para comenzar, simplemente navega a la sección deseada utilizando el menú.
            </Text>
          </Box>

          {/* Sección 2: Preguntas Frecuentes */}
          <Box>
            <Heading size="md" mb={2} color="teal.200">Preguntas Frecuentes</Heading>
            <Stack spacing={4} pl={4} borderLeft="4px solid teal">
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

          {/* Sección 3: Contactar Soporte */}
          <Box>
            <Heading size="md" mb={2} color="teal.200">Contactar Soporte</Heading>
            <Text fontSize="md">
              Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos en{' '}
              <Box as="span" fontWeight="bold">support@example.com</Box> o llama al{' '}
              <Box as="span" fontWeight="bold">+1 234 567 8901</Box>.
            </Text>
          </Box>
        </Stack>
      </ModalBody>

      <ModalFooter bg="gray.800" borderBottomRadius="md">
        <Button colorScheme="teal" onClick={onClose} mr={3}>
          Cerrar
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default HelpModal;