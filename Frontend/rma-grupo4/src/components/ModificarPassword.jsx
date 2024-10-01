import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';
import { useAuth } from './AuthContext'; // Importa el contexto

const ModificarPassword = () => {
    const { user } = useAuth(); // Obtener el usuario del contexto
    const [passwordData, setPasswordData] = useState({
        password: '',
        repetir_password: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/modificar_password/${user}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passwordData),
            });

            if (!response.ok) throw new Error('Error al modificar la contraseña');

            setSuccess(true);
            setError(null);
            // Limpiar campos después de éxito
            setPasswordData({ password: '', repetir_password: '' });
        } catch (error) {
            setError(error.message);
            setSuccess(false);
        }
    };

    return (
        <Box p={5}>
            <Text fontSize="2xl" mb={4}>Modificar Contraseña</Text>
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertTitle>Error: </AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {success && (
                <Alert status="success" mb={4}>
                    <AlertIcon />
                    <AlertTitle>Éxito: </AlertTitle>
                    <AlertDescription>Contraseña modificada exitosamente.</AlertDescription>
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
                <FormControl mb={4} isRequired>
                    <FormLabel>Nueva Contraseña</FormLabel>
                    <Input
                        type="password"
                        value={passwordData.password}
                        onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                        placeholder="Introduce tu nueva contraseña"
                    />
                </FormControl>
                <FormControl mb={4} isRequired>
                    <FormLabel>Repetir Contraseña</FormLabel>
                    <Input
                        type="password"
                        value={passwordData.repetir_password}
                        onChange={(e) => setPasswordData({ ...passwordData, repetir_password: e.target.value })}
                        placeholder="Repite tu nueva contraseña"
                    />
                </FormControl>
                <Button colorScheme="teal" type="submit">Guardar Cambios</Button>
            </form>
        </Box>
    );
};

export default ModificarPassword;


