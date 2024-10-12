import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Spinner,
    useToast,
    Switch,
    useColorMode, // Importar useColorMode
} from '@chakra-ui/react';
import { useAuth } from './AuthContext';

const ModificarPassword = () => {
    const { user } = useAuth();
    const [passwordData, setPasswordData] = useState({
        password: '',
        repetir_password: '',
    });
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { colorMode, toggleColorMode } = useColorMode(); // Para manejar el modo de color

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/modificar_password/${user}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passwordData),
            });

            if (!response.ok) throw new Error('Error al modificar la contraseña');

            toast({
                title: "Contraseña modificada exitosamente.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });

            setPasswordData({ password: '', repetir_password: '' });
        } catch (error) {
            toast({
                title: "Error.",
                description: error.message,
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

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
                bg={colorMode === 'light' ? "white" : "gray.800"}
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
                <Text fontSize="2xl" mb={4} textAlign="center">Modificar Contraseña</Text>
                {loading && (
                    <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
                        <Spinner size="xl" />
                    </Box>
                )}
                <form onSubmit={handleSubmit}>
                    <FormControl mb={4} isRequired>
                        <FormLabel>Nueva Contraseña</FormLabel>
                        <Input
                            type="password"
                            value={passwordData.password}
                            onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                            placeholder="Introduce tu nueva contraseña"
                            bg={colorMode === 'light' ? "gray.100" : "gray.900"}
                            color={colorMode === 'light' ? "black" : "white"}
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
                        <FormLabel>Repetir Contraseña</FormLabel>
                        <Input
                            type="password"
                            value={passwordData.repetir_password}
                            onChange={(e) => setPasswordData({ ...passwordData, repetir_password: e.target.value })}
                            placeholder="Repite tu nueva contraseña"
                            bg={colorMode === 'light' ? "gray.100" : "gray.900"}
                            color={colorMode === 'light' ? "black" : "white"}
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

export default ModificarPassword;
