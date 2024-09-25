import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, HStack, Flex } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";

function Layout({ children }) {
  return (
    <Box
      bg="gray.900"
      color="white"
      minH="100vh"
      display="flex"
      flexDirection="column"
      p={4}
    >
      <Flex as="nav" wrap="wrap" justify="center" mb={4}>
        <HStack spacing={4} mb={4}>
          <Button
            as={Link}
            to="/"
            colorScheme="teal"
            size="lg"
            _hover={{ bg: "teal.400" }}
            boxShadow="md"
            leftIcon={<AiFillHome />}
          >
            Inicio
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
        </HStack>
        <HStack spacing={4}>
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
            Combinaciones de Gráficas
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
      </Flex>

      <Box
        flex="1"
        bg="gray.800"
        p={6}
        borderRadius="md"
        boxShadow="lg"
        textAlign="center"
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;


