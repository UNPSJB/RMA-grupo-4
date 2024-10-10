import React, { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Select,
  Button,
  Flex,
  useMediaQuery,
  Text,
  Center,
} from "@chakra-ui/react";
import { FaTemperatureHigh, FaTint, FaWind, FaClock } from "react-icons/fa";
import { GiWaterDrop, GiSpeedometer } from "react-icons/gi";

function TablaPage({ data, onRowSelection }) {
  const [selectedNodo, setSelectedNodo] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "value", direction: "asc" });
  const [page, setPage] = useState(1);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null); // Solo un índice seleccionado
  const [isMobile] = useMediaQuery("(max-width: 48em)");

  const rowsPerPage = isMobile ? 5 : 8;

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedNodo(value === "" ? "" : parseInt(value, 10));
    setPage(1);
    setSelectedRowIndex(null); // Resetear la selección cuando se cambia el nodo
  };

  const handleSort = (columnKey) => {
    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const filteredData = selectedNodo === "" ? data : data.filter((row) => row.Nodo === selectedNodo);
  const sortedData = [...filteredData].sort((a, b) => {
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
      setSelectedRowIndex(null); // Desmarcar si ya estaba seleccionado
    } else {
      setSelectedRowIndex(index); // Seleccionar la fila
      onRowSelection(index); // Llamar a la función de callback con la fila seleccionada
    }
  };

  const formatNumber = (number) =>
  new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(number);
  const uniqueNodos = [...new Set(data.map((item) => item.Nodo))];
  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A"; 
  
    if (!(timestamp instanceof Date)) {
      console.error("Error: timestamp no es un objeto Date válido.", timestamp);
      return "N/A";
    }
  
    if (isNaN(timestamp.getTime())) {
      console.error("Error: fecha inválida.", timestamp);
      return "N/A"; 
    }

    return timestamp.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  return (
    <Box bg="gray.700" color="white" p={isMobile ? 2 : 4} borderRadius="md" boxShadow="md">
      

      <Box overflowX="auto">
        <Table variant="simple" colorScheme="whiteAlpha" size={isMobile ? "xs" : "md"}>
          <Thead>
            <Tr>
              <Th
                onClick={() => handleSort("Nodo")}
                cursor="pointer"
                title="Nodo"
                _hover={{ backgroundColor: "gray.700", color: "cyan.400" }}
              >
                <Center color="white">
                  Nodo
                  {sortConfig.key === "Nodo" && (
                    <span style={{ marginLeft: "5px" }}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Center>
              </Th>
              <Th
                onClick={() => handleSort("Humedad")}
                cursor="pointer"
                title="Humedad"
                _hover={{ backgroundColor: "gray.700", color: "cyan.400" }}
              >
                <Center color="white">
                  <FaTint size="1.5em" style={{ marginRight: "5px", color: "white" }} /> {/* Ícono de Humedad */}
                  Humedad
                  {sortConfig.key === "Humedad" && (
                    <span style={{ marginLeft: "5px", color: "white" }}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Center>
              </Th>
              <Th
                onClick={() => handleSort("Temperatura")}
                cursor="pointer"
                title="Temperatura"
                _hover={{ backgroundColor: "gray.700", color: "cyan.400" }}
              >
                <Center color="white">
                  <FaTemperatureHigh size="1.5em" style={{ marginRight: "5px" }} /> {/* Ícono de Temperatura */}
                  Temperatura
                  {sortConfig.key === "Temperatura" && (
                    <span style={{ marginLeft: "5px" }}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Center>
              </Th>
              <Th
                display={{ base: "none", md: "table-cell" }}
                onClick={() => handleSort("Presion")}
                cursor="pointer"
                title="Presión"
                _hover={{ backgroundColor: "gray.700", color: "cyan.400" }}
              >
                <Center color="white">
                  <GiSpeedometer size="1.5em" style={{ marginRight: "5px" }} /> {/* Ícono de Presión */}
                  Presión
                  {sortConfig.key === "Presion" && (
                    <span style={{ marginLeft: "5px" }}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Center>
              </Th>
              <Th
                onClick={() => handleSort("Viento")}
                cursor="pointer"
                title="Viento"
                _hover={{ backgroundColor: "gray.700", color: "cyan.400" }}
              >
                <Center color="white">
                  <FaWind size="1.5em" style={{ marginRight: "5px" }} /> {/* Ícono de Viento */}
                  Viento
                  {sortConfig.key === "Viento" && (
                    <span style={{ marginLeft: "5px" }}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Center>
              </Th>
              <Th
                onClick={() => handleSort("Precipitacion")}
                cursor="pointer"
                title="Precipitación"
                _hover={{ backgroundColor: "gray.700", color: "cyan.400" }}
              >
                <Center color="white">
                  <GiWaterDrop size="1.5em" style={{ marginRight: "5px" }} /> {/* Ícono de Precipitación */}
                  Precipitación
                  {sortConfig.key === "Precipitacion" && (
                    <span style={{ marginLeft: "5px" }}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Center>
              </Th>
              <Th
                onClick={() => handleSort("Fecha")}
                cursor="pointer"
                title="Fecha"
                _hover={{ backgroundColor: "gray.700", color: "cyan.400" }}
              >
                <Center color="white">
                  <FaClock size="1.5em" style={{ marginRight: "5px" }} /> {/* Ícono de Fecha */}
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
                  <Td textAlign="center" display={{ base: "none", md: "table-cell" }}>
                    {formatNumber(row.Presion)} hPa
                  </Td>
                  <Td textAlign="center">{formatNumber(row.Viento)} km/h</Td>
                  <Td textAlign="center">{formatNumber(row.Precipitacion)} mm</Td>
                  <Td textAlign="center">{formatTime(row.Timestamp)}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      <Flex justify="space-around" mt={3} alignItems="center">
        <Button onClick={handlePreviousPage} isDisabled={page === 1}>
          Anterior
        </Button>
        <Text color="white">
          Página {page} de {totalPages}
        </Text>
        <Button onClick={handleNextPage} isDisabled={page === totalPages}>
          Siguiente
        </Button>
      </Flex>
    </Box>
  );
}

export default TablaPage;