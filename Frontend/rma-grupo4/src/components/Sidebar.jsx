import React from 'react';
import { Link } from 'react-router-dom';
import { Button, VStack, Box, Icon } from "@chakra-ui/react";
import { HiTable, HiChartBar, HiClock, HiVariable, HiCog, HiRefresh } from "react-icons/hi"; // Importa iconos

function Sidebar() {
  return (
    <Box
      bg="gray.800"
      color="white"
      w="250px"
      h="100vh"
      p={4}
      boxShadow="lg"
      position="fixed"
     
    >
      <VStack spacing={4} align="stretch">
        <Button
          as={Link}
          to="/tabla"
          colorScheme="teal"
          size="lg"
          _hover={{ bg: "teal.400" }}
          boxShadow="md"
          isTruncated
          px={6}
          py={5}
          leftIcon={<Icon as={HiTable} />} // Icono de tabla
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
          isTruncated
          px={6}
          py={5}
          leftIcon={<Icon as={HiChartBar} />} // Icono de gráficos
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
          isTruncated
          px={6}
          py={5}
          leftIcon={<Icon as={HiClock} />} // Icono de históricos
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
          isTruncated
          px={6}
          py={5}
          leftIcon={<Icon as={HiVariable} />} // Icono de variables
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
          isTruncated
          px={6}
          py={5}
          leftIcon={<Icon as={HiCog} />} // Icono de configuraciones
        >
          Union de Variables
        </Button>
      </VStack>
    </Box>
  );
}

export default Sidebar;
