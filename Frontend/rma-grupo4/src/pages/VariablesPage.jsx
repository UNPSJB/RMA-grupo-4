import React from 'react';
import { Box, Heading, IconButton  } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function VariablesPage() {
  return (
    <Box bg="gray.800" color="white" minH="100vh" p={4}>
      <IconButton 
        as={Link} 
        to="/" 
        icon={<FaArrowLeft />} // Usamos el ícono de "react-icons"
        colorScheme="teal" 
        aria-label="Volver a la Página Principal" 
        mb={4}
      />
      <Heading as="h1" size="xl" mb={6}>
        Datos por Variable
      </Heading>
      {/* Aquí irá la lógica de la tabla */}
    </Box>
  );
}

export default VariablesPage;