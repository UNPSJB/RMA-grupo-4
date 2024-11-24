import React, { useState, useEffect } from 'react';
import { useToast, Input, Button, Box, VStack } from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from './AuthContext';  // Asegúrate de importar useAuth

export default function ValidarOTP() {
  const [qrUrl, setQrUrl] = useState(null);  // Almacenará la URL de la imagen QR
  const [otp, setOtp] = useState("");  // Almacenará el valor del OTP ingresado
  const toast = useToast();
  const { userId } = useAuth();  // Obtener el userId del contexto

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
          title: "Error",
          description: "No se pudo generar el código QR.",
          status: "error",
          duration: 5000,
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
        title: "Error",
        description: "Por favor ingresa un OTP válido.",
        status: "error",
        duration: 5000,
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
        title: "OTP Verificado",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al verificar el OTP:", error);

      // Verificamos si el error tiene un código de estado 400 (OTP expirado o ya activo)
      if (error.response && error.response.status === 400) {
        // Comprobar si el error es debido a expiración o OTP ya activo
        const errorMessage = error.response.data.detail || "Error al verificar el OTP.";
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo verificar el OTP.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box p={5} textAlign="center">
      <VStack spacing={4} align="center">
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
        />
        <Button colorScheme="teal" onClick={handleSubmit}>
          Aceptar
        </Button>
      </VStack>
    </Box>
  );
}
