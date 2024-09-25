import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, HStack } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";

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
      {/* Alinea los botones en la parte superior con HStack con VStack los pondria vertical*/}
      <HStack spacing={4} justifyContent="center" mb={4}>
        <Button
          as={Link}
          to="/"
          colorScheme="teal"
          size="lg"
          _hover={{ bg: "teal.400" }}
          boxShadow="md"
          leftIcon={<AiFillHome />} 
        >
        </Button>
        <Button
          as={Link}
          to="/tabla"
          colorScheme="teal"
          size="lg"
          _hover={{ bg: "teal.400" }}
          boxShadow="md"
        >
          Datos en Tabla
        </Button>
        <Button
          as={Link}
          to="/graficos"
          colorScheme="teal"
          size="lg"
          _hover={{ bg: "teal.400" }}
          boxShadow="md"
        >
          Datos en Gráficos
        </Button>
        <Button
          as={Link}
          to="/historicos"
          colorScheme="teal"
          size="lg"
          _hover={{ bg: "teal.400" }}
          boxShadow="md"
        >
          Datos Históricos
        </Button>
        <Button
          as={Link}
          to="/variables"
          colorScheme="teal"
          size="lg"
          _hover={{ bg: "teal.400" }}
          boxShadow="md"
        >
          Datos por Variable
        </Button>
        <Button
          as={Link}
          to="/combinaciones"
          colorScheme="teal"
          size="lg"
          _hover={{ bg: "teal.400" }}
          boxShadow="md"
        >
          Combinaciones de Graficas
        </Button>
        <Button
          as={Link}
          to="/combinaciones2"
          colorScheme="teal"
          size="lg"
          _hover={{ bg: "teal.400" }}
          boxShadow="md"
        >
          Combinaciones de Variables
        </Button>
      </HStack>

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
    </Box>
  );
}

export default App;