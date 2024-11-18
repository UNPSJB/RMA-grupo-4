import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Circle } from '@chakra-ui/react';
import { FaInbox } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';  
import { useAuth } from '../components/AuthContext';

const Notificaciones = () => {
  const { token, userId, userRole } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();  

  const cargarNotificaciones = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const res = await fetch(`http://localhost:8000/obtenerNotificacion/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      const data = await res.json();
      setNotificaciones(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    cargarNotificaciones();
    if (token) {
      const interval = setInterval(cargarNotificaciones, 60000);
      return () => clearInterval(interval);
    }
  }, [token, cargarNotificaciones]);

  const notificacionesNoLeidas = notificaciones.filter(notif => notif.estado_notificacion.estado !== true).length;

  const handleBellClick = () => {
    navigate('/notificaciones'); 
  };

  if (!token || !["admin", "profesional", "cooperativa"].includes(userRole)) {
    return (
      <Box position="relative">
      </Box>
    );
  }

  return (
    <Box position="relative">
      <IconButton
        icon={<FaInbox />}
        aria-label="Notificaciones"
        variant="ghost"
        size="lg"
        onClick={handleBellClick}  
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
  );
};

export default Notificaciones;