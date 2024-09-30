import React, { useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Select,
  Text,
  Button,
} from "@chakra-ui/react";
import NavigationButtons from "../components/NavigationButtons";

function TablaPage() {
  // Datos simulados
  const data = [
    { Nodo: 1, Humedad: "4", Temperatura: "5", Presion: "6", value: 30.45 },
    { Nodo: 2, Humedad: "7", Temperatura: "8", Presion: "9", value: 22.34 },
    { Nodo: 3, Humedad: "10", Temperatura: "11", Presion: "12", value: 27.89 },
    { Nodo: 3, Humedad: "10", Temperatura: "11", Presion: "12", value: 27.89 },
    { Nodo: 3, Humedad: "10", Temperatura: "11", Presion: "12", value: 27.89 },
    { Nodo: 1, Humedad: "10", Temperatura: "11", Presion: "12", value: 27.89 },
    { Nodo: 3, Humedad: "10", Temperatura: "11", Presion: "12", value: 27.89 },
    { Nodo: 2, Humedad: "10", Temperatura: "11", Presion: "12", value: 27.89 },
  ];

  // Estado para almacenar el nodo seleccionado
  const [selectedNodo, setSelectedNodo] = useState("");
  // Estado para la columna seleccionada y el orden de la tabla
  const [sortConfig, setSortConfig] = useState({
    key: "value",
    direction: "asc",
  });
  // Estado para la página actual (paginación)
  const [page, setPage] = useState(1);
  const rowsPerPage = 5; // Número de filas por página
  // Estado para las filas seleccionadas
  const [selectedRows, setSelectedRows] = useState([]);

  // Función para manejar el cambio del nodo
  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedNodo(value === "" ? "" : parseInt(value, 10));
    setPage(1); // Reiniciar a la página 1 cuando se selecciona un nuevo nodo
    setSelectedRows([]); // Limpiar selección al cambiar nodo
  };

  // Función para ordenar por cualquier columna
  const handleSort = (columnKey) => {
    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });
  };

  // Filtrar los datos: si no hay ningún nodo seleccionado, mostrar todos
  const filteredData =
    selectedNodo === ""
      ? data
      : data.filter((row) => row.Nodo === selectedNodo);

  // Ordenar los datos dinámicamente según la columna seleccionada
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
  });

  // Paginación: Obtener los datos de la página actual
  const paginatedData = sortedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Número total de páginas
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // Funciones para avanzar o retroceder páginas, con control de límites
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Manejar la selección de fila
  const handleRowClick = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index)); // Desseleccionar si ya está seleccionado
    } else {
      setSelectedRows([...selectedRows, index]); // Seleccionar fila
    }
  };

  return (
    <Box bg="gray.800" color="white" minH="100vh" p={{ base: 2, md: 4 }}>
      <NavigationButtons />
      <Heading
        as="h1"
        size={{ base: "lg", md: "xl" }}
        mb={6}
        textAlign="center"
      >
        Datos en Tabla
      </Heading>

      <Box mb={4} textAlign="center">
        <Select
          placeholder="Seleccione un nodo"
          value={selectedNodo}
          onChange={handleSelectChange}
          width={{ base: "100%", md: "200px" }}
          mb={4}
          color="black"
          bg="white"
          borderColor="gray.600"
          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
          _hover={{ borderColor: "blue.400" }}
        >
          {[...new Set(data.map((row) => row.Nodo))].map((nodo) => (
            <option key={nodo} value={nodo}>
              Nodo {nodo}
            </option>
          ))}
        </Select>
      </Box>

      <Box overflowX={{ base: "auto", md: "unset" }}>
        <Table
          variant="simple"
          colorScheme="whiteAlpha"
          size={{ base: "sm", md: "md" }}
        >
          <Thead>
            <Tr>
              <Th onClick={() => handleSort("Nodo")} cursor="pointer">
                Nodo{" "}
                {sortConfig.key === "Nodo" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </Th>
              <Th onClick={() => handleSort("Humedad")} cursor="pointer">
                Humedad{" "}
                {sortConfig.key === "Humedad" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </Th>
              <Th onClick={() => handleSort("Temperatura")} cursor="pointer">
                Temperatura{" "}
                {sortConfig.key === "Temperatura" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </Th>
              <Th onClick={() => handleSort("Presion")} cursor="pointer">
                Presion{" "}
                {sortConfig.key === "Presion" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </Th>
              <Th
                onClick={() => handleSort("value")}
                isNumeric
                cursor="pointer"
              >
                Valor{" "}
                {sortConfig.key === "value" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
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

      <Box textAlign="center" mt={4}>
        <Button onClick={handlePreviousPage} mr={2} isDisabled={page <= 1}>
          Anterior
        </Button>
        <Text as="span" mx={4}>
          Página {page} de {totalPages}
        </Text>
        <Button onClick={handleNextPage} isDisabled={page >= totalPages}>
          Siguiente
        </Button>
      </Box>
    </Box>
  );
}

export default TablaPage;
