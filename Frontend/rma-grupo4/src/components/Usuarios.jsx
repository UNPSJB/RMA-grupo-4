import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Spinner, IconButton, Center, useColorModeValue } from '@chakra-ui/react';
import { FaTrashAlt, FaPen } from "react-icons/fa";
import axios from 'axios';
import EliminarUsuario from './EliminarUsuario';
import AsignarRol from './AsignarRol';
import { useAuth } from './AuthContext';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalEliminarOpen, setIsModalEliminarOpen] = useState(false);
    const [isModalAsignarOpen, setIsModalAsignarOpen] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
    const [usuarioAModificar, setUsuarioAModificar] = useState(null);
    const { token } = useAuth();

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
            await fetchUsuarios();
        } catch (error) {
            setError("Error al eliminar el usuario: " + error.message);
        }
    };

    const handleAsignarRol = async (nuevoRol) => {
        try {
            const usuarioId = usuarioAModificar.id;
            await axios.put(`http://localhost:8000/asignar_rol/${usuarioId}`, { nuevo_rol_id: nuevoRol }, {headers: { Authorization: `Bearer ${token}` }});
            setIsModalAsignarOpen(false);
            await fetchUsuarios();
        } catch (error) {
            setError("Error al asignar rol: " + error.message);
        }
    };

    const bg = useColorModeValue('gray.100', 'gray.700');
    const headerBg = useColorModeValue('gray.300', 'gray.600');
    const textColor = useColorModeValue('black', 'white'); 
    const shadow = useColorModeValue('6px 6px 10px rgba(0, 0, 0, 0.1), -6px -6px 10px rgba(255, 255, 255, 0.7)', '6px 6px 10px rgba(0, 0, 0, 0.3), -6px -6px 10px rgba(0, 0, 0, 0.2)');
    
    const buttonDefaultColor = useColorModeValue('gray.300', 'gray.600');
    const buttonHoverColor = useColorModeValue('rgb(0, 31, 63)', 'rgb(255, 130, 37)');
    const buttonShadow = useColorModeValue("5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff", "2px 2px 3px rgba(0, 0, 0, 0.3)");

    if (loading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (error) {
        return <Box color="red.500">{error}</Box>;
    }

    return (
        <Box bg={bg} borderRadius="md" boxShadow={shadow} p={4}>
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr bg={headerBg}>
                            <Th color={textColor} p={1}>ID</Th>
                            <Th color={textColor} p={1}>Usuario</Th>
                            <Th color={textColor} p={1}>Email</Th>
                            <Th color={textColor} p={1}>Edad</Th>
                            <Th color={textColor} p={1}>Rol</Th>
                            <Th color={textColor} p={1}>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {usuarios.map(usuario => (
                            <Tr key={usuario.id}>
                                <Td color={useColorModeValue('black', 'white')} p={1}>{usuario.id}</Td>
                                <Td color={useColorModeValue('black', 'white')} p={1}>{usuario.usuario}</Td>
                                <Td color={useColorModeValue('black', 'white')} p={1}>{usuario.email}</Td>
                                <Td color={useColorModeValue('black', 'white')} p={1}>{usuario.edad}</Td>
                                <Td color={useColorModeValue('black', 'white')} p={1}>{usuario.rol_nombre}</Td>
                                <Td p={1}>
                                    <IconButton
                                        icon={<FaPen />}
                                        aria-label="Editar"
                                        background={buttonDefaultColor}
                                        borderRadius="6px"
                                        boxShadow={buttonShadow}
                                        _hover={{ 
                                            background: buttonHoverColor, 
                                            color: "lightgray"
                                        }}
                                        onClick={() => {
                                            setUsuarioAModificar(usuario); 
                                            setIsModalAsignarOpen(true);
                                        }}
                                        mr={2}
                                    />
                                    <IconButton 
                                        icon={<FaTrashAlt />}
                                        aria-label="Eliminar"
                                        background={buttonDefaultColor}
                                        borderRadius="6px"
                                        boxShadow={buttonShadow}
                                        _hover={{ 
                                            background: buttonHoverColor, 
                                            color: "lightgray"
                                        }}
                                        onClick={() => {
                                            setUsuarioAEliminar(usuario.usuario); 
                                            setIsModalEliminarOpen(true);
                                        }}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

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
                usuario={usuarioAModificar ? usuarioAModificar.usuario : ""}
            />
        </Box>
    );
}
