import React from 'react';
import { ChakraProvider, Flex, Box, extendTheme } from '@chakra-ui/react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs'; // Importa Breadcrumbs
import { AuthProvider } from './components/AuthContext'; // Importa el AuthProvider

// Crear un tema que use modo oscuro por defecto
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

function App({ children }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Flex direction="column" minH="100vh" color="white" flexDirection="column">
          <NavBar />
          
          {/* Coloca Breadcrumbs aquí, debajo de NavBar */}
          <Breadcrumbs />

          <Box flex="1" paddingBottom="100px">
            {children} {/* Renderiza los children pasados por las rutas */}
          </Box>
        </Flex>
      </AuthProvider>
      <Footer />
    </ChakraProvider>
  );
}

export default App;
  