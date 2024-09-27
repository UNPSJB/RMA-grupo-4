import React from 'react';
import { Link } from 'react-router-dom';
import { Button, HStack } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";

function NavigationButtons() {
  return (
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
        to="/combinaciones2"
        colorScheme="teal"
        size="lg"
        _hover={{ bg: "teal.400" }}
        boxShadow="md"
      >
        Combinaciones de Variables
      </Button>
    </HStack>
  );
}

export default NavigationButtons;