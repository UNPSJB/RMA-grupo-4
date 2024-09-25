import React from 'react';
import { Box, Heading  } from '@chakra-ui/react';
import NavigationButtons from '../components/NavigationButtons';

function TablaPage() {
  return (
    <Box bg="gray.800" color="white" minH="100vh" p={4}>
      {/* Componente de botones de navegación */}
      <NavigationButtons />
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Datos en Tabla
      </Heading>
      {/* Aquí irá la lógica de la tabla */}
    </Box>
  );
}

export default TablaPage;