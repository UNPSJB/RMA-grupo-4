import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Spinner,
    useToast, // Importar useToast
} from '@chakra-ui/react';
import { useAuth } from './AuthContext'; // Importa el contexto

const ModificarDatos = () => {
    const { user } = useAuth(); // Obtener el usuario del contexto
    const [userData, setUserData] = useState({
        email: '',
        edad: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast(); // Inicializa el hook useToast

    // Función para obtener los datos del usuario
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

    // Función para manejar el envío del formulario
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

            toast({ // Mostrar el toast de éxito
                title: "Modificación de datos exitosa.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            setError(null); // Limpiar el error
        } catch (error) {
            toast({ // Mostrar el toast de error
                title: "Error.",
                description: error.message, // Usar el mensaje de error
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    // Cargar los datos del usuario al montar el componente
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
                boxShadow="inset 10px 10px 20px rgba(0, 0, 0, 0.2), inset -10px -10px 20px rgba(255, 255, 255, 0.1)" // Ajustado para quitar sombra exterior
                mt={10}
                ml={2} // Mover el componente más a la izquierda
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
                            bg="gray.900"
                            color="white"
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
                    <FormControl mb={4} isRequired>
                        <FormLabel>Edad</FormLabel>
                        <Input
                            type="number"
                            value={userData.edad}
                            onChange={(e) => setUserData({ ...userData, edad: parseInt(e.target.value) || '' })}
                            placeholder="Introduce tu edad"
                            bg="gray.900"
                            color="white"
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
                        boxShadow="10px 10px 30px rgba(0, 0, 0, 0.4), inset 4px 4px 10px rgba(0,0,0,0.3)" // Sombra ajustada
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
