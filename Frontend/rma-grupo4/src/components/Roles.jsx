import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Spinner, Center, Box, useColorMode, Heading } from '@chakra-ui/react';

export default function Roles() {
  const { colorMode } = useColorMode();
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

  return (
    <Box bg={colorMode === 'light' ? 'gray.200' : 'gray.900'} color={colorMode === 'light' ? 'black' : 'white'} borderRadius="md" boxShadow="md" width="100%" p={4}>
      <Heading as="h1" textAlign="center" p="8">Roles</Heading>
      <Box bg={colorMode === 'light' ? 'gray.300' : 'gray.800'}  p={2} borderRadius="md" >
        <TableContainer overflowX="auto" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'} borderRadius="md" boxShadow="lg" p={2}>
          <Table variant="simple" colorScheme={colorMode === 'light' ? "blackAlpha" : "whiteAlpha"}>
            <Thead display={{ base: "none", md: "table-header-group" }}>
              <Tr>
                <Th color={colorMode === 'light' ? 'black' : 'white'} fontWeight="bold" textAlign="center">ID</Th>
                <Th color={colorMode === 'light' ? 'black' : 'white'} fontWeight="bold" textAlign="center">Nombre del Rol</Th>
              </Tr>
            </Thead>
            <Tbody>
              {roles.map((role) => (
                <Tr 
                  key={role.id} 
                  bg={colorMode === 'light' ? 'white' : 'gray.700'} 
                  color={colorMode === 'light' ? 'black' : 'white'}
                  _hover={{ backgroundColor: colorMode === 'light' ? "gray.100" : "gray.700" }}
                >
                  <Td color={colorMode === 'light' ? 'black' : 'white'} textAlign="center">{role.id}</Td>
                  <Td color={colorMode === 'light' ? 'black' : 'white'} textAlign="center">{role.nombre}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

