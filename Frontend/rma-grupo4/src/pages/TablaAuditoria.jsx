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

  const mensajesOrdenados = useMemo(() => {
    const sortedMessages = [...mensajes];
    if (sortConfig.key) {
      sortedMessages.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortedMessages;
  }, [mensajes, sortConfig]);

  const mensajesPaginados = useMemo(() => {
    const startIndex = paginaActual * mensajesPorPagina;
    const endIndex = startIndex + mensajesPorPagina;
    return mensajesOrdenados.slice(startIndex, endIndex);
  }, [mensajesOrdenados, paginaActual]);

  const totalPaginas = Math.ceil(mensajesOrdenados.length / mensajesPorPagina);

  const cambiarVariable = (type) => {
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
      default:
        return type
    }
  };

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
            Filtrar por:
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
                  <Td colSpan={5} textAlign="center">No hay mensajes disponibles</Td>
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

      {/* Controles de paginación */}
      <Flex justify="center" align="center" mt={4}>
        <Button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 0))}
          isDisabled={paginaActual === 0}
          mr={4}
        >
          Anterior
        </Button>
        
        <Text fontWeight="bold">
          Página {paginaActual + 1} de {totalPaginas}
        </Text>
        
        <Button
          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas - 1))}
          isDisabled={paginaActual === totalPaginas - 1}
          ml={4}
        >
          Siguiente
        </Button>
      </Flex>
    </Box>
  );
};

export default TablaAuditoria;