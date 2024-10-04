import React, { useState } from "react";
import { Box, Table, Thead, Tr, Th, Tbody, Td, Select, Button, Flex, useMediaQuery, Text, Center } from "@chakra-ui/react";

function TablaPage({ data, onRowSelection }) {
  const [selectedNodo, setSelectedNodo] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "value", direction: "asc" });
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isMobile] = useMediaQuery("(max-width: 48em)");

  const rowsPerPage = isMobile ? 5 : 8;

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedNodo(value === "" ? "" : parseInt(value, 10));
    setPage(1);
    setSelectedRows([]);
  };

  const handleSort = (columnKey) => {
    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });
  };

  // Filtrar y ordenar datos según la selección del nodo y el orden
  const filteredData = selectedNodo === "" ? data : data.filter((row) => row.Nodo === selectedNodo);
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
  });

  // Paginación de datos
  const paginatedData = sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleRowClick = (index) => {
    const newSelectedRows = selectedRows.includes(index)
      ? selectedRows.filter((i) => i !== index)
      : [...selectedRows, index];
    setSelectedRows(newSelectedRows);
    onRowSelection(newSelectedRows); // Llamar a la función de callback con las filas seleccionadas
  };

  const formatNumber = (number) => new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 }).format(number);
  const uniqueNodos = [...new Set(data.map(item => item.Nodo))];
  const formatTime = (time) => {
    if (!time || typeof time !== "string") return "N/A"; 
  
    try {
      const datePart = time.split(".")[0]; 
      const dateObject = new Date(datePart.replace(" ", "T"));
      return dateObject.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    } catch (error) {
      console.error("Error formateando el tiempo:", error, "Valor de time:", time);
      return "N/A"; // Si ocurre un error, retornar un valor por defecto
    }
  };

  return (
    <Box bg="gray.700" color="white" p={isMobile ? 2 : 4} borderRadius="md" boxShadow="md">
      <Box mb={4} textAlign="center">
        <Select
          value={selectedNodo}
          onChange={handleSelectChange}
          mb={3}
          bg="gray.800"
          color="gray.200"
          borderColor="gray.600"
          _hover={{ bg: "gray.700" }}
          _focus={{ borderColor: "gray.500" }}
        >
          <option style={{ backgroundColor: "#2D3748", color: "white" }} value="">Seleccionar Nodo</option>
          {uniqueNodos.map(nodo => (
            <option key={nodo} style={{ backgroundColor: "#2D3748", color: "white" }} value={nodo}>
              Nodo {nodo}
            </option>
          ))}
        </Select>
      </Box>

      <Box overflowX="auto">
        <Table variant="simple" colorScheme="whiteAlpha" size={isMobile ? "sm" : "md"}>
          <Thead>
            <Tr>
              <Th onClick={() => handleSort("Nodo")} cursor="pointer">
                Nodo {sortConfig.key === "Nodo" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </Th>
              <Th onClick={() => handleSort("Humedad")} cursor="pointer">
                Humedad {sortConfig.key === "Humedad" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </Th>
              <Th onClick={() => handleSort("Temperatura")} cursor="pointer">
                Temp. {sortConfig.key === "Temperatura" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </Th>
              <Th display={{ base: "none", md: "table-cell" }} onClick={() => handleSort("Presion")} cursor="pointer">
                Presión {sortConfig.key === "Presion" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </Th>
              <Th onClick={() => handleSort("value")} isNumeric cursor="pointer">
                Time {sortConfig.key === "value" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.map((row, index) => (
              <Tr
                key={index}
                onClick={() => handleRowClick(index)}
                bg={selectedRows.includes(index) ? "blue.500" : "transparent"}
                color={selectedRows.includes(index) ? "white" : "inherit"}
                cursor="pointer"
              >
                <Td textAlign="center">{row.Nodo}</Td>
                <Td textAlign="center">{formatNumber(row.Humedad)}</Td>
                <Td textAlign="center">{formatNumber(row.Temperatura)}</Td>
                <Td textAlign="center" display={{ base: "none", md: "table-cell" }}>{formatNumber(row.Presion)}</Td>
                <Td textAlign="center">{formatTime(row.time)}</Td> {/* Ajustado para usar el campo 'time' */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex justifyContent="center" alignItems="center" mt={4} flexWrap="wrap" gap={2}>
        <Button onClick={handlePreviousPage} isDisabled={page <= 1} size={isMobile ? "sm" : "md"}>
          Anterior
        </Button>
        <Text as="span" mx={isMobile ? 2 : 4}>
          Página {page} de {totalPages}
        </Text>
        <Button onClick={handleNextPage} isDisabled={page >= totalPages} size={isMobile ? "sm" : "md"}>
          Siguiente
        </Button>
      </Flex>
    </Box>
  );
}

export default TablaPage;
