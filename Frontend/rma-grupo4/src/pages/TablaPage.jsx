import React, { useState, useEffect } from "react";
import { Box, Table, Thead, Tr, Th, Tbody, Td, Button, Flex, Text, Center, useMediaQuery } from "@chakra-ui/react";
import { FaTemperatureHigh, FaTint, FaWind, FaClock } from "react-icons/fa";
import { GiWaterDrop, GiSpeedometer } from "react-icons/gi";
import axios from 'axios';  // Asegúrate de que axios esté importado

function TablaPage({ onRowSelection }) {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "value", direction: "asc" });
  const [page, setPage] = useState(1);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isMobile] = useMediaQuery("(max-width: 48em)");
  const rowsPerPage = isMobile ? 5 : 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/clima/nodos/resumen');
        const resumenData = response.data.summary;

        const formattedData = resumenData.map((item) => ({
          Nodo: item.id_nodo,
          Temperatura: item.last_temperature ?? 'N/A',
          Humedad: item.last_humidity ?? 'N/A',
          Presion: item.last_pressure ?? 'N/A',
          Precipitacion: item.last_precipitation ?? 'N/A',
          Viento: item.last_wind ?? 'N/A',
          Timestamp: item.last_update ? new Date(item.last_update) : 'N/A'
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error al obtener los datos del endpoint de resumen:', error);
      }
    };
    fetchData();
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

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleRowClick = (index) => {
    if (selectedRowIndex === index) {
      setSelectedRowIndex(null);
    } else {
      setSelectedRowIndex(index);
      onRowSelection(index);
    }
  };

  const formatNumber = (number) => new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(number);
  const formatTime = (timestamp) => {
    if (!timestamp || isNaN(timestamp.getTime())) return "N/A";
    return timestamp.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  return (
    <Box bg="gray.700" color="white" p={isMobile ? 1 : 2} borderRadius="md" boxShadow="md" width="100%">
      <Box overflowX="auto">
        <Table variant="simple" colorScheme="whiteAlpha" size={isMobile ? "xs" : "md"}>
          <Thead>
            <Tr>
              <Th onClick={() => handleSort("Nodo")}>
                <Center color="white">
                  Nodo
                  {sortConfig.key === "Nodo" && (
                    <span style={{ marginLeft: "5px" }}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Center>
              </Th>
              <Th onClick={() => handleSort("Humedad")}>
                <Center color="white">
                  <FaTint size="1.5em" style={{ marginRight: "5px" }} />
                  Humedad
                  {sortConfig.key === "Humedad" && (
                    <span style={{ marginLeft: "5px" }}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Center>
              </Th>
              <Th onClick={() => handleSort("Temperatura")}>
                <Center color="white">
                  <FaTemperatureHigh size="1.5em" style={{ marginRight: "5px" }} />
                  Temperatura
                  {sortConfig.key === "Temperatura" && (
                    <span style={{ marginLeft: "5px" }}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Center>
              </Th>
              <Th onClick={() => handleSort("Presion")} display={{ base: "none", md: "table-cell" }}>
                <Center color="white">
                  <GiSpeedometer size="1.5em" style={{ marginRight: "5px" }} />
                  Presión
                  {sortConfig.key === "Presion" && (
                    <span style={{ marginLeft: "5px" }}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Center>
              </Th>
              <Th onClick={() => handleSort("Viento")}>
                <Center color="white">
                  <FaWind size="1.5em" style={{ marginRight: "5px" }} />
                  Viento
                  {sortConfig.key === "Viento" && (
                    <span style={{ marginLeft: "5px" }}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Center>
              </Th>
              <Th onClick={() => handleSort("Precipitacion")}>
                <Center color="white">
                  <GiWaterDrop size="1.5em" style={{ marginRight: "5px" }} />
                  Precipitación
                  {sortConfig.key === "Precipitacion" && (
                    <span style={{ marginLeft: "5px" }}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Center>
              </Th>
              <Th onClick={() => handleSort("Fecha")}>
                <Center color="white">
                  <FaClock size="1.5em" style={{ marginRight: "5px" }} />
                  Fecha
                  {sortConfig.key === "Fecha" && (
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
                <Td colSpan={6} textAlign="center" color="white">
                  No hay datos para mostrar
                </Td>
              </Tr>
            ) : (
              paginatedData.map((row, index) => (
                <Tr
                  key={index}
                  onClick={() => handleRowClick(index)}
                  bg={selectedRowIndex === index ? "gray.600" : "transparent"}
                  _hover={{ backgroundColor: "gray.600" }}
                >
                  <Td textAlign="center">{row.Nodo}</Td>
                  <Td textAlign="center">{formatNumber(row.Humedad)} %</Td>
                  <Td textAlign="center">{formatNumber(row.Temperatura)} °C</Td>
                  <Td textAlign="center" display={{ base: "none", md: "table-cell" }}>{formatNumber(row.Presion)} hPa</Td>
                  <Td textAlign="center">{formatNumber(row.Viento)} km/h</Td>
                  <Td textAlign="center">{formatNumber(row.Precipitacion)} mm</Td>
                  <Td textAlign="center">{formatTime(row.Timestamp)}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
      <Flex justify="center" mt={4}>
        <Button onClick={handlePreviousPage} disabled={page === 1} colorScheme="teal" size="sm" mr={2}>
          Anterior
        </Button>
        <Text fontSize="sm" alignSelf="center">
          Página {page} de {totalPages}
        </Text>
        <Button onClick={handleNextPage} disabled={page === totalPages} colorScheme="teal" size="sm" ml={2}>
          Siguiente
        </Button>
      </Flex>
    </Box>
  );
}

export default TablaPage;