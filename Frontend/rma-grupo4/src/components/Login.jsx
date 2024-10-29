import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Input,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Text,
    useToast,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from './AuthContext';

function Login() {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const toast = useToast();
    const { login } = useAuth();
    const { toggleColorMode } = useColorMode(); // Manejo del modo de color

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/login', {
                usuario,
                password,
            });
            if (response.data.token) {
                const tokenKey = `token_${usuario}`;
                localStorage.setItem(tokenKey, response.data.token);

                // Decodificar el token
                const decodedToken = jwtDecode(response.data.token);
                const rol = decodedToken.rol;

                toast({
                    render: () => (
                        <Box 
                            color="white" 
                            bg="green.600" 
                            borderRadius="md" 
                            p={5} 
                            mb={4}
                            boxShadow="md"
                            fontSize="lg" // Tamaño de letra más grande
                        >
                            Inicio de sesión exitoso.
                        </Box>
                    ),
                    duration: 2000,
                    isClosable: true,
                });
                login(usuario);
                navigate('/inicio');

                login(usuario, rol); // Pasar el rol al contexto
    
                // Redirigir basado en el rol
                if (rol === 'admin') {
                    navigate('/admin');
                } else if (rol === 'universidad' || rol === 'invitado') {
                    navigate('/historicos');
                } else if (rol === 'profesional' || rol === 'cooperativa'){
                    navigate('/inicio');
                }
            }
        } catch (error) {
            toast({
                render: () => (
                    <Box 
                        color="white" 
                        bg="red.600" 
                        borderRadius="md" 
                        p={5} 
                        mb={4}
                        boxShadow="md"
                        fontSize="lg" // Tamaño de letra más grande
                    >
                        Error de inicio de sesión. Verifica tus credenciales.
                    </Box>
                ),
                duration: 2000,
                isClosable: true,
            });
        }
    };

    return (
        <Box
            bgGradient={useColorModeValue('linear(to-r, gray.200, gray.100)', 'linear(to-r, gray.900, gray.800)')} 
            color={useColorModeValue('gray.800', 'white')}
            minH="100vh"
            px={4}
            pt={10}
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
        >
            <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={8}
                rounded="2xl"
                maxW="400px"
                w="full"
                position="relative"
                overflow="hidden"
                boxShadow="20px 20px 40px rgba(0, 0, 0, 0.5), -20px -20px 40px rgba(255, 255, 255, 0.1), inset 10px 10px 20px rgba(0, 0, 0, 0.2), inset -10px -10px 20px rgba(255, 255, 255, 0.1)"
                mt={10}
            >
                <Heading as="h2" size="xl" mb={6} textAlign="center" color={useColorModeValue('gray.800', 'white')} fontWeight="extrabold">
                    Iniciar Sesión
                </Heading>
                <form onSubmit={handleSubmit}>
                    <FormControl id="usuario" mb={4} isRequired>
                        <FormLabel color={useColorModeValue('gray.800', 'gray.300')}>Usuario</FormLabel>
                        <Input
                            type="text"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            bg={useColorModeValue('gray.100', 'gray.900')}
                            color={useColorModeValue('gray.800', 'white')}
                            placeholder="Ingresa tu usuario"
                            borderRadius="xl"
                            border="none"
                            boxShadow="inset 8px 8px 15px rgba(0,0,0,0.2), inset -8px -8px 15px rgba(255,255,255,0.1)"
                            _placeholder={{ color: useColorModeValue('gray.500', 'gray.500') }}
                            _focus={{
                                boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.3), inset -4px -4px 10px rgba(255,255,255,0.1)',
                                outline: 'none',
                            }}
                        />
                    </FormControl>
                    <FormControl id="password" mb={6} isRequired>
                        <FormLabel color={useColorModeValue('gray.800', 'gray.300')}>Contraseña</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            bg={useColorModeValue('gray.100', 'gray.900')}
                            color={useColorModeValue('gray.800', 'white')}
                            placeholder="Ingresa tu contraseña"
                            borderRadius="xl"
                            border="none"
                            boxShadow="inset 8px 8px 15px rgba(0,0,0,0.2), inset -8px -8px 15px rgba(255,255,255,0.1)"
                            _placeholder={{ color: useColorModeValue('gray.500', 'gray.500') }}
                            _focus={{
                                boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.3), inset -4px -4px 10px rgba(255,255,255,0.1)',
                                outline: 'none',
                            }}
                        />
                    </FormControl>
                    <Button 
                        type="submit" 
                        colorScheme="orange" 
                        size="lg" 
                        w="full"
                        bg={useColorModeValue('rgb(0, 31, 63)', 'orange.500')} // Cambia el color en modo claro
                        borderRadius="30px"
                        border="none"
                        zIndex="10"
                        position="relative"
                        boxShadow="10px 10px 30px rgba(0, 0, 0, 0.4), -10px -10px 30px rgba(255, 255, 255, 0.1), 4px 4px 10px rgba(0,0,0,0.3), -4px -4px 10px rgba(255,255,255,0.1)"
                        _hover={{
                            bg: useColorModeValue('rgb(0, 31, 63)', 'orange.600'),
                            boxShadow: '10px 10px 35px rgba(0, 0, 0, 0.5), -10px -10px 35px rgba(255, 255, 255, 0.1), 6px 6px 12px rgba(0,0,0,0.3), -6px -6px 12px rgba(255,255,255,0.1)',
                            transform: 'scale(1.05)',
                        }}
                        _active={{
                            bg: useColorModeValue('rgb(0, 31, 63)', 'orange.700'),
                            transform: 'translateY(2px)',
                            boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.5), -10px -10px 30px rgba(255, 255, 255, 0.1), inset 6px 6px 12px rgba(0,0,0,0.2), inset -6px -6px 12px rgba(255,255,255,0.1)',
                        }}
                    >
                        Iniciar Sesión
                    </Button>
                </form>
                <Text mt={4} color={useColorModeValue('gray.600', 'gray.400')} textAlign="center">
                    ¿No tienes cuenta? <Button variant="link" color={useColorModeValue('rgb(0, 31, 63)', 'orange.300')} onClick={() => navigate('/registrar')}>Regístrate aquí</Button>
                </Text>
            </Box>
        </Box>
    );
}

export default Login;
