import React from 'react';
import { Box, Text } from "@chakra-ui/react";

function Footer() {
  return (
    <Box
      as="footer"
      bg="gray.900" // Cambiado para combinar con el NavBar
      color="white"
      p={4}
      textAlign="center"
      position="fixed" // Asegúrate de que esté fijo en la parte inferior
      bottom="0"
      left="0"
      right="0"
      width="100%"
      mt="2" // Asegura que el footer ocupe todo el ancho
      boxShadow="10px -10px 30px rgba(0, 0, 0, 0.5), -10px 10px 30px rgba(255, 255, 255, 0.1)" // Añadir sombra para continuidad
    >
      <Text>© {new Date().getFullYear()} Red de Monitoreo Ambiental. Todos los derechos reservados.</Text>
    </Box>
  );
}

export default Footer;
