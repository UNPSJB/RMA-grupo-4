import React, { useState, useEffect } from 'react';
import { Box, Heading, Button, Input, Flex, Table, Text, Thead, Tr, Th, Tbody, Td, Center, useColorMode } from '@chakra-ui/react';
import { FaTemperatureHigh, FaTint, FaWind, FaClock } from 'react-icons/fa';
import { GiSpeedometer, GiWaterDrop } from 'react-icons/gi';
import axios from 'axios';
import { saveAs } from 'file-saver';

const DescargasHistoricas = () => {
  const { colorMode } = useColorMode();
  const [historicalData, setHistoricalData] = useState([]);
  const [page, setPage] = useState(1); // Estado para la paginación
  const [rowsPerPage] = useState(10); // Número de filas por página
  const [isFahrenheit, setIsFahrenheit] = useState(false); // Para conversión de temperatura
  const [isMtsXSegundo, setIsMtsXSegundo] = useState(false); // Para conversión de viento
  const [isCm, setIsCm] = useState(false);
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
  
  const filteredData = historicalData
  .flatMap(row => row.humidity.map((humidityRow, i) => ({
    id_nodo: row.id_nodo,
    humidity: humidityRow.value,
    temperature: row.temperature[i]?.value || 0,
    pressure: row.pressure[i]?.value || 0,
    precipitation: row.precipitation[i]?.value || 0,
    wind: row.wind[i]?.value || 0,
    timestamp: humidityRow.timestamp,
  })))
  .filter(row => {
    const rowDate = new Date(row.timestamp);
    return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
  })
  .sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);

    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;

    return a.id_nodo - b.id_nodo;
  }).reverse(); 


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

      return `${row.id_nodo},${year}-${month}-${day},${hour},${Number(row.temperature || 0).toFixed(2)},${Number(row.humidity || 0).toFixed(2)},${Number(row.pressure || 0).toFixed(2)},${Number(row.wind || 0).toFixed(2)},${Number(row.precipitation || 0).toFixed(2)}`;
    });

    const header = 'NODO,Fecha,Hora,Temperatura,Humedad,Presion,Viento,Precipitacion\n';
    const blob = new Blob([header + csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'historical_data.csv');
  };
  const formatNumber = (number) => {
    if (number === null || isNaN(number)) {
      return '--';
    }
    return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(number);
  };

  const convertToFahrenheit = (celsius) => {
    if (celsius === '--') return '--';
    return (celsius * 9/5 + 32).toFixed(2);
  };

  const convertToMetroXSeg = (kmh) => {
    if (kmh === '--') return '--';
    return (kmh / 3.6).toFixed(2);  // Conversión de km/h a m/s
  };

  const convertToCentimeters = (mm) => {
    if (mm === '--') return '--';
    return (mm / 10).toFixed(2);  // Conversión de mm a cm
  };
  
  return (
    <Box bg={colorMode === 'light' ? 'gray.100' : 'gray.800'} color={colorMode === 'light' ? 'black' : 'white'} borderRadius="md" boxShadow="md" width="100%">
      <Heading as="h1" textAlign="center" p="8">Tabla Datos Históricos</Heading>

      <Flex justify="space-evenly" mb={8} wrap="wrap" gap={4} >
          <Box>
            <label htmlFor="start-date" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block', fontSize:"20px" }}>Fecha Inicio:</label>
            <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Box>
          <Box>
            <label htmlFor="end-date" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block', fontSize:"20px"}}>Fecha Fin:</label>
            <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} max={argentinaDate}/>
          </Box>
            <Button  mt="10" colorScheme="teal" size="md" onClick={downloadCSV}>Descargar CSV</Button>
        </Flex>

      <Box bg={colorMode === 'light' ? 'gray.300' : 'gray.600'} p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
        <Box overflowX="auto" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderRadius="md" boxShadow="lg" p={7} >
          <Table variant="simple" colorScheme="whiteAlpha" >
            <Thead>
              <Tr>
                <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>
                  Nodo
                </Th>
                <Th >
                <Center color={colorMode === 'light' ? 'black' : 'white'}>
                  <FaClock size="1.5em" style={{ marginRight: "5px" }} />
                  Fecha
                </Center>
                </Th>
                <Th>
                  <Center color={colorMode === 'light' ? 'black' : 'white'}>
                    <FaTint size="1.5em" style={{ marginRight: "5px" }} />
                    Humedad
                  </Center>
                </Th>
                <Th>
                  <Center color={colorMode === 'light' ? 'black' : 'white'}>
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
                <Th display={{ base: "none", md: "table-cell" }}>
                  <Center color={colorMode === 'light' ? 'black' : 'white'}>
                    <GiSpeedometer size="1.5em" style={{ marginRight: "5px" }} />
                    Presión
                  </Center>
                </Th>
                <Th>
                  <Center color={colorMode === 'light' ? 'black' : 'white'}>
                    <FaWind size="1.5em" style={{ marginRight: "5px" }} />
                    Viento
                    <Button
                      size="xs"
                      colorScheme="teal"
                      onClick={() => setIsMtsXSegundo(!isMtsXSegundo)}
                      ml={2}
                    >
                      {isMtsXSegundo ? "km/h" : "m/s"}
                    </Button>
                  </Center>
                </Th>
                <Th>
                <Center color={colorMode === 'light' ? 'black' : 'white'}>
                  <GiWaterDrop size="1.5em" style={{ marginRight: "5px" }} />
                  Precipitación
                  <Button
                    size="xs"
                    colorScheme="teal"
                    onClick={() => setIsCm(!isCm)}
                    ml={2}
                  >
                    {isCm ? "mm" : "cm"}
                  </Button>
                </Center>
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
                  <Tr 
                    key={`${row.id_nodo}-${index}`}
                    bg={colorMode === 'light' ? 'white' : 'gray.700'} 
                    color={colorMode === 'light' ? 'black' : 'white'}
                  >
                    <Td textAlign="center">{row.id_nodo}</Td>
                    <Td textAlign="center">{formatDate(row.timestamp)} {formatHour(row.timestamp)}</Td>
                    <Td textAlign="center">{formatNumber(row.humidity)} {row.humidity == "--" ? '' : '%'}</Td>
                    <Td textAlign="center">
                      {isFahrenheit 
                        ? formatNumber(convertToFahrenheit(row.temperature)) + (row.temperature == "--" ? '' : '°F') 
                        : formatNumber(row.temperature) + (row.temperature == "--" ?  '' : "°C"
                        )}
                    </Td>
                    <Td textAlign="center" display={{ base: "none", md: "table-cell" }}>
                      {formatNumber(row.pressure)} {row.pressure == "--" ? '' : 'hPa'}
                    </Td>
                    <Td textAlign="center">
                      {isMtsXSegundo 
                        ? formatNumber(convertToMetroXSeg(row.wind)) + (row.wind == "--" ? '' : 'm/s') 
                        : formatNumber(row.wind) + (row.wind == "--" ? '' : 'km/h')}
                    </Td>
                    <Td textAlign="center">
                      {isCm 
                        ? formatNumber(convertToCentimeters(parseFloat(row.precipitation))) + (row.precipitation == "--" ? '' : 'cm') 
                        : formatNumber(row.precipitation) + (row.precipitation == "--" ? '' : 'mm')}
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
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
    </Box>
  );
};

export default DescargasHistoricas;
