import React, { useState, useEffect, useCallback } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Heading, Text, Badge, useToast, IconButton,useColorMode,Button, useColorModeValue, Flex, Select } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { useAuth } from '../components/AuthContext';
import {FaCogs } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const NotificacionesTabla = () => {
  const { token, userId } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const navigate = useNavigate();

  const buttonDefaultColor = useColorModeValue('gray.300', 'gray.600');
  const buttonHoverColor = useColorModeValue('rgb(0, 31, 63)', 'rgb(255, 130, 37)');
  const buttonShadow = useColorModeValue("5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff", "2px 2px 3px rgba(0, 0, 0, 0.3)");

  const cargarNotificaciones = useCallback(async () => {
    if (!token) return;
    try {
      setError(null);
      const res = await fetch(`http://localhost:8000/obtenerNotificacion/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error(`Error en la respuesta del servidor: ${res.statusText}`);
      }
      const data = await res.json();
      setNotificaciones(
        data.sort((a, b) => {
          if (a.estado_notificacion.estado !== b.estado_notificacion.estado) {
            return a.estado_notificacion.estado ? 1 : -1;
          }
        
          const fechaA = new Date(a.estado_notificacion.leido_el || 0);
          const fechaB = new Date(b.estado_notificacion.leido_el || 0);
      
          return fechaB - fechaA; 
        })
      );
  
    } catch (error) {
      setError(error);
      console.error("Error al cargar las notificaciones:", error);
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  const marcarComoLeida = async (idNotificacion) => {
    if (!token) return;
    const leidoEl = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString();
    try {
      await axios.put(
        `http://localhost:8000/modificar_estado_notificacion/${idNotificacion}/${userId}`,
        { estado: true, leido_el: leidoEl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotificaciones((prevNotificaciones) =>
        prevNotificaciones.map((notif) =>
          notif.id === idNotificacion ? { ...notif, estado_notificacion: { ...notif.estado_notificacion, estado: true } } : notif
        )
      );

      toast({
        render: () => (
          <Box 
            color="white" 
            bg="green.600" 
            borderRadius="md" 
            p={5} 
            mb={4}
            boxShadow="md"
            fontSize="lg" 
          >
            Notificación marcada como leída
          </Box>
      ),
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error al marcar como leída:', error);
      toast({
        render: () => (
          <Box 
              color="white" 
              bg="red.600" 
              borderRadius="md" 
              p={5} 
              mb={4}
              boxShadow="md"
              fontSize="lg"
          >
              Error: No se pudo marcar la notificación como leída
          </Box>
      ),
        status: 'error',
        duration: 3000,
      });
    }
    cargarNotificaciones();
  };

  useEffect(() => {
    cargarNotificaciones();
  }, [cargarNotificaciones]);

  const notificacionesFiltradas = notificaciones.filter((notif) => {
    if (tipoFiltro === "leidos") return notif.estado_notificacion.estado;
    if (tipoFiltro === "no_leidos") return !notif.estado_notificacion.estado;
    return true; // si es "todos"
  });
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const notificacionesPaginadas = notificacionesFiltradas.slice(startIndex, endIndex);
  const totalPaginas = Math.ceil(notificaciones.length / pageSize);

  const nextPage = () => {
    if (currentPage < totalPaginas && totalPaginas > 0) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePreferenciaNotificaciones = () => {
    navigate(`/preferenciaNotificaciones`);
  };
  
  const getColorAndIcon = (titulo, mensaje) => {
    if (/verde/i.test(titulo) || /verde/i.test(mensaje)) {
        return {  icon: '🟢' };
    }
    if (/amarillo/i.test(titulo) || /amarillo/i.test(mensaje)) {
        return {  icon: '🟡' };
    }
    if (/naranja/i.test(titulo) || /naranja/i.test(mensaje)) {
        return {  icon: '🟠' };
    }
    if (/rojo/i.test(titulo) || /rojo/i.test(mensaje)) {
        return {  icon: '🔴' };
    }
    return {  icon: '⚪' }; 
  };

  return (
    <Box bg={colorMode === 'light' ? 'gray.100' : 'gray.900'} color={colorMode === 'light' ? 'black' : 'white'} borderRadius="md" boxShadow="md" width="100%" p={4}>
      <Heading as="h1" mb={7} textAlign="center">Mis Notificaciones</Heading>
      <Flex justify="center" mb={8} align="center" gap={4}>
        <Text fontWeight="bold" fontSize="18px">
          Filtrar por estado:
        </Text>
        <Select
          id="tipo-filtro"
          onChange={(e) => setTipoFiltro(e.target.value)}
          value={tipoFiltro}
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          color={colorMode === 'light' ? 'black' : 'white'}
          width="auto"  // Ajusta el ancho para que no ocupe toda la línea
        >
          <option value="todos">Todos</option>
          <option value="leidos">Leídos</option>
          <option value="no_leidos">No Leídos</option>
        </Select>
      </Flex>
      <Box bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
        <Box overflowX="auto" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'} borderRadius="md" boxShadow="lg" p={7} >
          <Box textAlign="right" mb={4} mr={16}>
            <IconButton
                title="Configurar Preferencias"
                icon={<FaCogs />}
                aria-label="Configurar preferencia"
                background={buttonDefaultColor}
                borderRadius="6px"
                boxShadow={buttonShadow}
                _hover={{
                      background: buttonHoverColor,
                      color: "lightgray",
                    }}
                    onClick={handlePreferenciaNotificaciones}
            />
          </Box>
          {loading ? (
            <Text textAlign="center">Cargando notificaciones...</Text>
          ) : error ? (
            <Text color="red.500" textAlign="center">
              Error al cargar las notificaciones
            </Text>
          ) : notificaciones.length === 0 ? (
            <Text textAlign="center" color="gray.500">
              No hay notificaciones
            </Text>
          ) : (

            <Table variant="simple" colorScheme={colorMode === 'light' ? "blackAlpha" : "whiteAlpha"}>
              <Thead>
                <Tr>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Ícono</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Título</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Mensaje</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Fecha Notificado</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Fecha Lectura</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Estado</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {notificacionesPaginadas.map((notif) => {
                  const { icon } = getColorAndIcon(notif.titulo, notif.mensaje);
                  return (
                    <Tr 
                      key={notif.id}
                      bg={colorMode === 'light' ? 'white' : 'gray.700'} 
                      color={colorMode === 'light' ? 'black' : 'white'}
                      _hover={{ backgroundColor: colorMode === 'light' ? "gray.100" : "gray.700" }} 
                    >
                      <Td textAlign="center">
                        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                      </Td>
                      <Td textAlign="center">{notif.titulo}</Td>
                      <Td textAlign="center">{notif.mensaje}</Td>
                      <Td textAlign="center">
                        {notif.creada ? 
                            new Intl.DateTimeFormat('es-AR', {
                              year: 'numeric', 
                              month: '2-digit', 
                              day: '2-digit', 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hourCycle: 'h23'
                            }).format(new Date(notif.creada)) : 'Sin fecha'}
                      </Td>
                      <Td textAlign="center">
                        {notif.estado_notificacion.estado ? 
                          new Intl.DateTimeFormat('es-AR', {
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit', 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hourCycle: 'h23'
                          }).format(new Date(notif.estado_notificacion.leido_el)) : 'Sin fecha'}
                      </Td>
                      <Td textAlign="center">
                          <Badge 
                            colorScheme={notif.estado_notificacion.estado ? 'green' : 'red'}
                          >
                            {notif.estado_notificacion.estado ? 'Leído' : 'No leído'}
                          </Badge>
                      </Td>
                      <Td textAlign="center">
                          {!notif.estado_notificacion.estado && (
                            <IconButton
                              icon={<CheckIcon />}
                              background={buttonDefaultColor}
                              borderRadius="6px"
                              boxShadow={buttonShadow}
                              _hover={{
                                background: buttonHoverColor,
                                color: "lightgray",
                              }}
                              aria-label="Marcar como leída"
                              onClick={() => marcarComoLeida(notif.id)}
                            />
                          )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          )}
          <Box display="flex" justifyContent="center" mt={4}>
            <Button 
              onClick={prevPage}
              disabled={currentPage === 1 || totalPaginas === 0}
              size="sm"
              ml={2}
              backgroundColor={(currentPage === 1 || totalPaginas === 0) ? 'gray.500' : buttonDefaultColor}
              color={(currentPage === 1 || totalPaginas === 0) ? 'gray.200' : (colorMode === 'light' ? 'black' : 'white')}
              borderRadius="6px"
              boxShadow={(currentPage === 1 || totalPaginas === 0) ? "none" : buttonShadow}
              _hover={(currentPage === 1 || totalPaginas === 0) ? {} : { 
                backgroundColor: buttonHoverColor, 
                color: "lightgray"
              }}
            >
              Anterior
            </Button>
            
            {/* Texto de Página */}
            <Text mx={4}>Página {currentPage} de {totalPaginas}</Text>
            
            {/* Botón "Siguiente" */}
            <Button 
              onClick={nextPage}
              disabled={currentPage === totalPaginas || totalPaginas === 0}
              size="sm"
              ml={2}
              backgroundColor={(currentPage === totalPaginas || totalPaginas === 0) ? 'gray.500' : buttonDefaultColor}
              color={(currentPage === totalPaginas || totalPaginas === 0) ? 'gray.200' : (colorMode === 'light' ? 'black' : 'white')}
              borderRadius="6px"
              boxShadow={(currentPage === totalPaginas || totalPaginas === 0) ? "none" : buttonShadow}
              _hover={(currentPage === totalPaginas || totalPaginas === 0) ? {} : { 
                backgroundColor: buttonHoverColor, 
                color: "lightgray"
              }}
            >
              Siguiente
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NotificacionesTabla;