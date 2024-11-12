import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Spinner, IconButton, Center, useColorMode, useColorModeValue, Heading } from '@chakra-ui/react';
import { FaTrashAlt, FaPen, FaPencilAlt } from "react-icons/fa";
import axios from 'axios';
import EliminarUsuario from './EliminarUsuario';
import AsignarRol from './AsignarRol';
import { useAuth } from './AuthContext';

export default function Usuarios() {
    const { colorMode } = useColorMode();
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
        <Box  bg={colorMode === 'light' ? 'gray.200' : 'gray.900'} color={colorMode === 'light' ? 'black' : 'white'} borderRadius="md" boxShadow="md" width="100%" p={4}>
            <Heading as="h1" textAlign="center" p="8">Usuarios</Heading>
            <Box bg={colorMode === 'light' ? 'gray.300' : 'gray.800'}  p={2} borderRadius="md">
                <TableContainer overflowX="auto" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'} borderRadius="md" boxShadow="lg" p={2}>
                    <Table variant="simple" colorScheme={colorMode === 'light' ? "blackAlpha" : "whiteAlpha"}>
                        <Thead display={{ base: "none", md: "table-header-group" }}>
                            <Tr>
                                <Th color={colorMode === 'light' ? 'black' : 'white'} fontWeight="bold" textAlign="center">ID</Th>
                                <Th color={colorMode === 'light' ? 'black' : 'white'} fontWeight="bold" textAlign="center">Usuario</Th>
                                <Th color={colorMode === 'light' ? 'black' : 'white'} fontWeight="bold" textAlign="center">Email</Th>
                                <Th color={colorMode === 'light' ? 'black' : 'white'} fontWeight="bold" textAlign="center">Edad</Th>
                                <Th color={colorMode === 'light' ? 'black' : 'white'} fontWeight="bold" textAlign="center">Rol</Th>
                                <Th color={colorMode === 'light' ? 'black' : 'white'} fontWeight="bold" textAlign="center">Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {usuarios.map(usuario => (
                                <Tr 
                                    key={usuario.id} 
                                    bg={colorMode === 'light' ? 'white' : 'gray.700'} 
                                    color={colorMode === 'light' ? 'black' : 'white'}
                                    _hover={{ backgroundColor: colorMode === 'light' ? "gray.100" : "gray.700" }}
                                >
                                    <Td color={colorMode === 'light' ? 'black' : 'white'} textAlign="center">{usuario.id}</Td>
                                    <Td color={colorMode === 'light' ? 'black' : 'white'} textAlign="center">{usuario.usuario}</Td>
                                    <Td color={colorMode === 'light' ? 'black' : 'white'} textAlign="center">{usuario.email}</Td>
                                    <Td color={colorMode === 'light' ? 'black' : 'white'} textAlign="center">{usuario.edad}</Td>
                                    <Td color={colorMode === 'light' ? 'black' : 'white'} textAlign="center">{usuario.rol_nombre}</Td>
                                    <Td color={colorMode === 'light' ? 'black' : 'white'} textAlign="center">
                                        <IconButton
                                            FaPencilAlt title = "Editar Usuario"
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
                                            FaPencilAlt title = "Eliminar Usuario"
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
            </Box>
                
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
