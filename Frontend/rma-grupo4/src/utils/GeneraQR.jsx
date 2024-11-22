import React, { useEffect, useState } from 'react';
import { Image, Box, Grid, GridItem, SimpleGrid, useColorMode, Heading, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { useAuth } from '../components/AuthContext';
import {FaCogs } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const GeneraQR = () => {
    const { userRole, token } = useAuth();
    const [qrImageCanal1, setQrImageCanal1] = useState(null); // QR para canal 1
    const [qrImageCanal2, setQrImageCanal2] = useState(null); // QR para canal 2
    const { colorMode } = useColorMode();
    const navigate = useNavigate();
    const buttonDefaultColor = useColorModeValue('gray.300', 'gray.600');
    const buttonHoverColor = useColorModeValue('rgb(0, 31, 63)', 'rgb(255, 130, 37)');
    const buttonShadow = useColorModeValue("5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff", "2px 2px 3px rgba(0, 0, 0, 0.3)");
  
    // Genera los QR según el nombre del rol del usuario
    const handleGenerateQR = async () => {
        if (!userRole) return;

        try {
            // Lógica de generación para rol 'admin'
            if (userRole === 'admin') {
                const [response1, response2] = await Promise.all([
                    fetch(`http://localhost:8000/api/v1/generar_qr_telegram/canal_1`, {headers: { Authorization: `Bearer ${token}`}}),
                    fetch(`http://localhost:8000/api/v1/generar_qr_telegram/canal_2`, {headers: { Authorization: `Bearer ${token}`}})
                ]);
                
                if (!response1.ok || !response2.ok) throw new Error('Error al generar los QR');

                // Almacena las URLs de las imágenes QR generadas
                const blob1 = await response1.blob();
                const blob2 = await response2.blob();
                setQrImageCanal1(URL.createObjectURL(blob1));
                setQrImageCanal2(URL.createObjectURL(blob2));


            } else if (userRole === 'cooperativa') {
                const response = await fetch(`http://localhost:8000/api/v1/generar_qr_telegram/canal_1`, {headers: { Authorization: `Bearer ${token}`}});
                if (!response.ok) throw new Error('Error al generar el QR del canal 1');
                const blob = await response.blob();
                setQrImageCanal1(URL.createObjectURL(blob));

            } else if (userRole === 'profesional') {
                const response = await fetch(`http://localhost:8000/api/v1/generar_qr_telegram/canal_2`, {headers: { Authorization: `Bearer ${token}`}});
                if (!response.ok) throw new Error('Error al generar el QR del canal 2');
                const blob = await response.blob();
                setQrImageCanal2(URL.createObjectURL(blob));
            }

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (userRole) handleGenerateQR();
    }, [userRole]);

    const handlePreferenciaNotificaciones = () => {
        navigate(`/personalizacion_alertas`);
      };

    return (
        <Box 
            textAlign="center" 
            bg={colorMode === 'light' ? 'gray.100' : 'gray.900'}
            color={colorMode === 'light' ? 'black' : 'white'}
            boxShadow="md"
        >
            <Grid
                bg={colorMode === 'light' ? 'gray.200' : 'gray.900'}
                templateColumns="repeat(1, 1fr)"
                gap={4}
                p={4}
                justifyItems="center"
            >
                <GridItem>
                    <Heading as="h1" mb={4}>Suscripción a Alertas por Telegram</Heading>
                    <Text mb={4} fontSize="lg" p={4}>
                        Para recibir alertas, asegúrate de descargar Telegram en tu dispositivo. Luego, escanea el código QR proporcionado según tu rol para unirte al canal correspondiente.
                    </Text>
                </GridItem>

                <GridItem>
                    {/* Mensaje de orientacion segun el rol */}
                    {userRole === 'cooperativa' && (
                        <Text mb={4} fontSize="md">
                            Como usuario cooperativa, te unirás al canal de <strong>nivel hidrométrico</strong> para recibir alertas sobre niveles de agua en tu zona.
                        </Text>
                    )}
                    {userRole === 'profesional' && (
                        <Text mb={4} fontSize="md">
                            Como usuario profesional, te unirás al canal de <strong>estado de sensores</strong> para recibir alertas sobre el estado de los dispositivos y sensores.
                        </Text>
                    )}
                    {userRole === 'admin' && (
                        <Text mb={4} fontSize="md">
                            Como administrador, tienes acceso a ambos canales: tanto al canal de <strong>nivel hidrométrico</strong> como al canal de <strong>estado de sensores</strong>.
                        </Text>
                    )}
                </GridItem>

                {/* Renderizado condicional de los QR */}
                {((userRole === 'admin' && qrImageCanal1 && qrImageCanal2) || 
                  (userRole === 'cooperativa' && qrImageCanal1) || 
                  (userRole === 'profesional' && qrImageCanal2)) && (
                    <GridItem
                        bg={colorMode === 'light' ? 'gray.200' : 'gray.900'}
                        borderRadius="md"
                        boxShadow="lg"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{ width: '800px' }}
                        p="4"
                    >
                        <SimpleGrid columns={qrImageCanal1 && qrImageCanal2 ? 2 : 1} spacing={24}>
                            {qrImageCanal1 && (
                                <Box mb="4" textAlign="center">
                                    <Text fontSize="sm" mb="2" color="blue.600">Canal de Nivel Hidrométrico</Text>
                                    <Image src={qrImageCanal1} alt="Código QR Canal 1" m={2} height={{ base: '200px', md: '300px' }} />
                                </Box>
                            )}
                            {qrImageCanal2 && (
                                <Box mb="4" textAlign="center">
                                    <Text fontSize="sm" mb="2" color="green.600">Canal de Estado de Sensores</Text>
                                    <Image src={qrImageCanal2} alt="Código QR Canal 2" m={2} height={{ base: '200px', md: '300px' }} />
                                </Box>
                            )}
                        </SimpleGrid>
                    </GridItem>
                )}
                <Box textAlign="right" mb={4} >
                    <Button
                        leftIcon={<FaCogs />}
                        aria-label="Personalizar Alertas"
                        background={buttonDefaultColor}
                        borderRadius="6px"
                        boxShadow={buttonShadow}
                        _hover={{
                            background: buttonHoverColor,
                            color: "lightgray",
                        }}
                        onClick={handlePreferenciaNotificaciones}
                    >
                        Personalizar Alertas
                    </Button>
                </Box>
            </Grid>
        </Box>
    );
};

export default GeneraQR;