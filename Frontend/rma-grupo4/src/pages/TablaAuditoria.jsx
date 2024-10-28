import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
Box, Heading, Select, Table, Thead, Tbody, Tr, Th, Td, Flex, useColorMode ,Button
} from '@chakra-ui/react';
import { format } from 'date-fns';

const TablaAuditoria = () => {
const [mensajes, setMensajes] = useState([]);
const [paginaActual, setPaginaActual] = useState(0);
const [tipoFiltro, setTipoFiltro] = useState(""); // 'duplicado', 'correcto', 'incorrecto' o vacío.
const { colorMode } = useColorMode();
const mensajesPorPagina = 10;

  // Función para obtener los mensajes del backend
const obtenerMensajes = async (tipo) => {
    try {
        const params = tipo ? { tipo_mensaje: tipo } : {};
        const respuesta = await axios.get("http://localhost:8000/api/v1/mensajes/auditoria", { params });
        setMensajes(respuesta.data);
    } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    }
};



const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 0 || nuevaPagina >= Math.ceil(mensajes.length / mensajesPorPagina)) {
        return; 
      }
      setPaginaActual(nuevaPagina);
};
const mensajesAmostrar = mensajes.slice(
    paginaActual * mensajesPorPagina,
    (paginaActual + 1) * mensajesPorPagina
);


  // Obtener mensajes cuando se selecciona un filtro
useEffect(() => {
    obtenerMensajes(tipoFiltro);
}, [tipoFiltro]);

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
        Mensajes de Auditoría
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
            <option value="">Todos</option>
            <option value="duplicado">Duplicados</option>
            <option value="correcto">Correctos</option>
            <option value="incorrecto">Incorrectos</option>
        </Select>
        </Box>
    </Flex>

      {/* Tabla con mensajes */}
    <Box justifyContent = 'center'bg={colorMode === 'light' ? 'gray.300' : 'gray.600'} p={4} borderRadius="md" boxShadow="lg">
        <Box overflowX="auto" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderRadius="md" p={6}>
            <Table variant="simple" colorScheme="whiteAlpha">
            <Thead>
            <Tr>
                <Th onClick={() => ordenarPorColumna("id_nodo")}>Nodo</Th>
                <Th onClick={() => ordenarPorColumna("data")}>Data</Th>
                <Th onClick={() => ordenarPorColumna("type")}>Variable</Th>
                <Th onClick={() => ordenarPorColumna("time")}>Fecha</Th>
                <Th>Hora</Th>
                <Th onClick={() => ordenarPorColumna("tipo_mensaje")}>Tipo</Th>
            </Tr>
            </Thead>
            <Tbody>
            {mensajesAmostrar.length === 0 ? (
                <Tr>
                    <Td colSpan={6} textAlign="center">
                        No hay mensajes disponibles
                    </Td>
                </Tr>
                ) : (
                mensajesAmostrar.map((msg, index) => {
                    const fechaHora = new Date(msg.time); // Convierte la cadena en un objeto Date
                    const fechaFormateada = format(fechaHora, 'dd/MM/yyyy'); // Formatea la fecha
                    const horaFormateada = format(fechaHora, 'HH:mm:ss'); // Formatea la hora

                    return (
                        <Tr
                            key={index}
                            bg={colorMode === 'light' ? 'white' : 'gray.700'}
                            color={colorMode === 'light' ? 'black' : 'white'}
                        >
                            <Td>{msg.id_nodo}</Td>
                            <Td>{msg.data.substring(0, 8)}{msg.data.length > 20 ? '...' : ''}</Td>
                            <Td>{msg.type}</Td>
                            <Td>{fechaFormateada}</Td>
                            <Td>{horaFormateada}</Td>
                            <Td>{msg.tipo_mensaje}</Td>
                        </Tr>
                    );
                    })
                )}
                </Tbody>
                </Table>
            </Box>
            {/* Paginación */}
        <Flex justify="center" mt={4} gap={4}>
          <Button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual < 1}
          >
            Anterior
          </Button>
        <Box alignSelf="center">
                Página {paginaActual + 1} 
        </Box>
          <Button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={(paginaActual + 1) * mensajesPorPagina >= mensajes.length}
          >
            Siguiente
          </Button>
          
        </Flex>
            </Box>
        </Box>
    );
    };

export default TablaAuditoria;
