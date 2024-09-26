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
            bg="gray.700"
            p={6}
            rounded="md"
            boxShadow="lg"
            w={{ base: "90%", md: "400px" }}
            mx="auto"
            mt={10}
        >
            <Heading as="h2" size="lg" mb={6} textAlign="center" color="white">
                Registro
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

                <FormControl id="email" mb={4} isRequired>
                    <FormLabel color="gray.300">Email</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        bg="gray.600"
                        color="white"
                        placeholder="Ingresa tu email"
                    />
                </FormControl>

                <FormControl id="edad" mb={4} isRequired>
                    <FormLabel color="gray.300">Edad</FormLabel>
                    <Input
                        type="number"
                        value={edad}
                        onChange={(e) => setEdad(e.target.value)}
                        bg="gray.600"
                        color="white"
                        placeholder="Ingresa tu edad"
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
                    Registrar
                </Button>
            </form>
            <Text mt={4} color="gray.400" textAlign="center">
                ¿Ya tienes cuenta? <Button variant="link" color="blue.300" onClick={() => navigate('/login')}>Inicia sesión aquí</Button>
            </Text>
        </Box>
    );
}

export default Registrar;
