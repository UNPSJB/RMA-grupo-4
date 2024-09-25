// src/App.jsx
import React from 'react';
import { Box } from "@chakra-ui/react";
import NavigationButtons from './components/NavigationButtons';
import Footer from './components/Footer'; 

function App() {
  return (
    <Box
      bg="gray.900"
      color="white"
      minH="100vh"
      display="flex"
      flexDirection="column"
      p={4}
    >
      {/* Componente de botones de navegación */}
      <NavigationButtons />

      {/* Espacio para la "pantalla principal" */}
      <Box
        flex="1"
        bg="gray.800"
        p={6}
        borderRadius="md"
        boxShadow="lg"
        textAlign="center"
      >
        Pantalla principal aquí
      </Box>
      {/* Footer reutilizable */}
      <Footer />
    </Box>
  );
}

export default App;
