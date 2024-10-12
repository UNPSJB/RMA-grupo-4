import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Spinner,
    useToast,
    useColorMode, // Importar useColorMode
} from '@chakra-ui/react';
import { useAuth } from './AuthContext';

const ModificarDatos = () => {
    const { user } = useAuth();
    const { colorMode, toggleColorMode } = useColorMode(); // Obtener el estado del tema
    const [userData, setUserData] = useState({
        email: '',
        edad: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();

    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/usuarios/${user}`);
            if (!response.ok) throw new Error('Error al obtener los datos');
            const data = await response.json();
            setUserData({
                email: data.email,
                edad: data.edad,
            });
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/modificar_datos_usuario/${user}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) throw new Error('Error al modificar los datos');

            toast({
                title: "Modificación de datos exitosa.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            setError(null);
        } catch (error) {
            toast({
                title: "Error.",
                description: error.message,
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [user]);

    if (loading) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box
            bgGradient={colorMode === 'light' ? "linear(to-r, gray.200, gray.100)" : "linear(to-r, gray.900, gray.800)"} // Cambiar fondo según tema
            color={colorMode === 'light' ? "black" : "white"} // Cambiar color de texto
            minH="100vh"
            px={4}
            pt={10}
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
        >
            <Box
                bg={colorMode === 'light' ? "white" : "gray.800"} // Cambiar fondo del cuadro según tema
                p={8}
                rounded="2xl"
                maxW="400px"
                w="full"
                position="relative"
                overflow="hidden"
                boxShadow="inset 10px 10px 20px rgba(0, 0, 0, 0.2), inset -10px -10px 20px rgba(255, 255, 255, 0.1)"
                mt={10}
                ml={2}
            >
                <Text fontSize="2xl" mb={4} textAlign="center">Modificar Datos del Usuario</Text>
                <form onSubmit={handleSubmit}>
                    <FormControl mb={4} isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            placeholder="Introduce tu nuevo email"
                            bg={colorMode === 'light' ? "gray.100" : "gray.900"} // Cambiar color de fondo del input
                            color={colorMode === 'light' ? "black" : "white"} // Cambiar color del texto del input
                            borderRadius="xl"
                            border="none"
                            boxShadow="inset 8px 8px 15px rgba(0,0,0,0.2), inset -8px -8px 15px rgba(255,255,255,0.1)"
                            _placeholder={{ color: colorMode === 'light' ? 'gray.500' : 'gray.400' }} // Cambiar color del placeholder
                            _focus={{
                                boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.3), inset -4px -4px 10px rgba(255,255,255,0.1)',
                                outline: 'none',
                            }}
                        />
                    </FormControl>
                    <FormControl mb={4} isRequired>
                        <FormLabel>Edad</FormLabel>
                        <Input
                            type="number"
                            value={userData.edad}
                            onChange={(e) => setUserData({ ...userData, edad: parseInt(e.target.value) || '' })}
                            placeholder="Introduce tu edad"
                            bg={colorMode === 'light' ? "gray.100" : "gray.900"}
                            color={colorMode === 'light' ? "black" : "white"}
                            borderRadius="xl"
                            border="none"
                            boxShadow="inset 8px 8px 15px rgba(0,0,0,0.2), inset -8px -8px 15px rgba(255,255,255,0.1)"
                            _placeholder={{ color: colorMode === 'light' ? 'gray.500' : 'gray.400' }}
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
                        boxShadow="10px 10px 30px rgba(0, 0, 0, 0.4), inset 4px 4px 10px rgba(0,0,0,0.3)"
                        _hover={{
                            bg: 'orange.600',
                            boxShadow: '10px 10px 35px rgba(0, 0, 0, 0.5), inset 6px 6px 12px rgba(0,0,0,0.3)',
                            transform: 'scale(1.05)',
                        }}
                        _active={{
                            bg: 'orange.700',
                            transform: 'translateY(2px)',
                            boxShadow: 'inset 6px 6px 12px rgba(0,0,0,0.2)',
                        }}
                    >
                        Guardar Cambios
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default ModificarDatos;
