import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, Stack, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import testImage1 from '../Images/test1.jpg'; 
import testImage2 from '../Images/test2.jpg';
import testImage3 from '../Images/test3.jpg';

const images = [testImage1, testImage2, testImage3];

export default function Home() {
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 3000); // Cambia la imagen cada 3 segundos

        return () => clearInterval(interval);
    }, []);

    return (
        <Box 
            bgGradient="linear(to-r, gray.900, gray.800)" 
            color="white" 
            minH="100vh" 
            display="flex" 
            justifyContent="center" 
            alignItems="center"
            textAlign="center"
            px={4}
        >
            <Box 
                maxW="800px"
                bg="gray.700"  
                p={8} 
                rounded="lg" 
                shadow="xl"
                opacity="0.95"
            >
                <Heading as="h1" size="2xl" mb={6} fontWeight="bold">
                    ¡Bienvenido a Nuestra Aplicación!
                </Heading>
                <Text fontSize="lg" mb={6}>
                    Explora las funcionalidades de nuestra plataforma. Inicia sesión o regístrate para comenzar.
                </Text>
                
                {/* Banner rotatorio */}
                <Image 
                    src={images[currentImage]} 
                    alt="Imagen decorativa" 
                    rounded="lg" 
                    mb={6}
                    shadow="lg"
                    height="400px" // Altura fija
                    width="100%" // Ancho al 100% del contenedor
                    objectFit="cover" // Para ajustar la imagen
                />

                <Stack direction={{ base: 'column', md: 'row' }} spacing={4} justify="center">
                    <Button colorScheme="blue" onClick={() => navigate('/login')}>
                        Iniciar Sesión
                    </Button>
                    <Button variant="outline" colorScheme="blue" onClick={() => navigate('/registrar')}>
                        Registrarse
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}
