// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Input, Button, FormControl, FormLabel, Heading, Text, useToast } from '@chakra-ui/react';
import { useAuth } from './AuthContext';

function Login() {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const toast = useToast();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/login', {
                usuario,
                password
            });
            if (response.data.token) {  
                const tokenKey = `token_${usuario}`;  
                localStorage.setItem(tokenKey, response.data.token);
                toast({
                    title: "Inicio de sesión exitoso.",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
                login(usuario); 
                navigate('/inicio');
            }
        } catch (error) {
            toast({
                title: "Error de inicio de sesión.",
                description: "Verifica tus credenciales.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    return (
        <Box
            bgGradient="linear(to-r, gray.900, gray.800)" 
            color="white" 
            minH="100vh" 
            px={4}
            pt={10} 
            display="flex"
            justifyContent="center" // Centrar horizontalmente
            alignItems="flex-start" // Alinear hacia arriba
        >
            <Box
                bg="gray.800"
                p={8}
                rounded="2xl"
                maxW="400px"
                w="full"
                position="relative"
                overflow="hidden"
                boxShadow="20px 20px 40px rgba(0, 0, 0, 0.5), -20px -20px 40px rgba(255, 255, 255, 0.1), inset 10px 10px 20px rgba(0, 0, 0, 0.2), inset -10px -10px 20px rgba(255, 255, 255, 0.1)"
                mt={10} // Agregar margen superior para desplazarlo hacia abajo
            >
                <Heading as="h2" size="xl" mb={6} textAlign="center" color="white" fontWeight="extrabold">
                    Iniciar Sesión
                </Heading>
                <form onSubmit={handleSubmit}>
                    <FormControl id="usuario" mb={4} isRequired>
                        <FormLabel color="gray.300">Usuario</FormLabel>
                        <Input
                            type="text"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            bg="gray.900"
                            color="white"
                            placeholder="Ingresa tu usuario"
                            borderRadius="xl"
                            border="none"
                            boxShadow="inset 8px 8px 15px rgba(0,0,0,0.2), inset -8px -8px 15px rgba(255,255,255,0.1)"
                            _placeholder={{ color: 'gray.500' }}
                            _focus={{
                                boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.3), inset -4px -4px 10px rgba(255,255,255,0.1)',
                                outline: 'none',
                            }}
                        />
                    </FormControl>
                    <FormControl id="password" mb={6} isRequired>
                        <FormLabel color="gray.300">Contraseña</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            bg="gray.900"
                            color="white"
                            placeholder="Ingresa tu contraseña"
                            borderRadius="xl"
                            border="none"
                            boxShadow="inset 8px 8px 15px rgba(0,0,0,0.2), inset -8px -8px 15px rgba(255,255,255,0.1)"
                            _placeholder={{ color: 'gray.500' }}
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
                        bg="orange.500"
                        borderRadius="30px" // Ajuste para mayor redondez
                        border="none" // Eliminar borde
                        zIndex="10" // Asegurar el z-index
                        position="relative" // Asegurar la posición
                        boxShadow="10px 10px 30px rgba(0, 0, 0, 0.4), -10px -10px 30px rgba(255, 255, 255, 0.1), 4px 4px 10px rgba(0,0,0,0.3), -4px -4px 10px rgba(255,255,255,0.1)"
                        _hover={{
                            bg: 'orange.600',
                            boxShadow: '10px 10px 35px rgba(0, 0, 0, 0.5), -10px -10px 35px rgba(255, 255, 255, 0.1), 6px 6px 12px rgba(0,0,0,0.3), -6px -6px 12px rgba(255,255,255,0.1)',
                            transform: 'scale(1.05)',
                        }}
                        _active={{
                            bg: 'orange.700',
                            transform: 'translateY(2px)',
                            boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.5), -10px -10px 30px rgba(255, 255, 255, 0.1), inset 6px 6px 12px rgba(0,0,0,0.2), inset -6px -6px 12px rgba(255,255,255,0.1)',
                        }}
                    >
                        Iniciar Sesión
                    </Button>
                </form>
                <Text mt={4} color="gray.400" textAlign="center">
                    ¿No tienes cuenta? <Button variant="link" color="orange.300" onClick={() => navigate('/registrar')}>Regístrate aquí</Button>
                </Text>
            </Box>
        </Box>
    );
}

export default Login;
