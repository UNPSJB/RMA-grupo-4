import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, Stack, Image, Flex, Icon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUserPlus, FaArrowRight } from 'react-icons/fa';
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
            position="relative"
            minH="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            overflow="hidden"
        >
            <Image
                src={images[currentImage]}
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                objectFit="cover"
                zIndex="-2"
                opacity="1"
            />

            <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                zIndex="-1"
                bg="linear-gradient(to right, rgba(20, 20, 20, 0.8) 50%, rgba(20, 20, 20, 0) 100%)"
            />

            <Heading
                as="h1"
                size="4xl"
                fontWeight="extrabold"
                letterSpacing="tight"
                textShadow="2px 2px 10px rgba(0, 0, 0, 0.8)"
                mb={6}
                color="white"
            >
                Bienvenido a Nuestra Plataforma
            </Heading>

            <Text fontSize="2xl" mb={12} maxW="800px" color="white" textShadow="1px 1px 10px rgba(0, 0, 0, 0.7)">
                Explora nuestras funcionalidades. Inicia sesión o regístrate para comenzar a disfrutar de todo lo que tenemos para ofrecer.
            </Text>

            <Stack direction={{ base: 'column', md: 'row' }} spacing={6} justify="center">
                <Button
                    leftIcon={<FaLock />}
                    size="lg"
                    bg="orange.500" // Color de fondo del botón
                    color="white" // Color del texto
                    borderRadius="30px" // Mayor redondez
                    boxShadow="10px 10px 30px rgba(0, 0, 0, 0.4), -10px -10px 30px rgba(255, 255, 255, 0.1)"
                    _hover={{
                        bg: 'orange.600', // Color al pasar el mouse
                        boxShadow: '10px 10px 35px rgba(0, 0, 0, 0.5), -10px -10px 35px rgba(255, 255, 255, 0.1)',
                        transform: 'scale(1.05)',
                    }}
                    _active={{
                        bg: 'orange.700', // Color al presionar
                        transform: 'translateY(2px)',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
                    }}
                    onClick={() => navigate('/login')}
                >
                    Iniciar Sesión
                </Button>
                <Button
                    leftIcon={<FaUserPlus />}
                    size="lg"
                    variant="outline"
                    borderColor="orange.500" // Color del borde
                    color="orange.500" // Color del texto
                    borderRadius="30px" // Mayor redondez
                    _hover={{
                        borderColor: 'orange.600', // Color del borde al pasar el mouse
                        color: 'orange.600', // Color del texto al pasar el mouse
                        boxShadow: '10px 10px 35px rgba(0, 0, 0, 0.5), -10px -10px 35px rgba(255, 255, 255, 0.1)',
                        transform: 'scale(1.05)',
                    }}
                    _active={{
                        borderColor: 'orange.700', // Color del borde al presionar
                        transform: 'translateY(2px)',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
                    }}
                    onClick={() => navigate('/registrar')}
                >
                    Registrarse
                </Button>
            </Stack>

            <Flex
                direction={{ base: 'column', md: 'row' }}
                justify="space-around"
                wrap="wrap"
                mt={16}
                px={4}
                maxW="1200px"
                w="100%"
            >
                {[
                    { title: 'Funcionalidad 1', description: 'Explora nuevas oportunidades.', icon: FaArrowRight },
                    { title: 'Funcionalidad 2', description: 'Gestiona tus proyectos con facilidad.', icon: FaArrowRight },
                    { title: 'Funcionalidad 3', description: 'Accede a estadísticas personalizadas.', icon: FaArrowRight }
                ].map((feature, index) => (
                    <Flex
                        key={index}
                        direction="column"
                        align="center"
                        bg="rgba(255, 255, 255, 0.1)"
                        borderRadius="xl"
                        p={8}
                        m={4}
                        flex="1"
                        minW={{ base: '100%', md: '30%' }}
                        boxShadow="0px 4px 15px rgba(0, 0, 0, 0.5)"
                        transition="all 0.3s ease-in-out"
                        _hover={{ transform: 'scale(1.05)', bg: 'rgba(255, 255, 255, 0.15)' }}
                    >
                        <Icon as={feature.icon} w={12} h={12} mb={4} color="orange.400" />
                        <Heading as="h3" size="lg" mb={4}>
                            {feature.title}
                        </Heading>
                        <Text fontSize="md" color="gray.300">
                            {feature.description}
                        </Text>
                    </Flex>
                ))}
            </Flex>
        </Box>
    );
}
