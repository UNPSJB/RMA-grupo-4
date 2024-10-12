import React from 'react';
import { Box, Text, useColorMode } from "@chakra-ui/react";

function Footer() {
  const { colorMode } = useColorMode(); // Obtener el estado del color mode

  return (
    <Box
      as="footer"
      bg={colorMode === 'light' ? "gray.100" : "gray.900"} // Cambiar fondo según el tema
      color={colorMode === 'light' ? "black" : "white"} // Cambiar color de texto según el tema
      p={4}
      textAlign="center"
      position="absolute"
      bottom="0"
      left="0"
      right="0"
      width="100%"
      mt="2"
      boxShadow="10px -10px 30px rgba(0, 0, 0, 0.5), -10px 10px 30px rgba(255, 255, 255, 0.1)" // Sombra para continuidad
    >
      <Text>© {new Date().getFullYear()} Red de Monitoreo Ambiental. Todos los derechos reservados.</Text>
    </Box>
  );
}

export default Footer;
