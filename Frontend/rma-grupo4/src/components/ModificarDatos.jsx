import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
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
    const [success, setSuccess] = useState(false);

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

            setSuccess(true);
            setError(null);
        } catch (error) {
            setError(error.message);
            setSuccess(false);
        }
    };

    // Cargar los datos del usuario al montar el componente
    useEffect(() => {
        fetchUserData();
    }, [user]); // Cambié [username] por [user] para usar el usuario del contexto

    if (loading) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box p={5}>
            <Text fontSize="2xl" mb={4}>Modificar Datos del Usuario</Text>
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertTitle>Error: </AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {success && (
                <Alert status="success" mb={4} bg="gray.700">
                    <AlertIcon />
                    <AlertTitle>Éxito: </AlertTitle>
                    <AlertDescription>Datos modificados exitosamente.</AlertDescription>
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
                <FormControl mb={4} isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        placeholder="Introduce tu nuevo email"
                    />
                </FormControl>
                <FormControl mb={4} isRequired>
                    <FormLabel>Edad</FormLabel>
                    <Input
                        type="number"
                        value={userData.edad}
                        onChange={(e) => setUserData({ ...userData, edad: parseInt(e.target.value) || '' })}
                        placeholder="Introduce tu edad"
                    />
                </FormControl>
                <Button colorScheme="teal" type="submit">Guardar Cambios</Button>
            </form>
        </Box>
    );
};

export default ModificarDatos;
