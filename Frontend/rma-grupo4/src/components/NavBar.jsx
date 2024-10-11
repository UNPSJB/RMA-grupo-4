import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Button, Icon, Menu, MenuButton, MenuList, MenuItem, Text,} from '@chakra-ui/react';
import { useAuth } from './AuthContext';
import { FaHome, FaUserCircle, FaSignInAlt, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';
import EliminarUsuarioModal from './EliminarUsuario';
import NavigationButtons from './NavigationButtons';
import HelpModal from './HelpModal';
import axios from 'axios';

function NavBar() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isHelpOpen, setHelpOpen] = useState(false); // Estado para el modal de ayuda
  
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

    // Estilo con animación de subrayado para otros botones
    const buttonStyle = {
        position: 'relative',
        _after: {
            content: '""',
            position: 'absolute',
            width: '0',
            height: '2px',
            background: 'linear-gradient(90deg, #ff7600, #ffa500)', // Degradado en naranja
            bottom: '-4px', // Posición debajo del botón
            left: '50%', // Punto de inicio
            transform: 'translateX(-50%)',
            transition: 'width 0.3s ease-in-out',
        },
        _hover: {
            _after: {
                width: '100%', // La línea se extiende por completo
            },
        },
    };

    return (
        <Box
            bg="gray.900"
            px={6}
            py={4}
            boxShadow="10px 10px 30px rgba(0, 0, 0, 0.5), -10px -10px 30px rgba(255, 255, 255, 0.1)"
            position="sticky"
            top="0"
            zIndex="1000"
        >
            <Flex
                as="nav"
                justify={{ base: 'space-around', md: 'space-between' }}
                align="center"
                maxW="1200px"
                mx="auto"
            >
                {/* Botón de Inicio con efecto de animación */}
                <Button
                    onClick={handleHomeClick}
                    bg="transparent"
                    color="white"
                    _hover={{ bg: 'gray.800' }}
                    _focus={{ boxShadow: 'none' }}
                    {...buttonStyle} // Aplica el estilo con la animación
                    leftIcon={<Icon as={FaHome} />}
                >
                    Inicio
                </Button>

                {isAuthenticated && <NavigationButtons />} {/* Mostrar NavigationButtons solo si está autenticado */}

                <Flex align="center">
                    {isAuthenticated ? (
                        <Menu>
                            <MenuButton>
                                <Flex
                                    align="center"
                                    bg="gray.800"
                                    px={4}
                                    py={2}
                                    borderRadius="full"
                                    boxShadow="inset 8px 8px 16px rgba(0, 0, 0, 0.4), inset -8px -8px 16px rgba(255, 255, 255, 0.1)"
                                    mr={4}
                                    _hover={{
                                        boxShadow: 'inset 6px 6px 12px rgba(0, 0, 0, 0.3), inset -6px -6px 12px rgba(255, 255, 255, 0.1)',
                                    }}
                                >
                                    <Icon as={FaUserCircle} color="orange.400" boxSize={6} mr={2} />
                                    <Text fontSize="lg" fontWeight="bold" color="orange.100">
                                        Hola, {user}
                                    </Text>
                                </Flex>
                            </MenuButton>

                            <MenuList bg="gray.800" borderColor="transparent">
                                <MenuItem
                                    onClick={() => navigate('/modificar_datos')}
                                    bg="gray.900"
                                    color="white"
                                    _hover={{ bg: 'orange.500' }}
                                    
                                >
                                    Modificar datos de usuario
                                </MenuItem>

                                <MenuItem
                                    onClick={() => navigate('/modificar_password')}
                                    bg="gray.900"
                                    color="white"
                                    _hover={{ bg: 'orange.500' }}
                                    
                                >
                                    Modificar password
                                </MenuItem>

                                <MenuItem
                                    onClick={() => setModalOpen(true)}
                                    bg="gray.900"
                                    color="white"
                                    _hover={{ bg: 'orange.500' }}
                                    
                                >
                                    Eliminar usuario
                                </MenuItem>

                                <MenuItem 
                                    onClick={() => setHelpOpen(true)} // Cambiado aquí
                                    bg="gray.900"
                                    color="white"
                                    _hover={{ bg: 'orange.500' }}
                                    leftIcon={<Icon as={FaQuestionCircle} boxSize={5} />}
                                   
                                >
                                    Ayuda
                                </MenuItem>

                                <MenuItem
                                    onClick={handleLogout}
                                    bg="gray.900"
                                    color="white"
                                    _hover={{ bg: 'orange.500' }}
                                    leftIcon={<Icon as={FaSignOutAlt} />}
                                    
                                >
                                    Cerrar sesión
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <Button
                            onClick={() => navigate('/login')}
                            bg="transparent"
                            color="white"
                            _hover={{ bg: 'gray.800' }}
                            _focus={{ boxShadow: 'none' }}
                            {...buttonStyle} // Aplica el estilo con la animación
                            leftIcon={<Icon as={FaSignInAlt} />}
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
            <HelpModal isOpen={isHelpOpen} onClose={() => setHelpOpen(false)} />
        </Box>
    );
}

export default NavBar;
