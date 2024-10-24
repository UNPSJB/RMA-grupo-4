import React, { useState, useEffect } from 'react';
import { Box, Heading, Button, Input, Flex, Table, Text, Thead, Tr, Th, Tbody, Td, Center, useColorMode } from '@chakra-ui/react';
import { FaTemperatureHigh, FaTint, FaWind, FaCalendarAlt } from 'react-icons/fa';
import { GiSpeedometer } from 'react-icons/gi';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useColorModeValue } from "@chakra-ui/react";

const DescargasHistoricas = () => {
  const { colorMode } = useColorMode();
  const [historicalData, setHistoricalData] = useState([]);
  const [page, setPage] = useState(1); // Estado para la paginación
  const [rowsPerPage] = useState(10); // Número de filas por página
  const [isFahrenheit, setIsFahrenheit] = useState(false); // Para conversión de temperatura
  const [isMtsXSegundo, setIsMtsXSegundo] = useState(false); // Para conversión de viento
  const today = new Date();
  const argentinaOffset = today.getTimezoneOffset() + 180; // UTC-3
  const argentinaDate = new Date(today.getTime() - argentinaOffset * 60000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(argentinaDate);
  const [endDate, setEndDate] = useState(argentinaDate);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/clima/nodos/historico');
        setHistoricalData(response.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    fetchData();
  }, []);

  const filteredData = historicalData.flatMap(row => row.humidity.map((humidityRow, i) => ({
    id_nodo: row.id_nodo,
    humidity: humidityRow.value,
    temperature: row.temperature[i]?.value || 0,
    pressure: row.pressure[i]?.value || 0,
    wind: row.wind[i]?.value || 0,
    timestamp: humidityRow.timestamp,
  }))).filter(row => {
    const rowDate = new Date(row.timestamp);
    return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const formatHour = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const downloadCSV = () => {
    const csvContent = filteredData.map(row => {
      const date = new Date(row.timestamp);
      const year = date.getFullYear();
      const month = (`0${date.getMonth() + 1}`).slice(-2);
      const day = (`0${date.getDate()}`).slice(-2);
      const hour = (`0${date.getHours()}`).slice(-2);

      return `${row.id_nodo},${year}-${month}-${day},${hour},${Number(row.temperature || 0).toFixed(2)},${Number(row.humidity || 0).toFixed(2)},${Number(row.pressure || 0).toFixed(2)},${Number(row.wind || 0).toFixed(2)}`;
    });

    const header = 'NODO,Fecha,Hora,Temperatura,Humedad,Presion,Viento\n';
    const blob = new Blob([header + csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'historical_data.csv');
  };

  return (
    <Box bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'} borderRadius="md" boxShadow="md" width="100%">
      <Heading as="h1" textAlign="center" p="8">Tabla Datos Históricos</Heading>

      <Box p={6} bg={useColorModeValue('white', 'gray.800')} color={useColorModeValue('black', 'white')} borderRadius="md" boxShadow="md">
        <Flex justify="space-evenly" mb={8} wrap="wrap" gap={4}>
          <Box>
            <label htmlFor="start-date" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block', fontSize:"20px" }}>Fecha Inicio:</label>
            <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Box>
          <Box>
            <label htmlFor="end-date" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block', fontSize:"20px"}}>Fecha Fin:</label>
            <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} />
          </Box>
            <Button  mt="10" colorScheme="teal" size="md" onClick={downloadCSV}>Descargar CSV</Button>
        </Flex>

        <Box overflowX="auto" bg="gray.700" borderRadius="md" boxShadow="lg" p={7}>
  <Table variant="striped" colorScheme="teal" borderRadius="md">
    <Thead>
      <Tr>
        <Th textAlign="center" color="white">
          Nodo
        </Th>
        <Th textAlign="center" color="white">
             Humedad
        </Th>
        <Th textAlign="center" color="white">
          <Center>
            <FaTemperatureHigh style={{ marginRight: "5px" }} /> Temperatura
            <Button
              size="xs"
              colorScheme="teal"
              onClick={() => setIsFahrenheit(!isFahrenheit)}
              ml={2}
            >
              {isFahrenheit ? "°C" : "°F"}
            </Button>
          </Center>
        </Th>
        <Th textAlign="center" color="white">
          Presión
        </Th>
        <Th textAlign="center" color="white">
            Viento
            <Button
              size="xs"
              colorScheme="teal"
              onClick={() => setIsMtsXSegundo(!isMtsXSegundo)}
              ml={2}
            >
              {isMtsXSegundo ? "km/h" : "m/s"}
            </Button>
        </Th>
        <Th textAlign="center" color="white">
         Fecha
        </Th>
        <Th textAlign="center" color="white">
          Hora
        </Th>
      </Tr>
    </Thead>
    <Tbody>
      {paginatedData.length === 0 ? (
        <Tr>
          <Td colSpan={7} textAlign="center">No hay datos disponibles</Td>
        </Tr>
      ) : (
        paginatedData.map((row, index) => (
          <Tr key={`${row.id_nodo}-${index}`} bg={index % 2 === 0 ? "gray.700" : "gray.600"}>
            <Td textAlign="center">{row.id_nodo}</Td>
            <Td textAlign="center">{Number(row.humidity).toFixed(2)}%</Td>
            <Td textAlign="center">{Number(row.temperature).toFixed(2)} {isFahrenheit ? "°F" : "°C"}</Td>
            <Td textAlign="center">{Number(row.pressure).toFixed(2)} hPa</Td>
            <Td textAlign="center">{Number(row.wind).toFixed(2)} {isMtsXSegundo ? "m/s" : "km/h"}</Td>
            <Td textAlign="center">{formatDate(row.timestamp)}</Td>
            <Td textAlign="center">{formatHour(row.timestamp)}</Td>
          </Tr>
        ))
      )}
    </Tbody>
  </Table>
</Box>


        <Flex justify="center" mt={4}>
        <Button p={4}onClick={handlePreviousPage} disabled={page === 1} colorScheme="teal" size="sm" mr={2}>
          Anterior
        </Button>
        <Text fontSize="sm" alignSelf="center">
          Página {page} de {totalPages}
        </Text>
        <Button p={4} onClick={handleNextPage} disabled={page === totalPages} colorScheme="teal" size="sm" ml={2}>
          Siguiente
        </Button>
      </Flex>
      </Box>
    </Box>
    
 
  );
};

export default DescargasHistoricas;
