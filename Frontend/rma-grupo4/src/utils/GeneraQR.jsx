import React, { useEffect, useState } from 'react';
import { Image, Box, Grid, GridItem, useColorMode, Heading, Text } from '@chakra-ui/react';
import { useAuth } from '../components/AuthContext';

const GeneraQR = () => {
    const { user } = useAuth();
    const [qrImageCanal1, setQrImageCanal1] = useState(null); // QR para canal 1
    const [qrImageCanal2, setQrImageCanal2] = useState(null); // QR para canal 2
    const [rol, setRol] = useState(null); // Nombre del rol
    const [rolId, setRolId] = useState(null); // ID del rol
    const [roles, setRoles] = useState([]); // Lista de roles
    const { colorMode } = useColorMode();

    // Obtiene el rol_id del usuario logueado
    const obtenerRolUsuario = async () => {
        try {
            const response = await fetch(`http://localhost:8000/usuarios/${user}`);
            if (!response.ok) {
                throw new Error('Error al obtener el rol del usuario');
            }
            const data = await response.json();
            setRolId(data.rol_id);
        } catch (error) {
            console.error(error);
        }
    };

    // Obtiene la lista completa de roles
    const obtenerRoles = async () => {
        try {
            const response = await fetch(`http://localhost:8000/roles/`);
            if (!response.ok) {
                throw new Error('Error al obtener roles');
            }
            const data = await response.json();
            setRoles(data); 
        } catch (error) {
            console.error(error);
        }
    };

    // Establece el nombre del rol basado en rolId y la lista de roles
    useEffect(() => {
        if (rolId && roles.length > 0) {
            const rolNombre = roles[rolId - 1]; 
            if (rolNombre) {
                setRol(rolNombre); 
            }
        }
    }, [rolId, roles]);

    // Genera los QR según el nombre del rol del usuario
    const handleGenerateQR = async () => {
        if (!rol) return;

        try {
            // Lógica de generación para rol 'admin'
            if (rol === 'admin') {
                const [response1, response2] = await Promise.all([
                    fetch(`http://localhost:8000/api/v1/generar_qr_telegram/canal_1`),
                    fetch(`http://localhost:8000/api/v1/generar_qr_telegram/canal_2`)
                ]);
                
                if (!response1.ok || !response2.ok) throw new Error('Error al generar los QR');

                // Almacena las URLs de las imágenes QR generadas
                const blob1 = await response1.blob();
                const blob2 = await response2.blob();
                setQrImageCanal1(URL.createObjectURL(blob1));
                setQrImageCanal2(URL.createObjectURL(blob2));


            } else if (rol === 'cooperativa') {
                const response = await fetch(`http://localhost:8000/api/v1/generar_qr_telegram/canal_1`);
                if (!response.ok) throw new Error('Error al generar el QR del canal 1');
                const blob = await response.blob();
                setQrImageCanal1(URL.createObjectURL(blob));

            } else if (rol === 'profesional') {
                const response = await fetch(`http://localhost:8000/api/v1/generar_qr_telegram/canal_2`);
                if (!response.ok) throw new Error('Error al generar el QR del canal 2');
                const blob = await response.blob();
                setQrImageCanal2(URL.createObjectURL(blob));
            }

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        obtenerRolUsuario();
        obtenerRoles();
    }, []);

    useEffect(() => {
        if (rol) handleGenerateQR();
    }, [rol]);

    return (
        <Box 
            textAlign="center" 
            bg={colorMode === 'light' ? 'gray.100' : 'gray.900'}
            color={colorMode === 'light' ? 'black' : 'white'}
            boxShadow="md"
            p={4}
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
                    {rol === 'cooperativa' && (
                        <Text mb={4} fontSize="md">
                            Como usuario cooperativa, te unirás al canal de <strong>nivel hidrométrico</strong> para recibir alertas sobre niveles de agua en tu zona.
                        </Text>
                    )}
                    {rol === 'profesional' && (
                        <Text mb={4} fontSize="md">
                            Como usuario profesional, te unirás al canal de <strong>estado de sensores</strong> para recibir alertas sobre el estado de los dispositivos y sensores.
                        </Text>
                    )}
                    {rol === 'admin' && (
                        <Text mb={4} fontSize="md">
                            Como administrador, tienes acceso a ambos canales: tanto al canal de <strong>nivel hidrométrico</strong> como al canal de <strong>estado de sensores</strong>.
                        </Text>
                    )}
                </GridItem>

                {/* Renderizado condicional de los QR */}
                {((rol === 'admin' && qrImageCanal1 && qrImageCanal2) || 
                  (rol === 'cooperativa' && qrImageCanal1) || 
                  (rol === 'profesional' && qrImageCanal2)) && (
                    <GridItem
                        bg={colorMode === 'light' ? 'gray.200' : 'gray.900'} 
                        borderRadius="md" 
                        boxShadow="lg" 
                        display="flex"            
                        flexDirection="column"
                        justifyContent="center"   
                        alignItems="center"
                        style={{ width: '400px' }}  
                        p="4"
                    >
                        {qrImageCanal1 && (
                            <Box mb="4">
                                <Text fontSize="sm" mb="2" color="blue.600">Canal de Nivel Hidrométrico</Text>
                                <Image src={qrImageCanal1} alt="Código QR Canal 1" m={2} height={{ base: '200px', md: '300px' }} />
                            </Box>
                        )}
                        {qrImageCanal2 && (
                            <Box mb="4">
                                <Text fontSize="sm" mb="2" color="green.600">Canal de Estado de Sensores</Text>
                                <Image src={qrImageCanal2} alt="Código QR Canal 2" m={2} height={{ base: '200px', md: '300px' }} />
                            </Box>
                        )}
                    </GridItem>
                )}
            </Grid>
        </Box>
    );
};

export default GeneraQR;