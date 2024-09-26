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
        if (response.data.token) {  // Verifica si el token fue devuelto
            const tokenKey = `token_${usuario}`;  // Crea la clave para localStorage
            localStorage.setItem(tokenKey, response.data.token);  // Guarda el token
            toast({
                title: "Inicio de sesión exitoso.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            login(usuario); // Pasar el nombre de usuario al contexto
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
            bg="gray.700"
            p={6}
            rounded="md"
            boxShadow="lg"
            w={{ base: "90%", md: "400px" }}
            mx="auto"
            mt={10}
        >
            <Heading as="h2" size="lg" mb={6} textAlign="center" color="white">
                Iniciar Sesión
            </Heading>
            <form onSubmit={handleSubmit}>
                <FormControl id="usuario" mb={4} isRequired>
                    <FormLabel color="gray.300">Usuario</FormLabel>
                    <Input
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        bg="gray.600"
                        color="white"
                        placeholder="Ingresa tu usuario"
                    />
                </FormControl>
                <FormControl id="password" mb={6} isRequired>
                    <FormLabel color="gray.300">Contraseña</FormLabel>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        bg="gray.600"
                        color="white"
                        placeholder="Ingresa tu contraseña"
                    />
                </FormControl>
                <Button type="submit" colorScheme="blue" w="full">
                    Iniciar Sesión
                </Button>
            </form>
            <Text mt={4} color="gray.400" textAlign="center">
                ¿No tienes cuenta? <Button variant="link" color="blue.300" onClick={() => navigate('/registrar')}>Regístrate aquí</Button>
            </Text>
        </Box>
    );
}

export default Login;
