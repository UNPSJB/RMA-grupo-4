import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Table,Thead,Tbody,Tr,Th,Td,TableContainer,Spinner,Center,Box,useColorModeValue,} from '@chakra-ui/react';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await axios.get('http://localhost:8000/rolesnombresId');
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoles();
  }, []);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const bg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('black', 'white');
  const headerBg = useColorModeValue('gray.300', 'gray.600'); // Color para el encabezado sin cambio
  const hoverBg = useColorModeValue('rgb(0, 31, 63)', 'orange.400'); // Color para el hover de las filas
  const shadow = useColorModeValue('6px 6px 10px rgba(0, 0, 0, 0.1), -6px -6px 10px rgba(255, 255, 255, 0.7)', '6px 6px 10px rgba(0, 0, 0, 0.5), -6px -6px 10px rgba(50, 50, 50, 0.5)');

  return (
    <Box
      bg={bg}
      borderRadius="md"
      boxShadow={shadow}
      p={5}
      maxW="600px"
      mx="auto" // Centrar en el contenedor
      mt={5} // Margen superior
    >
      <TableContainer>
        <Table variant="simple" bg={bg} borderRadius="md" boxShadow={shadow} textAlign="left">
          <Thead>
            <Tr bg={headerBg} boxShadow="0px 4px 8px rgba(0, 0, 0, 0.2)"> {/* Efecto de relieve*/}
              <Th color={textColor}>ID</Th>
              <Th color={textColor}>Nombre del Rol</Th>
            </Tr>
          </Thead>
          <Tbody>
            {roles.map((role) => (
              <Tr key={role.id} _hover={{ bg: useColorModeValue('rgb(0, 31, 63)', 'orange.400'), color: 'white' }}color={textColor} >
                <Td>{role.id}</Td>
                <Td>{role.nombre}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      
    </Box>
  );
}
