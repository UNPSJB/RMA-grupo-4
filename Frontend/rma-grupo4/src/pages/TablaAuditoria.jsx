import React, { useState, useEffect, useMemo  } from "react";
import axios from "axios";
import { 
Box, Heading, Select, Table, Thead, Tbody, Tr, Th, Td, Flex, useColorMode 
} from '@chakra-ui/react';
import { format } from 'date-fns';

const TablaAuditoria = () => {
    const [mensajes, setMensajes] = useState([]);
    const [tipoFiltro, setTipoFiltro] = useState(""); // 'duplicado', 'correcto', 'incorrecto' o vacío.
    const { colorMode } = useColorMode(); 
    const [sortConfig, setSortConfig] = useState({ key: "value", direction: "asc" });
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

  // Obtener mensajes cuando se selecciona un filtro
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
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortedMessages;
    }, [mensajes, sortConfig]);

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
            <Box bg={colorMode === 'light' ? 'gray.300' : 'gray.600'} p={4} borderRadius="md" boxShadow="lg">
                <Box overflowX="auto" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderRadius="md" p={6}>
                    <Table variant="simple" colorScheme="whiteAlpha">
                        <Thead>
                            <Tr>
                                <Th onClick={() => handleSort("id_nodo")} textAlign={'center'} color={colorMode === 'light' ? 'black' : 'white'}>
                                    Nodo
                                    {sortConfig.key === "id_nodo" && (
                                    <span style={{ marginLeft: "5px" }}>
                                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                                    </span>
                                )}
                                </Th>
                                <Th textAlign={'center'} color={colorMode === 'light' ? 'black' : 'white'}>Data</Th>
                                <Th textAlign={'center'} color={colorMode === 'light' ? 'black' : 'white'}>Variable</Th>
                                <Th textAlign={'center'} color={colorMode === 'light' ? 'black' : 'white'}>Fecha</Th>
                                <Th textAlign={'center'} color={colorMode === 'light' ? 'black' : 'white'}>Hora</Th>
                                <Th textAlign={'center'} color={colorMode === 'light' ? 'black' : 'white'}>Tipo</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {mensajesOrdenados.length === 0 ? (
                                <Tr>
                                    <Td colSpan={5} textAlign="center">
                                        No hay mensajes disponibles
                                    </Td>
                                </Tr>
                            ) : (
                                mensajesOrdenados.map((msg, index) => {
                                    const fechaHora = new Date(msg.time); // Convierte la cadena en un objeto Date
                                    const fechaFormateada = format(fechaHora, 'dd/MM/yyyy'); // Formatea la fecha
                                    const horaFormateada = format(fechaHora, 'HH:mm:ss'); // Formatea la hora

                                    return (
                                        <Tr
                                            key={index}
                                            bg={colorMode === 'light' ? 'white' : 'gray.700'}
                                            color={colorMode === 'light' ? 'black' : 'white'}
                                        >
                                            <Td textAlign={'center'}>{msg.id_nodo}</Td>
                                            <Td textAlign={'center'}>{msg.data.substring(0, 8)}{msg.data.length > 20 ? '...' : ''}</Td>
                                            <Td textAlign={'center'}>{msg.type}</Td>
                                            <Td textAlign={'center'}>{fechaFormateada}</Td>
                                            <Td textAlign={'center'}>{horaFormateada}</Td>
                                            <Td textAlign={'center'}>{msg.tipo_mensaje}</Td>
                                        </Tr>
                                    );
                                })
                            )}
                        </Tbody>
                    </Table>
                </Box>
            </Box>
        </Box>
    );
};

export default TablaAuditoria;
