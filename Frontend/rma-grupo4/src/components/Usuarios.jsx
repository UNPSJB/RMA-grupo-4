import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Spinner, Button, Icon } from '@chakra-ui/react';
import { AiOutlineSetting, AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import EliminarUsuario from './EliminarUsuario';
import AsignarRol from './AsignarRol'; // Asegúrate de importar el nuevo modal

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalEliminarOpen, setIsModalEliminarOpen] = useState(false);
    const [isModalAsignarOpen, setIsModalAsignarOpen] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
    const [usuarioAModificar, setUsuarioAModificar] = useState(null);

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:8000/lista_usuarios');
            setUsuarios(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleEliminarUsuario = async (usuario) => {
        try {
            await axios.delete(`http://localhost:8000/eliminar_usuario/${usuario}`);
            setIsModalEliminarOpen(false);
            await fetchUsuarios(); // Refrescar la lista de usuarios
        } catch (error) {
            setError("Error al eliminar el usuario: " + error.message);
        }
    };

    const handleAsignarRol = async (nuevoRol) => {
        try {
            const usuarioId = usuarioAModificar.id; // Asegúrate de tener el ID del usuario aquí
            await axios.put(`http://localhost:8000/asignar_rol/${usuarioId}`, { nuevo_rol_id: nuevoRol });
            setIsModalAsignarOpen(false);
            await fetchUsuarios(); // Refrescar la lista de usuarios
        } catch (error) {
            setError("Error al asignar rol: " + error.message);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error) {
        return <Box color="red.500">{error}</Box>;
    }

    return (
        <Box p={5}>
            <Box mb={4} fontSize="2xl" fontWeight="bold">Lista de Usuarios</Box>
            <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Usuario</Th>
                        <Th>Email</Th>
                        <Th>Edad</Th>
                        <Th>Rol</Th>
                        <Th>Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {usuarios.map(usuario => (
                        <Tr key={usuario.id}>
                            <Td>{usuario.id}</Td>
                            <Td>{usuario.usuario}</Td>
                            <Td>{usuario.email}</Td>
                            <Td>{usuario.edad}</Td>
                            <Td>{usuario.rol_nombre}</Td>
                            <Td>
                                <Button 
                                    leftIcon={<Icon as={AiOutlineSetting} />} 
                                    colorScheme="blue"
                                    variant="outline"
                                    onClick={() => {
                                        setUsuarioAModificar(usuario); // Establecer el usuario a modificar
                                        setIsModalAsignarOpen(true); // Abrir el modal
                                    }}
                                    mr={2}
                                >
                                    Modificar Rol
                                </Button>
                                <Button 
                                    leftIcon={<Icon as={AiOutlineClose} />}
                                    colorScheme="red"
                                    variant="outline"
                                    onClick={() => {
                                        setUsuarioAEliminar(usuario.usuario);
                                        setIsModalEliminarOpen(true);
                                    }}
                                >
                                    Eliminar
                                </Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            {/* Modales */}
            <EliminarUsuario 
                isOpen={isModalEliminarOpen} 
                onClose={() => setIsModalEliminarOpen(false)} 
                onConfirm={() => handleEliminarUsuario(usuarioAEliminar)} 
            />
            <AsignarRol 
                isOpen={isModalAsignarOpen} 
                onClose={() => setIsModalAsignarOpen(false)} 
                onConfirm={handleAsignarRol} 
                usuario={usuarioAModificar ? usuarioAModificar.usuario : ""} // Pasa el nombre del usuario
            />
        </Box>
    );
}
