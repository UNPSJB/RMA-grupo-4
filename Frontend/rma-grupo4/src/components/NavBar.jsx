// NavBar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Button, Box, Icon, Text, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useAuth } from './AuthContext'; // Importa el contexto
import { FaHome, FaUserCircle, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import EliminarUsuarioModal from './EliminarUsuario'; 
import NavigationButtons from './NavigationButtons'; // Importa el componente de navegación
import axios from 'axios'; 

function NavBar() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false); // Estado del modal
    const [isNavVisible, setNavVisible] = useState(false); // Estado para el submenú

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleHomeClick = () => {
        if (isAuthenticated) {
            navigate('/inicio');
        } else {
            navigate('/');
        }
    };

    const handleEliminarUsuario = async () => {
        try {
            await axios.delete(`http://localhost:8000/eliminar_usuario/${user}`); // Asumiendo que el nombre de usuario es único
            logout(); // Cierra sesión después de eliminar
            navigate('/'); // Redirige a la página de inicio
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            // Acá se puede mostrar un mensaje de error al usuario si lo desea
        } finally {
            setModalOpen(false); // Cierra el modal
        }
    };

    return (
        <Box bg="gray.900" p={4} boxShadow="md" position="sticky" top="0" zIndex="1000">
            <Flex as="nav" justify="space-between" align="center" maxW="1200px" mx="auto">
                {/* Botón para ir a la página de inicio */}
                <Button
                    colorScheme="whiteAlpha"
                    variant="ghost"
                    leftIcon={<Icon as={FaHome} boxSize={6} />}
                    onClick={handleHomeClick}
                    color="white"
                >
                </Button>
                <Flex align="center">
                    {isAuthenticated ? (
                        <>
                            {/* Menú del usuario autenticado */}
                            <Menu>
                                <MenuButton>
                                    <Flex align="center" bg="gray.700" px={4} py={2} borderRadius="md" boxShadow="sm" mr={4}>
                                        <Icon as={FaUserCircle} color="teal.300" boxSize={6} mr={2} />
                                        <Text fontSize="lg" fontWeight="bold" color="teal.100">
                                            Hola, {user}
                                        </Text>
                                    </Flex>
                                </MenuButton>
                                <MenuList bg="gray.800" borderColor="gray.700">
                                    <MenuItem 
                                        _hover={{ bg: 'gray.700' }} 
                                        _focus={{ bg: 'gray.600' }} 
                                        color="white"
                                        onClick={() => navigate('/modificar_datos')}
                                    >
                                        Modificar datos de usuario
                                    </MenuItem>
                                    <MenuItem 
                                        _hover={{ bg: 'gray.700' }} 
                                        _focus={{ bg: 'gray.600' }} 
                                        color="white"
                                        onClick={() => navigate('/modificar_password')}
                                    >
                                        Modificar password
                                    </MenuItem>
                                    <MenuItem 
                                        _hover={{ bg: 'red.600' }} 
                                        _focus={{ bg: 'red.500' }} 
                                        color="white"
                                        onClick={() => setModalOpen(true)}
                                    >
                                        Eliminar usuario
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                            <Button
                                colorScheme="whiteAlpha"
                                variant="ghost"
                                leftIcon={<Icon as={FaSignOutAlt} boxSize={5} />}
                                onClick={handleLogout}
                                color="white"
                                mx={2}
                            >
                                Cerrar sesión
                            </Button>
                            {/* Mostrar NavigationButtons solo si el usuario está autenticado */}
                            <NavigationButtons isVisible={isNavVisible} setIsVisible={setNavVisible} />
                        </>
                    ) : (
                        <Button
                            colorScheme="whiteAlpha"
                            variant="ghost"
                            leftIcon={<Icon as={FaSignInAlt} boxSize={5} />}
                            onClick={() => navigate('/login')}
                            color="white"
                            mx={2}
                        >
                            Iniciar sesión
                        </Button>
                    )}
                </Flex>
            </Flex>

            {/* Modal para eliminar usuario */}
            <EliminarUsuarioModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleEliminarUsuario}
            />
        </Box>
    );
}

export default NavBar;
