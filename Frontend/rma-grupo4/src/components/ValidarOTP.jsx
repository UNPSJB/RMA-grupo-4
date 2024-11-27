import React, { useState, useEffect } from 'react';
import { useToast, Input, Button, Box, VStack, Heading, Text, List, ListItem } from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from './AuthContext';  
import { useColorMode } from "@chakra-ui/react";

export default function ValidarOTP() {
  const [qrUrl, setQrUrl] = useState(null);  // Almacenará la URL de la imagen QR
  const [otp, setOtp] = useState("");  // Almacenará el valor del OTP ingresado
  const toast = useToast();
  const { userId } = useAuth();  // Obtener el userId del contexto
  const { colorMode } = useColorMode();

  // Solicitar el QR al backend cuando el componente se monte
  useEffect(() => {
    const obtenerQR = async () => {
      try {
        const response = await axios.get('http://localhost:8000/generar_qr', {
          responseType: 'blob',  // Esperamos una imagen como blob
        });

        // Crear una URL para la imagen obtenida
        const qrBlob = response.data;
        const qrUrl = URL.createObjectURL(qrBlob);
        setQrUrl(qrUrl);
      } catch (error) {
        console.error("Error al obtener el QR:", error);
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
              No se pudo generar el código QR.
            </Box>
          ),
          duration: 2000,
          isClosable: true,
        });
      }
    };

    obtenerQR();
  }, [toast]);

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const handleSubmit = async () => {
    // Verificamos si el OTP y el id_usuario están presentes
    if (!otp || !userId) {
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
            Por favor ingresa un OTP válido.
          </Box>
        ),
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      // Enviamos el OTP y el id_usuario al backend
      const response = await axios.post(
        'http://localhost:8000/verificar_otp',
        {
          otp: parseInt(otp),  // Aseguramos que el OTP sea un número
          id_usuario: userId,  // Usamos el userId del contexto
        }
      );

      // Mostrar mensaje de éxito
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
            OTP Verificado: {response.data.message}
          </Box>
        ),
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al verificar el OTP:", error);

      // Verificamos si el error tiene un código de estado 400 (OTP expirado o ya activo)
      if (error.response && error.response.status === 400) {
        // Comprobar si el error es debido a expiración o OTP ya activo
        const errorMessage = error.response.data.detail || "Error al verificar el OTP.";
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
              {errorMessage}
            </Box>
          ),
          duration: 2000,
          isClosable: true,
        });
      } else {
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
              No se pudo verificar el OTP.
            </Box>
          ),
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box p={5} textAlign="center">
    <VStack spacing={4} align="center">
      {/* Título y pasos */}
      <Heading size="lg">Suscripción a Alertas por Telegram</Heading>
      <Text textAlign="left" maxWidth="400px">
        Sigue los pasos para completar tu suscripción:
      </Text>
      <List spacing={2} textAlign="left" maxWidth="400px">
        <ListItem>1. Para recibir alertas, asegúrate de tener Telegram en tu dispositivo.</ListItem>
        <ListItem>2. Escanea el QR proporcionado para obtener el bot.</ListItem>
        <ListItem>3. Para obtener el código OTP, inicia el bot con <b>/start</b>.</ListItem>
        <ListItem>4. Por último, ingresa el código obtenido.</ListItem>
      </List>

      {/* QR y entrada de OTP */}
      {qrUrl ? (
        <img src={qrUrl} alt="QR de validación" style={{ maxWidth: '256px', maxHeight: '256px' }} />
      ) : (
        <p>Cargando QR...</p>
      )}

        <Input
          value={otp}
          onChange={handleOtpChange}
          placeholder="Ingresa el OTP"
          size="lg"
          width="300px"
          borderRadius="12px" // Bordes redondeados
          background={colorMode === "light" ? "white" : "gray.700"} // Fondo según el tema
          boxShadow={
            colorMode === "light"
              ? "inset 8px 8px 16px rgba(0, 0, 0, 0.2), inset -8px -8px 16px rgba(255, 255, 255, 0.7)" 
              : "inset 8px 8px 16px rgba(0, 0, 0, 0.6), inset -8px -8px 16px rgba(255, 255, 255, 0.2)"
          }
          _focus={{
            boxShadow: "inset 0 0 8px rgba(0, 123, 255, 0.6)", // Efecto al enfocarse
            outline: "none", // Elimina el borde estándar
          }}
          _hover={{
            boxShadow: colorMode === "light"
              ? "inset 6px 6px 12px rgba(0, 0, 0, 0.2), inset -6px -6px 12px rgba(255, 255, 255, 0.7)"
              : "inset 6px 6px 12px rgba(0, 0, 0, 0.6), inset -6px -6px 12px rgba(255, 255, 255, 0.2)"
          }}
        />

      <Button
        onClick={handleSubmit}
        size="sm"
        background={colorMode === "light" ? "white" : "gray.500"} 
        color={colorMode === "light" ? "gray.800" : "gray.200"}   
        borderRadius="6px"
        boxShadow="10px 10px 30px rgba(0, 0, 0, 0.4), -10px -10px 30px rgba(255, 255, 255, 0.1), 4px 4px 10px rgba(0,0,0,0.3), -4px -4px 10px rgba(255,255,255,0.1)"
        _hover={{
          background: colorMode === "light" ? "rgb(0, 31, 63)" : "orange.400", 
          color: colorMode === "light" ? "gray.200" : "lightgray",            
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",                        
        }}
       >
        Aceptar
      </Button>
      </VStack>
    </Box>
  );
}
