import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Input, Button, FormControl, FormLabel, Heading, Text, Select, useToast, useColorMode, Switch } from '@chakra-ui/react';

function Registrar() {
    const [usuario, setUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [edad, setEdad] = useState('');
    const [password, setPassword] = useState('');
    const [rolId, setRolId] = useState(null); // Estado para almacenar el rol_id
    const navigate = useNavigate();
    const toast = useToast();
    const { colorMode } = useColorMode(); // Para manejar el modo de color

    useEffect(() => {
        const fetchRolId = async () => {
            try {
                const response = await axios.get('http://localhost:8000/rol_invitado');
                setRolId(response.data); // Suponiendo que la respuesta es solo el rol_id
                console.log(response.data);
            } catch (error) {
                console.error('Error al obtener el rol:', error);
                toast({
                    render: () => (
                        <Box 
                            color="white" 
                            bg="red.600" 
                            borderRadius="md" 
                            p={5} 
                            mb={4}
                            boxShadow="md"
                            fontSize="lg" 
                        >
                            Error al obtener el rol. Intente nuevamente.
                        </Box>
                    ),
                    duration: 2000,
                    isClosable: true,
                });
            }
        };

        fetchRolId();
    }, []); // Solo se ejecuta al montar el componente

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/registrar', {
                usuario,
                email,
                edad: parseInt(edad),
                password,
                rol_id: rolId
            });
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
                        Usuario registrado.
                    </Box>
                ),
                duration: 2000,
                isClosable: true,
            });
            navigate('/login'); // Redirige a la página de inicio de sesión
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
                        Error al Registrarse. Intente nuevamente.
                    </Box>
                ),
                duration: 2000,
                isClosable: true,
            });
        }
    };

    return (
        <Box
            bgGradient={colorMode === 'dark' ? "linear(to-r, gray.900, gray.800)" : "linear(to-r, white, gray.100)"} 
            color={colorMode === 'dark' ? "white" : "black"} 
            minH="100vh" 
            px={4}
            pt={10} 
            display="flex"
            justifyContent="center" 
            alignItems="flex-start" 
        >
            <Box
                bg={colorMode === 'dark' ? "gray.800" : "white"}
                p={8}
                rounded="2xl"
                maxW="400px"
                w="full"
                position="relative"
                overflow="hidden"
                boxShadow="20px 20px 40px rgba(0, 0, 0, 0.5), -20px -20px 40px rgba(255, 255, 255, 0.1), inset 10px 10px 20px rgba(0, 0, 0, 0.2), inset -10px -10px 20px rgba(255, 255, 255, 0.1)"
                mt={10} 
            >
                <Heading as="h2" size="xl" mb={6} textAlign="center" fontWeight="extrabold">
                    Registro
                </Heading>
                <form onSubmit={handleSubmit}>
                    <FormControl id="usuario" mb={4} isRequired>
                        <FormLabel color={colorMode === 'light' ? "gray.800" : "gray.300"}>Usuario</FormLabel>
                        <Input
                            type="text"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            bg={colorMode === 'light' ? "gray.100" : "gray.900"}
                            color={colorMode === 'light' ? "black" : "white"}
                            placeholder="Ingresa tu usuario"
                            borderRadius="xl"
                            border="none"
                            boxShadow="inset 8px 8px 15px rgba(0,0,0,0.2), inset -8px -8px 15px rgba(255,255,255,0.1)"
                            _placeholder={{ color: colorMode === 'light' ? 'gray.500' : 'gray.500' }}
                            _focus={{
                                boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.3), inset -4px -4px 10px rgba(255,255,255,0.1)',
                                outline: 'none',
                            }}
                        />
                    </FormControl>

                    <FormControl id="email" mb={4} isRequired>
                        <FormLabel color={colorMode === 'light' ? "gray.800" : "gray.300"}>Email</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            bg={colorMode === 'light' ? "gray.100" : "gray.900"}
                            color={colorMode === 'light' ? "black" : "white"}
                            placeholder="Ingresa tu email"
                            borderRadius="xl"
                            border="none"
                            boxShadow="inset 8px 8px 15px rgba(0,0,0,0.2), inset -8px -8px 15px rgba(255,255,255,0.1)"
                            _placeholder={{ color: colorMode === 'light' ? 'gray.500' : 'gray.500' }}
                            _focus={{
                                boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.3), inset -4px -4px 10px rgba(255,255,255,0.1)',
                                outline: 'none',
                            }}
                        />
                    </FormControl>

                    <FormControl id="edad" mb={4} isRequired>
                        <FormLabel color={colorMode === 'light' ? "gray.800" : "gray.300"}>Edad</FormLabel>
                        <Input
                            type="number"
                            value={edad}
                            onChange={(e) => setEdad(e.target.value)}
                            bg={colorMode === 'light' ? "gray.100" : "gray.900"}
                            color={colorMode === 'light' ? "black" : "white"}
                            placeholder="Ingresa tu edad"
                            borderRadius="xl"
                            border="none"
                            boxShadow="inset 8px 8px 15px rgba(0,0,0,0.2), inset -8px -8px 15px rgba(255,255,255,0.1)"
                            _placeholder={{ color: colorMode === 'light' ? 'gray.500' : 'gray.500' }}
                            _focus={{
                                boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.3), inset -4px -4px 10px rgba(255,255,255,0.1)',
                                outline: 'none',
                            }}
                        />
                    </FormControl>

                    <FormControl id="password" mb={6} isRequired>
                        <FormLabel color={colorMode === 'light' ? "gray.800" : "gray.300"}>Contraseña</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            bg={colorMode === 'light' ? "gray.100" : "gray.900"}
                            color={colorMode === 'light' ? "black" : "white"}
                            placeholder="Ingresa tu contraseña"
                            borderRadius="xl"
                            border="none"
                            boxShadow="inset 8px 8px 15px rgba(0,0,0,0.2), inset -8px -8px 15px rgba(255,255,255,0.1)"
                            _placeholder={{ color: colorMode === 'light' ? 'gray.500' : 'gray.500' }}
                            _focus={{
                                boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.3), inset -4px -4px 10px rgba(255,255,255,0.1)',
                                outline: 'none',
                            }}
                        />
                    </FormControl>

                    {/* <FormControl id="rol" mb={6} isRequired>
                        <FormLabel color={colorMode === 'light' ? "gray.800" : "gray.300"}>Rol</FormLabel>
                        <Select
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                            bg={colorMode === 'light' ? "gray.100" : "gray.900"}
                            color={colorMode === 'light' ? "black" : "white"}
                            borderRadius="xl"
                            boxShadow="inset 8px 8px 15px rgba(0,0,0,0.2), inset -8px -8px 15px rgba(255,255,255,0.1)"
                            _focus={{
                                boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.3), inset -4px -4px 10px rgba(255,255,255,0.1)',
                                outline: 'none',
                            }}
                        >
                            <option value="estudiante">Estudiante</option>
                            <option value="profesional">Profesional</option>
                        </Select>
                    </FormControl> */}

                    <Button 
                        type="submit" 
                        size="lg" 
                        w="full"
                        bg={colorMode === 'light' ? "rgb(0, 31, 63)" : "orange.500"} 
                        color="white"
                        borderRadius="30px" 
                        border="none" 
                        zIndex="10" 
                        position="relative" 
                        boxShadow="10px 10px 30px rgba(0, 0, 0, 0.4), -10px -10px 30px rgba(255, 255, 255, 0.1), 4px 4px 10px rgba(0,0,0,0.3), -4px -4px 10px rgba(255,255,255,0.1)"
                        _hover={{
                            bg: colorMode === 'light' ? "rgb(0, 31, 63)" : 'orange.600',
                            boxShadow: '10px 10px 35px rgba(0, 0, 0, 0.5), -10px -10px 35px rgba(255, 255, 255, 0.1), 6px 6px 12px rgba(0,0,0,0.3), -6px -6px 12px rgba(255,255,255,0.1)',
                        }}
                        _active={{
                            bg: colorMode === 'light' ? "rgb(0, 31, 63)" : 'orange.700',
                            boxShadow: 'inset 6px 6px 12px rgba(0,0,0,0.2), inset -6px -6px 12px rgba(255,255,255,0.1)',
                        }}
                    >
                        Registrarse
                    </Button>
                </form>
                
            </Box>
        </Box>
    );
}

export default Registrar;
