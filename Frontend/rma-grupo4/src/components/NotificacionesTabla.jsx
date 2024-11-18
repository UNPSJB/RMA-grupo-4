import React, { useState, useEffect, useCallback } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Heading, Text, Badge, useToast, IconButton } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const NotificacionesTabla = () => {
  const { token, userId } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

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
      setNotificaciones(data);
  
    } catch (error) {
      setError(error);
      console.error("Error al cargar las notificaciones:", error);
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  const marcarComoLeida = async (idNotificacion) => {
    if (!token) return;

    try {
      await axios.put(
        `http://localhost:8000/modificar_estado_notificacion/${idNotificacion}/${userId}`,
        { estado: true, leido_el: new Date().toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotificaciones((prevNotificaciones) =>
        prevNotificaciones.map((notif) =>
          notif.id === idNotificacion ? { ...notif, estado_notificacion: { ...notif.estado_notificacion, estado: true } } : notif
        )
      );

      toast({
        title: 'Notificación marcada como leída',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error al marcar como leída:', error);
      toast({
        title: 'Error',
        description: 'No se pudo marcar la notificación como leída',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    cargarNotificaciones();
  }, [cargarNotificaciones]);

  return (
    <Box p={4} maxWidth="900px" mx="auto">
      <Heading as="h1" mb={7} textAlign="center">Mis Notificaciones</Heading>

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
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Título</Th>
              <Th>Mensaje</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {notificaciones.map((notif) => (
              <Tr 
                key={notif.id} 
              >
                <Td fontWeight="bold">{notif.titulo}</Td>
                <Td>{notif.mensaje}</Td>
                <Td>
                  <Badge 
                    colorScheme={notif.estado_notificacion.estado ? 'green' : 'red'}
                  >
                    {notif.estado_notificacion.estado ? 'Leído' : 'No leído'}
                  </Badge>
                </Td>
                <Td>
                  {!notif.estado_notificacion.estado && (
                    <IconButton
                      icon={<CheckIcon />}
                      colorScheme="green"
                      variant="outline"
                      aria-label="Marcar como leída"
                      onClick={() => marcarComoLeida(notif.id)}
                    />
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default NotificacionesTabla;