import React from 'react';
import { ChakraProvider, Flex, Box, extendTheme } from '@chakra-ui/react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { AuthProvider } from './components/AuthContext'; // Importar el AuthProvider

// Crear un tema que use modo oscuro por defecto
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

function App({ children }) { // Cambia para aceptar children
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Flex direction="column" minH="100vh" bg="gray.800" color="white">
          <NavBar />
          <Box flex="1">
            {children} {/* Renderiza los children pasados por las rutas */}
          </Box>
          <Footer />
        </Flex>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
