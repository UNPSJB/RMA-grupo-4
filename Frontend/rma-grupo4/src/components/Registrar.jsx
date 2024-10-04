// Registrar.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Input, Button, FormControl, FormLabel, Heading, Text, useToast } from '@chakra-ui/react';

function Registrar() {
    const [usuario, setUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [edad, setEdad] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/registrar', {
                usuario,
                email,
                edad: parseInt(edad),
                password,
            });
            toast({
                title: "Usuario registrado.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            navigate('/login'); // Redirige a la página de inicio de sesión
        } catch (error) {
            toast({
                title: "Error al registrar.",
                description: "Intenta nuevamente.",
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
            justifyContent="center" 
            alignItems="flex-start" 
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
                mt={10} 
            >
                <Heading as="h2" size="xl" mb={6} textAlign="center" color="white" fontWeight="extrabold">
                    Registro
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

                    <FormControl id="email" mb={4} isRequired>
                        <FormLabel color="gray.300">Email</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            bg="gray.900"
                            color="white"
                            placeholder="Ingresa tu email"
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

                    <FormControl id="edad" mb={4} isRequired>
                        <FormLabel color="gray.300">Edad</FormLabel>
                        <Input
                            type="number"
                            value={edad}
                            onChange={(e) => setEdad(e.target.value)}
                            bg="gray.900"
                            color="white"
                            placeholder="Ingresa tu edad"
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
                        borderRadius="30px" 
                        border="none" 
                        zIndex="10" 
                        position="relative" 
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
                        Registrarse
                    </Button>
                </form>
                <Text mt={4} color="gray.400" textAlign="center">
                    ¿Ya tienes cuenta? <Button variant="link" color="orange.300" onClick={() => navigate('/login')}>Inicia sesión aquí</Button>
                </Text>
            </Box>
        </Box>
    );
}

export default Registrar;
