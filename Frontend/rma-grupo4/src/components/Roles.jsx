import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Spinner, Center, Box, useColorModeValue } from '@chakra-ui/react';

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

 
  const bg = useColorModeValue('gray.100', 'gray.800'); // Fondo
  const tableBg = useColorModeValue('gray.200', 'gray.700'); // Fondo de la tabla
  const textColor = useColorModeValue('black', 'white'); // Color del texto
  const headerBg = useColorModeValue('gray.300', 'gray.600'); // Fondo del encabezado

  return (
    <Box bg={bg} p="6" borderRadius="md" boxShadow="lg" m="4">
      <TableContainer>
        <Table variant="unstyled">
          <Thead>
            <Tr bg={headerBg}>
              <Th color={textColor} fontWeight="bold" textAlign="center">ID</Th>
              <Th color={textColor} fontWeight="bold" textAlign="center">Nombre del Rol</Th>
            </Tr>
          </Thead>
          <Tbody>
            {roles.map((role) => (
              <Tr key={role.id} bg={tableBg} borderBottom="1px solid lightgray">
                <Td color={textColor} textAlign="center">{role.id}</Td>
                <Td color={textColor} textAlign="center">{role.nombre}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
