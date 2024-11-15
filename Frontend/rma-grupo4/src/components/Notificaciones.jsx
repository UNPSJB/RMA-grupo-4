import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  IconButton,
  VStack,
  Text,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Circle,
  useToast
} from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';

const Notificaciones = () => {
  const { token, userId } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [estadosNotificacion, setEstadosNotificacion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const cargarNotificaciones = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    console.log('userId:', userId);
    try {
      setError(null);
      const res = await fetch(`http://localhost:8000/obtenerNotificacion/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!res.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
  
      const data = await res.json(); // Convertir la respuesta en JSON
      setNotificaciones(data); // Solo llegan notificaciones según preferencias
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
      setError(error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las notificaciones",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [token, toast, userId]);
  
  

  useEffect(() => {
    cargarNotificaciones();
    if (token) {
      const interval = setInterval(cargarNotificaciones, 60000);
      return () => clearInterval(interval);
    }
  }, [token, cargarNotificaciones]);

  const getEstadoNotificacion = useCallback(
    (idNotificacion) =>
      estadosNotificacion.find(
        estado => estado.id_notificacion === idNotificacion
      ),
    [estadosNotificacion]
  );

  const marcarComoLeida = async (idNotificacion) => {
    if (!token) return;

    try {
      const estado = getEstadoNotificacion(idNotificacion);
      if (!estado) {
        await axios.post(
          'http://localhost:8000/crear_estado_notificacion',
          {
            id_notificacion: idNotificacion,
            estado: true,
            leido_el: new Date().toISOString()
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        await axios.put(
          `http://localhost:8000/modificar_estado_notificacion/${idNotificacion}/${userId}`,
          {
            estado: true,
            leido_el: new Date().toISOString()
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }

      await cargarNotificaciones();
    } catch (error) {
      console.error("Error al marcar como leída:", error);
      toast({
        title: "Error",
        description: "No se pudo marcar la notificación como leída",
        status: "error",
        duration: 3000,
      });
    }
  };

  const notificacionesNoLeidas = notificaciones.filter(notif => {
    const estado = getEstadoNotificacion(notif.id);
    return !estado || estado.estado !== true;
  }).length;

  return (
    <Box position="relative">
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <Box position="relative">
            <IconButton
              icon={<FaBell />}
              aria-label="Notificaciones"
              variant="ghost"
              size="lg"
            />
            {notificacionesNoLeidas > 0 && (
              <Circle
                size="20px"
                bg="red.500"
                color="white"
                position="absolute"
                top="-5px"
                right="-5px"
                fontSize="xs"
              >
                {notificacionesNoLeidas}
              </Circle>
            )}
          </Box>
        </PopoverTrigger>
        <PopoverContent width="350px">
          <PopoverBody maxHeight="400px" overflowY="auto" p={0}>
            {loading ? (
              <Box p={4}>
                <Text>Cargando notificaciones...</Text>
              </Box>
            ) : error ? (
              <Box p={4}>
                <Text color="red.500">Error al cargar las notificaciones</Text>
              </Box>
            ) : notificaciones.length === 0 ? (
              <Box p={4}>
                <Text>No hay notificaciones</Text>
              </Box>
            ) : (
              <VStack spacing={0} align="stretch">
                {notificaciones.map(notif => {
                  const estado = getEstadoNotificacion(notif.id);
                  const leido = estado?.estado === true;

                  return (
                    <Box
                      key={notif.id}
                      p={4}
                      borderBottomWidth="1px"
                      bg={leido ? 'white' : 'gray.50'}
                      _hover={{ bg: 'gray.100' }}
                      cursor="pointer"
                      onClick={() => !leido && marcarComoLeida(notif.id)}
                    >
                      <Text fontWeight="bold" fontSize="sm">
                        {notif.titulo}
                      </Text>
                      <Text fontSize="sm" color="gray.600" mt={1}>
                        {notif.mensaje}
                      </Text>
                      <Badge
                        colorScheme={leido ? 'green' : 'red'}
                        mt={2}
                        size="sm"
                      >
                        {leido ? 'Leído' : 'No leído'}
                      </Badge>
                    </Box>
                  );
                })}
              </VStack>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};


export default Notificaciones;