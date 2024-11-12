import React, { useState, useEffect } from "react";
import { Box, Table, Thead, Tr, Th, Tbody, Td, Button, Flex, Text, Center, useMediaQuery, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FaTemperatureHigh, FaTint, FaWind, FaClock } from "react-icons/fa";
import { GiWaterDrop, GiSpeedometer } from "react-icons/gi";
import axios from 'axios';
import { useAuth } from '../components/AuthContext';

function TablaPage({ onRowSelection }) {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "value", direction: "asc" });
  const [page, setPage] = useState(1);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [isMtsXSegundo, setIsMtsXSegundo] = useState(false);
  const [isCm, setIsCm] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 48em)");
  const { colorMode } = useColorMode();  // Hook para el modo de color
  const rowsPerPage = isMobile ? 1 : 3;
  const { token } = useAuth();

  const buttonDefaultColor = useColorModeValue('gray.300', 'gray.600');
  const buttonHoverColor = useColorModeValue('rgb(0, 31, 63)', 'rgb(255, 130, 37)');
  const buttonShadow = useColorModeValue("5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff", "2px 2px 3px rgba(0, 0, 0, 0.3)");

  useEffect(() => {
    let timeoutId;
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/clima/nodos/resumen' , {headers: { Authorization: `Bearer ${token}`}});
        const resumenData = response.data.summary;
        
        const formattedData = resumenData.map((item) => ({
          Nodo: item.id_nodo,
          Temperatura: item.last_temperature ?? '--',
          Humedad: item.last_humidity ?? '--',
          Presion: item.last_pressure ?? '--',
          Precipitacion: item.last_precipitation ?? '--',
          Viento: item.last_wind ?? '--',
          Timestamp: item.last_update ? new Date(item.last_update) : '--'
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error al obtener los datos del endpoint de resumen:', error);
      }
    };
    fetchData();
    const setupTimeout = () => {
      timeoutId = setTimeout(() => {
        fetchData();
        setupTimeout(); 
      }, 10000); 
    };

    setupTimeout();

    return () => clearTimeout(timeoutId);
  }, []);

  const handleSort = (columnKey) => {
    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
  });

  const paginatedData = sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleRowClick = (index) => {
    if (selectedRowIndex === index) {
      setSelectedRowIndex(null);
    } else {
      setSelectedRowIndex(index);
      onRowSelection(index);
    }
  };


  const formatNumber = (number) => {
    if (number === null || isNaN(number)) {
      return '--';
    }
    return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(number);
  };
  
  const formatTime = (timestamp) => {
    if (!timestamp || isNaN(timestamp.getTime())) return "--";
    return timestamp.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
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
    <Box 
      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}  // Fondo dinámico según el tema
      color={colorMode === 'light' ? 'black' : 'white'}
      p={isMobile ? 1 : 2} 
      borderRadius="md" 
      boxShadow="md" 
      width="100%"
    >
      <Box overflowX="auto">
        <Table variant="simple" colorScheme="whiteAlpha" size={isMobile ? "xs" : "md"}>
          <Thead display={{ base: "none", md: "table-header-group" }}>
            <Tr>
              <Th onClick={() => handleSort("Nodo")}>
                <Center color={colorMode === 'light' ? 'black' : 'white'}>
                  Nodo
                  {sortConfig.key === "Nodo" && (
                    <span style={{ marginLeft: "5px" }}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
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
                  <FaTemperatureHigh size="1.5em" style={{ marginRight: "5px" }} />
                  Temperatura
                  <Button
                    title={isFahrenheit ? "Convertir a °C" : "Convertir a °F"}
                    size="xs"
                    ml={2} 
                    background={buttonDefaultColor}
                    boxShadow={buttonShadow}
                    _hover={{ 
                        background: buttonHoverColor, 
                        color: "lightgray"
                    }}
                    onClick={() => setIsFahrenheit(!isFahrenheit)}
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
                    title={isMtsXSegundo ? "Convertir a km/h" : "Convertir a m/s"}
                    size="xs"
                    ml={2} 
                    background={buttonDefaultColor}
                    boxShadow={buttonShadow}
                    _hover={{ 
                        background: buttonHoverColor, 
                        color: "lightgray"
                    }}
                    onClick={() => setIsMtsXSegundo(!isMtsXSegundo)}
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
                    title={isCm ? "Convertir a mm" : "Convertir a cm"}
                    size="xs"
                    ml={2} 
                    background={buttonDefaultColor}
                    boxShadow={buttonShadow}
                    _hover={{ 
                        background: buttonHoverColor, 
                        color: "lightgray"
                    }}
                    onClick={() => setIsCm(!isCm)}
                  >
                    {isCm ? "mm" : "cm"}
                  </Button>
                </Center>
              </Th>
              <Th onClick={() => handleSort("Timestamp")}>
                <Center color={colorMode === 'light' ? 'black' : 'white'}>
                  <FaClock size="1.5em" style={{ marginRight: "5px" }} />
                  Hora
                  {sortConfig.key === "Timestamp" && (
                    <span style={{ marginLeft: "5px" }}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Center>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.length === 0 ? (
              <Tr>
                <Td colSpan={6} textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>
                  No hay datos para mostrar
                </Td>
              </Tr>
            ) : (
              paginatedData.map((row, index) => (
                <Tr
                  key={index}
                  onClick={() => handleRowClick(index)}
                  bg={colorMode === 'light' ? 'white' : 'gray.700'} 
                  color={colorMode === 'light' ? 'black' : 'white'}
                  _hover={{ backgroundColor: colorMode === 'light' ? "gray.100" : "gray.700" }}
                  display={{ base: "flex", md: "table-row" }} 
                  flexDirection={{ base: "column", md: "row" }} 
                >
                  <Td 
                    textAlign="center" 
                    _before={{ 
                      content: '"Nodo: "', 
                      fontWeight: "bold", 
                      display: { base: "inline-block", md: "none" },
                      marginRight: "4px"
                    }}
                  >
                    {row.Nodo}
                  </Td>
                  <Td 
                    textAlign="center"
                    _before={{ 
                      content: '"Humedad: "', 
                      fontWeight: "bold", 
                      display: { base: "inline-block", md: "none" },
                      marginRight: "4px"
                    }}
                  >
                    {formatNumber(row.Humedad)} {row.Humedad === "--" ? '' : '%'}
                  </Td>
                  <Td
                    textAlign="center"
                    _before={{ 
                      content: '"Temperatura: "', 
                      fontWeight: "bold", 
                      display: { base: "inline-block", md: "none" },
                      marginRight: "4px"
                    }}
                  >
                    {isFahrenheit 
                      ? formatNumber(convertToFahrenheit(row.Temperatura)) + (row.Temperatura === "--" ? '' : '°F') 
                      : formatNumber(row.Temperatura) + (row.Temperatura === "--" ? '' : "°C")}
                  </Td>
                  <Td 
                   textAlign="center"
                   _before={{ 
                     content: '"Presión: "', 
                     fontWeight: "bold", 
                     display: { base: "inline-block", md: "none" },
                      marginRight: "4px"
                   }}
                  >
                    {formatNumber(row.Presion)} {row.Presion === "--" ? '' : 'hPa'}
                  </Td>
                  <Td 
                    textAlign="center"
                    _before={{ 
                      content: '"Viento: "', 
                      fontWeight: "bold", 
                      display: { base: "inline-block", md: "none" },
                      marginRight: "4px"
                    }}
                  >
                    {isMtsXSegundo 
                      ? formatNumber(convertToMetroXSeg(row.Viento)) + (row.Viento === "--" ? '' : 'm/s') 
                      : formatNumber(row.Viento) + (row.Viento === "--" ? '' : 'km/h')}
                  </Td>
                  <Td 
                    textAlign="center"
                    _before={{ 
                      content: '"Precipitación: "', 
                      fontWeight: "bold", 
                      display: { base: "inline-block", md: "none" },
                      marginRight: "4px"
                    }}
                  >
                    {isCm 
                      ? formatNumber(convertToCentimeters(parseFloat(row.Precipitacion))) + (row.Precipitacion === "--" ? '' : 'cm') 
                      : formatNumber(row.Precipitacion) + (row.Precipitacion === "--" ? '' : 'mm')}
                  </Td>
                  <Td 
                    textAlign="center"
                    _before={{ 
                      content: '"Hora: "', 
                      fontWeight: "bold", 
                      display: { base: "inline-block", md: "none" },
                      marginRight: "4px"
                    }}
                  >{formatTime(row.Timestamp)} Hs</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
      <Flex justify="center" mt={6}>
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          isDisabled={page === 1}
          size="sm" 
          mr={2} 
          background={page === 1 ? 'gray.500' : buttonDefaultColor} 
          color={page === 1 ? 'gray.200' : (colorMode === 'light' ? 'black' : 'white')}
          borderRadius="6px"
          boxShadow={page === 1 ? "none" : buttonShadow}
          _hover={page === 1 ? {} : { 
            background: buttonHoverColor, 
            color: "lightgray"
          }}
        >
          Anterior
        </Button>
        <Text mx={4}>Página {page} de {totalPages}</Text>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          isDisabled={page === totalPages || totalPages === 0}
          size="sm" 
          ml={2} 
          background={(page === totalPages || totalPages === 0) ? 'gray.500' : buttonDefaultColor}
          color={(page === totalPages || totalPages === 0) ? 'gray.200' : (colorMode === 'light' ? 'black' : 'white')}
          borderRadius="6px"
          boxShadow={(page === totalPages || totalPages === 0) ? "none" : buttonShadow}
          _hover={(page === totalPages || totalPages === 0) ? {} : { 
            background: buttonHoverColor, 
            color: "lightgray"
          }}
        >
          Siguiente
        </Button>
      </Flex>
    </Box>
  );
}

export default TablaPage;