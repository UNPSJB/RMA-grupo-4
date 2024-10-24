import React, { useEffect } from 'react';
import { Box, Heading, Text, Button, Stack, Flex, Icon, useColorMode } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUserPlus, FaArrowRight } from 'react-icons/fa';
import { useAuth } from './AuthContext'; // Importar el contexto de autenticación

export default function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth(); // Obtener estado de autenticación
    const { colorMode } = useColorMode(); // Hook para obtener el modo de color actual

    // Redirigir al usuario a /inicio si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/inicio');
        }
    }, [isAuthenticated, navigate]);

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
            bg={colorMode === 'dark' ? 'gray.800' : 'white'} // Fondo según el modo
        >
            <Heading
                as="h1"
                size="4xl"
                fontWeight="extrabold"
                letterSpacing="tight"
                textShadow="2px 2px 10px rgba(0, 0, 0, 0.8)"
                mb={6}
                color={colorMode === 'dark' ? 'white' : 'black'} // Color del título según el modo
            >
                Bienvenido a TAVI
            </Heading>

            <Text 
                fontSize="2xl" 
                mb={12} 
                maxW="800px" 
                color={colorMode === 'dark' ? 'white' : 'black'} // Color del texto según el modo
                textShadow="1px 1px 10px rgba(0, 0, 0, 0.7)"
            >
                Explora nuestras funcionalidades. Inicia sesión o regístrate para comenzar a disfrutar de todo lo que tenemos para ofrecer.
            </Text>

            <Stack direction={{ base: 'column', md: 'row' }} spacing={6} justify="center">
                <Button
                    leftIcon={<FaLock />}
                    size="lg"
                    bg={colorMode === 'dark' ? 'orange.500' : 'rgb(0, 31, 63)'} // Cambiar a rgb(0, 31, 63) en modo claro
                    color="white"
                    borderRadius="30px"
                    boxShadow="10px 10px 30px rgba(0, 0, 0, 0.4), -10px -10px 30px rgba(255, 255, 255, 0.1)"
                    _hover={{
                        bg: colorMode === 'dark' ? 'orange.600' : 'rgb(0, 31, 63)',
                        boxShadow: '10px 10px 35px rgba(0, 0, 0, 0.5), -10px -10px 35px rgba(255, 255, 255, 0.1)',
                        transform: 'scale(1.05)',
                    }}
                    _active={{
                        bg: colorMode === 'dark' ? 'orange.700' : 'rgb(0, 31, 63)',
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
                    borderColor={colorMode === 'dark' ? 'orange.500' : 'rgb(0, 31, 63)'} // Cambiar a rgb(0, 31, 63) en modo claro
                    color={colorMode === 'dark' ? 'orange.500' : 'rgb(0, 31, 63)'} // Cambiar a rgb(0, 31, 63) en modo claro
                    borderRadius="30px"
                    _hover={{
                        borderColor: colorMode === 'dark' ? 'orange.600' : 'rgb(0, 31, 63)',
                        color: colorMode === 'dark' ? 'orange.600' : 'rgb(0, 31, 63)',
                        boxShadow: '10px 10px 35px rgba(0, 0, 0, 0.5), -10px -10px 35px rgba(255, 255, 255, 0.1)',
                        transform: 'scale(1.05)',
                    }}
                    _active={{
                        borderColor: colorMode === 'dark' ? 'orange.700' : 'rgb(0, 31, 63)',
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
                mt={20}
                px={4}
                maxW="1200px"
                w="100%"
            >
                {[
                    { title: 'Monitoreo en Tiempo Real', description: 'Mantén un control constante de las condiciones climáticas', icon: FaArrowRight },
                    { title: 'Análisis de Datos Históricos', description: 'Accede a los registros históricos para realizar análisis detallados', icon: FaArrowRight },
                    { title: 'Alertas Personalizadas', description: 'Recibe notificaciones automáticas cuando las condiciones superen los límites establecidos', icon: FaArrowRight }
                ].map((feature, index) => (
                    <Flex
                        key={index}
                        direction="column"
                        align="center"
                        bg="rgba(255, 255, 255, 0.1)"
                        borderRadius="xl"
                        p={3}
                        m={4}
                        flex="1"
                        minW={{ base: '100%', md: '30%' }}
                        boxShadow="0px 4px 15px rgba(0, 0, 0, 0.5)"
                        transition="all 0.3s ease-in-out"
                        _hover={{ transform: 'scale(1.05)', bg: 'rgba(255, 255, 255, 0.15)' }}
                    >
                        <Icon as={feature.icon} w={12} h={12} mb={4} color="orange.400" />
                        <Heading as="h3" size="lg" mb={4} color={colorMode === 'dark' ? 'white' : 'black'}>
                            {feature.title}
                        </Heading>
                        <Text fontSize="md" color={colorMode === 'dark' ? 'gray.300' : 'gray.600'} textAlign="justify">
                            {feature.description}
                        </Text>
                    </Flex>
                ))}
            </Flex>
        </Box>
    );
}
