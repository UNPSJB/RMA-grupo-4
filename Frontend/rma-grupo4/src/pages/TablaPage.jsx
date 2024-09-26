import React, {useState} from 'react';
import { Box, Heading, Table, Thead, Tr, Th, Tbody, Td, Select } from '@chakra-ui/react';
import NavigationButtons from '../components/NavigationButtons';
import Footer from '../components/Footer';

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
    ? data : data.filter((row) => row.Nodo === selectedNodo);
    
  return (
    <Box bg="gray.800" color="white" minH="100vh" p={4}>
      {/* Componente de botones de navegación */}
      <NavigationButtons />
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Datos en Tabla
      </Heading>

      {/* Select para seleccionar el Nodo */}
      <Box mb={4} textAlign="center">
          <Select
            placeholder="Seleccione un nodo"
            value={selectedNodo}
            onChange={handleSelectChange}
            width="200px"
            mb={4}
            color="black"
            bg="white"
            borderColor="gray.600" // Color del borde
            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }} // Efecto al enfocar
            _hover={{ borderColor: "blue.400" }} // Efecto al pasar el mouse
          >
          {/* Opciones de nodos disponibles */}
          {data.map((row) => (
            <option key={row.Nodo} value={row.Nodo}>
              Nodo {row.Nodo}
            </option>
          ))}
        </Select>
      </Box>

      {/* Tabla */}
      <Table variant="simple" colorScheme="whiteAlpha">
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
      <Footer />
    </Box>
  );
}

export default TablaPage;