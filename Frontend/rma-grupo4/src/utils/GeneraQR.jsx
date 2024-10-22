import React, { useEffect, useState } from 'react';
import { Image, Box, Grid, GridItem, useColorMode, Heading, Text } from '@chakra-ui/react';

const GeneraQR = () => {
    const [qrImage, setQrImage] = useState(null);
    const { colorMode } = useColorMode();

    // Función para generar el QR
    const handleGenerateQR = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/generar_qr_telegram/');
            if (!response.ok) {
                throw new Error('Error al generar el QR');
            }
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setQrImage(imageUrl);
        } catch (error) {
            console.error(error);
        }
    };

    // Generar QR al cargar el componente
    useEffect(() => {
        handleGenerateQR();
    }, []);

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
                        Al unirte a este canal privado de Telegram, recibirás alertas climatológicas actualizadas.
                        ¡Suscríbite y mantenete informado sobre el clima!
                    </Text>
                </GridItem>
                <GridItem
                    bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} 
                    borderRadius="md" 
                    boxShadow="lg" 
                    display="flex"            
                    justifyContent="center"   
                    alignItems="center"
                    style={{ width: '400px' }}  
                    p="4"
                >
                    {qrImage && <Image src={qrImage} alt="Código QR" m={2} height={{ base: '200px', md: '300px' }}/>}
                </GridItem>
            </Grid>
        </Box>
    );
};

export default GeneraQR;