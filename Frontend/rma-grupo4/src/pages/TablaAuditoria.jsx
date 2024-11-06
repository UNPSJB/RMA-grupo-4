import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
    Text, Box, Heading, Select, Table, Thead, Tbody, Tr, Th, Td, Flex, Button, useColorMode
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useAuth } from '../components/AuthContext';

const TablaAuditoria = () => {
  const [mensajes, setMensajes] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState("correcto");
  const [selectNodo, setSelectNodo] = useState("");
  const [selectVariable, setSelectVariable] = useState("");
  const { colorMode } = useColorMode();
  const [sortConfig, setSortConfig] = useState({ key: "value", direction: "asc" });
  const { token } = useAuth();
  const [paginaActual, setPaginaActual] = useState(0); 
  const mensajesPorPagina = 10;

  const obtenerMensajes = async (tipo) => {
    try {
      const params = tipo ? { tipo_mensaje: tipo } : {};
      const respuesta = await axios.get("http://localhost:8000/api/v1/mensajes/auditoria", {params, headers: { Authorization: `Bearer ${token}`}});
      setMensajes(respuesta.data);
      setPaginaActual(0); 
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
    }
  };

  useEffect(() => {
    obtenerMensajes(tipoFiltro);
  }, [tipoFiltro]);

  const handleSort = (columnKey) => {
    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });
  };
  const cambiarVariable = (type) => {
    console.log("Type:", type); // Agrega este log
    switch (type) {
      case "temp_t":
        return "Temperatura";
      case "humidity_t":
        return "Humedad";
      case "pressure_t":
        return "Presión";
      case "rainfall_t":
        return "Precipitación";
      case "windspd_t":
        return "Viento";
      case "altitude_t":
        return "Nivel";
      default:
        return "Desconocido"; // Devuelve "Desconocido" si el tipo no coincide
    }
  };
  
  const mensajesFiltrados = useMemo(() => {
    const filtrados = mensajes.filter(msg => 
      (selectNodo ? msg.id_nodo === Number(selectNodo) : true) &&
      (selectVariable ? cambiarVariable(msg.type) === selectVariable : true)
    );
    console.log("Mensajes filtrados:", filtrados); // Agrega este log
    return filtrados;
  }, [mensajes, selectNodo, selectVariable]);
  

  const mensajesOrdenados = useMemo(() => {
    const sortedMessages = [...mensajesFiltrados];
    if (sortConfig.key) {
      sortedMessages.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortedMessages.reverse();
  }, [mensajesFiltrados, sortConfig]);

  const mensajesPaginados = useMemo(() => {
    const startIndex = paginaActual * mensajesPorPagina;
    const endIndex = startIndex + mensajesPorPagina;
    return mensajesOrdenados.slice(startIndex, endIndex);
  }, [mensajesOrdenados, paginaActual]);

  
  const totalPaginas = Math.ceil(mensajesFiltrados.length / mensajesPorPagina);

  
  
  
  const variablesUnicas = useMemo(() => {
    const variables = mensajes.map(msg => cambiarVariable(msg.type));
  
    // Filtrar valores válidos y excluir "Desconocido"
    return [...new Set(variables.filter(variable => variable !== "Desconocido"))];
  }, [mensajes]);
  
  const nodosUnicos = useMemo(() => {
    const nodos = mensajes.map(msg => msg.id_nodo);
    return [...new Set(nodos)];
  }, [mensajes]);

  return (
    <Box
      bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
      color={colorMode === 'light' ? 'black' : 'white'}
      borderRadius="md"
      boxShadow="md"
      width="100%"
      p={6}
    >
      <Heading as="h1" textAlign="center" mb={8}>
        Tabla Auditoría
      </Heading>

      {/* Filtro de tipo de mensaje */}
      <Flex justify="center" mb={8} wrap="wrap" gap={4}>
        <Box>
          <label htmlFor="tipo-filtro" style={{ fontWeight: 'bold', fontSize: '18px' }}>
            Filtrar por tipo:
          </label>
          <Select
            id="tipo-filtro"
            onChange={(e) => setTipoFiltro(e.target.value)}
            value={tipoFiltro}
            mt={2}
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            color={colorMode === 'light' ? 'black' : 'white'}
          >
            <option value="correcto">Correctos</option>
            <option value="duplicado">Duplicados</option>
            <option value="incorrecto">Incorrectos</option>
          </Select>
        </Box>
        <Box>
          <label htmlFor="nodo-filtro" style={{ fontWeight: 'bold', fontSize: '18px' }}>
            Filtrar por nodo:
          </label>
          <Select
            id="nodo-filtro"
            value={selectNodo}
            onChange={(e) => setSelectNodo(e.target.value)}
            mt={2}
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            color={colorMode === 'light' ? 'black' : 'white'}
          >
            <option value="">Todos</option>
            {nodosUnicos.map((nodo, index) => (
              <option key={index} value={nodo}>{nodo}</option>
            ))}
          </Select>
          
        </Box>
        <Box>
          <label htmlFor="variable-filtro" style={{ fontWeight: 'bold', fontSize: '18px' }}>
          Filtrar por variable:
          </label>
          <Select
            id="variable-filtro"
            value={selectVariable}
            onChange={(e) => setSelectVariable(e.target.value)}
            mt={2}
            bg={colorMode === 'light' ? 'white' : 'gray.700'} 
            color={colorMode === 'light' ? 'black' : 'white'}
          >
            <option value="">Todas</option>
            {variablesUnicas.map((variable, index) => (
              <option key={index} value={variable}>{variable}</option>
            ))}
          </Select>
        </Box>
      </Flex>

      {/* Tabla con mensajes */}
      <Box bg={colorMode === 'light' ? 'gray.300' : 'gray.600'} p={4} borderRadius="md" boxShadow="lg">
        <Box overflowX="auto" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderRadius="md" p={6}>
          <Table variant="simple" colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th onClick={() => handleSort("id_nodo")} textAlign={'center'} color={colorMode === 'light' ? 'black' : 'white'}>
                  Nodo {sortConfig.key === "id_nodo" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </Th>
                <Th textAlign={'center'} color={colorMode === 'light' ? 'black' : 'white'}>Valor</Th>
                <Th textAlign={'center'} color={colorMode === 'light' ? 'black' : 'white'}>Variable</Th>
                <Th textAlign={'center'} color={colorMode === 'light' ? 'black' : 'white'}>Tipo</Th>
                <Th textAlign={'center'} color={colorMode === 'light' ? 'black' : 'white'}>Fecha</Th>
                <Th textAlign={'center'} color={colorMode === 'light' ? 'black' : 'white'}>Hora</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mensajesPaginados.length === 0 ? (
                <Tr>
                  <Td colSpan={6} textAlign="center">No hay mensajes disponibles</Td>
                </Tr>
              ) : (
                mensajesPaginados.map((msg, index) => {
                  const fechaHora = new Date(msg.time);
                  const fechaFormateada = format(fechaHora, 'dd/MM/yyyy');
                  const horaFormateada = format(fechaHora, 'HH:mm:ss');

                  return (
                    <Tr key={index} bg={colorMode === 'light' ? 'white' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'}>
                      <Td textAlign={'center'}>{msg.id_nodo}</Td>
                      <Td textAlign={'center'}>
                        {msg.data.replace(/\./g, ',').substring(0, 8)}
                        {msg.data.length > 20 ? '...' : ''}
                      </Td>
                      <Td textAlign={'center'}>{cambiarVariable(msg.type)}</Td>
                      <Td textAlign={'center'}>{msg.tipo_mensaje}</Td>
                      <Td textAlign={'center'}>{fechaFormateada}</Td>
                      <Td textAlign={'center'}>{horaFormateada}</Td>
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* Paginación */}
      <Flex justify="center" mt={6}>
        <Button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 0))}
          isDisabled={paginaActual === 0}
        >
          Anterior
        </Button>
        <Text mx={4}>Página {paginaActual + 1} de {totalPaginas}</Text>
        <Button
          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas - 1))}
          isDisabled={paginaActual === totalPaginas - 1 || totalPaginas === 0}
        >
          Siguiente
        </Button>
      </Flex>
    </Box>
  );
};

export default TablaAuditoria;
