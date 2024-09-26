import React from 'react';
import { Box, Heading, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function GraficosPage() {
  return (
    <Box bg="gray.800" color="white" minH="100vh" p={4}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Datos en Gráficos
      </Heading>

      {/* Botón para volver a la página de inicio */}
      <Box textAlign="center" mb={6}>
        <Button colorScheme="teal" as={Link} to="/inicio">
          Volver a Inicio
        </Button>
      </Box>

      {/* Aquí irá la lógica de la tabla */}
    </Box>
  );
}

export default GraficosPage;
