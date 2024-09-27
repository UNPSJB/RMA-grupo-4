import React, { useState } from 'react';
import { Box, Heading, Table, Thead, Tr, Th, Tbody, Td, Select, Text } from '@chakra-ui/react';
import NavigationButtons from '../components/NavigationButtons';

function TablaPage() {
  // Datos simulados
  const data = [
    { Nodo: 1, Humedad: '4', Temperatura: '5', Presion: '6', value: 30.45 },
    { Nodo: 2, Humedad: '7', Temperatura: '8', Presion: '9', value: 22.34 },
    { Nodo: 3, Humedad: '10', Temperatura: '11', Presion: '12', value: 27.89 }
  ];

  // Estado para almacenar el nodo seleccionado
  const [selectedNodo, setSelectedNodo] = useState('');

  // Función para manejar el cambio del nodo
  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedNodo(value === '' ? '' : parseInt(value, 10)); // Si no se selecciona nada, asignar ''
  };

  // Filtrar los datos: si no hay ningún nodo seleccionado, mostrar todos
  const filteredData = selectedNodo === ''
    ? data
    : data.filter((row) => row.Nodo === selectedNodo);

  return (
    <Box bg="gray.800" color="white" minH="100vh" p={{ base: 2, md: 4 }}>
      <NavigationButtons />
      
      {/* Heading con tamaño responsivo */}
      <Heading as="h1" size={{ base: 'lg', md: 'xl' }} mb={6} textAlign="center">
        Datos en Tabla
      </Heading>

      {/* Select para seleccionar el Nodo con ajustes responsivos */}
      <Box mb={4} textAlign="center">
        <Select
          placeholder="Seleccione un nodo"
          value={selectedNodo}
          onChange={handleSelectChange}
          width={{ base: "100%", md: "200px" }} // Ocupa el 100% de la pantalla en móviles y 200px en pantallas medianas
          mb={4}
          color="black"
          bg="white"
          borderColor="gray.600"
          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
          _hover={{ borderColor: "blue.400" }}
        >
          {/* Opciones de nodos disponibles */}
          {data.map((row) => (
            <option key={row.Nodo} value={row.Nodo}>
              Nodo {row.Nodo}
            </option>
          ))}
        </Select>
      </Box>

      {/* Contenedor para la tabla, con overflow automático para permitir scroll horizontal */}
      <Box overflowX={{ base: "auto", md: "unset" }} >
        <Table variant="simple" colorScheme="whiteAlpha" size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>Nodo</Th>
              <Th>Humedad</Th>
              <Th>Temperatura</Th>
              <Th>Presion</Th>
              <Th isNumeric>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((row) => (
              <Tr key={row.Nodo}>
                <Td>{row.Nodo}</Td>
                <Td>{row.Humedad}</Td>
                <Td>{row.Temperatura}</Td>
                <Td>{row.Presion}</Td>
                <Td isNumeric>{row.value}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default TablaPage;

