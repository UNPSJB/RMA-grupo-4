import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Spinner, Center } from '@chakra-ui/react';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await axios.get('http://localhost:8000/rolesnombresId'); // Cambié la URL al nuevo endpoint
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

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Nombre del Rol</Th>
          </Tr>
        </Thead>
        <Tbody>
          {roles.map((role) => (
            <Tr key={role.id}> {/* Asegúrate de que 'id' es el nombre correcto del campo */}
              <Td>{role.id}</Td> {/* Mostrar el ID del rol */}
              <Td>{role.nombre}</Td> {/* Mostrar el nombre del rol */}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
