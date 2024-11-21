import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  IconButton, 
  Circle, 
  Button, 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  PopoverBody, 
  VStack, 
  Text, 
  Divider,
  useColorModeValue,
  useColorMode
} from '@chakra-ui/react';
import { FaInbox } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const Notificaciones = () => {
  const { token, userId, userRole } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const buttonDefaultColor = useColorModeValue('white', 'gray.900');
  const buttonHoverColor = useColorModeValue('rgb(0, 31, 63)', 'rgb(255, 130, 37)');
  const buttonShadow = useColorModeValue("5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff", "2px 2px 3px rgba(0, 0, 0, 0.3)");
  const popoverBg = useColorModeValue('white', 'gray.800');

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

  const notificacionesNoLeidas = notificaciones.filter(
    notif => notif.estado_notificacion.estado !== true
  ).length;

  const handleVerMas = () => {
    setIsOpen(false);
    navigate('/notificaciones');
  };

  if (!token || !["admin", "profesional", "cooperativa"].includes(userRole)) {
    return null;
  }

  return (
    <Box position="relative">
      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom-end"
      >
        <PopoverTrigger>
          <IconButton
            icon={<FaInbox />}
            aria-label="Notificaciones"
            onClick={() => setIsOpen(!isOpen)}
            background={buttonDefaultColor}
            borderRadius="6px"
            boxShadow={buttonShadow}
            _hover={{ 
              background: buttonHoverColor, 
              color: "lightgray"
            }}
            ml={2}
          />
        </PopoverTrigger>
        <PopoverContent width="300px" bg={popoverBg}>
          <PopoverBody p={4}>
            <VStack spacing={4} align="stretch">
              {loading ? (
                <Text textAlign="center">Cargando notificaciones...</Text>
              ) : error ? (
                <Text textAlign="center" color="red.500">Error al cargar notificaciones</Text>
              ) : notificacionesNoLeidas === 0 ? (
                <>
                  <Text textAlign="center">No hay notificaciones nuevas</Text>
                  <Button
                    onClick={handleVerMas}
                    bg={colorMode === "light" ? "gray.200" : "gray.600"}
                    color={colorMode === "light" ? "black" : "white"}
                    borderRadius="6px"
                    boxShadow={buttonShadow}
                    _hover={{
                        background: buttonHoverColor,
                        color: "lightgray",
                    }}
                    width="100%"
                  >
                    Ver más
                  </Button>
                </>
                
                
              ) : (
                <>
                  {notificaciones
                    .filter(notif => !notif.estado_notificacion.estado)
                    .slice(0, 3)
                    .map((notif, index) => (
                      <Box 
                        key={notif.id} 
                        p={2} 
                        borderRadius="md"
                        color={colorMode === "light" ? "black" : "white"}
                        background={buttonDefaultColor}
                        _hover={{ 
                          background: buttonHoverColor, 
                          color: "white"
                        }}
                      >
                        <Text 
                          fontWeight="medium"
                        >{notif.titulo}</Text>
                        <Text 
                          fontSize="sm" 
                        >
                          {notif.descripcion}
                        </Text>
                      </Box>
                    ))}
                  <Divider />
                  <Button
                    onClick={handleVerMas}
                    bg={colorMode === "light" ? "gray.200" : "gray.600"}
                    color={colorMode === "light" ? "black" : "white"}
                    borderRadius="6px"
                    boxShadow={buttonShadow}
                    _hover={{
                        background: buttonHoverColor,
                        color: "lightgray",
                    }}
                    width="100%"
                  >
                    Ver más
                  </Button>
                </>
              )}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
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