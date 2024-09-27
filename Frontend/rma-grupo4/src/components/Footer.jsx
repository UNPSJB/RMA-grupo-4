import React from 'react';
import { Box, Text } from "@chakra-ui/react";

function Footer() {
  return (
    <Box
      as="footer"
      bg="gray.700"
      color="white"
      p={4}
      textAlign="center"
      position="absolute" // Cambiado de 'absolute' a 'fixed'
      bottom="0"
      left="0"
      right="0"
      width="100%" // Asegura que el footer ocupe todo el ancho
    >
      <Text>© {new Date().getFullYear()} Red de Monitoreo Ambiental. Todos los derechos reservados.</Text>
    </Box>
  );
}

export default Footer;

