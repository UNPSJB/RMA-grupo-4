import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Flex,
    Button,
    Icon,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text,
    useColorMode,
} from '@chakra-ui/react';
import { useAuth } from './AuthContext';
import { FaHome, FaUserCircle, FaSignInAlt, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';
import EliminarUsuarioModal from './EliminarUsuario';
import NavigationButtons from './NavigationButtons';
import HelpModal from './HelpModal';
import axios from 'axios';
import ButtonTheme from './ButtonTheme';

function NavBar() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isHelpOpen, setHelpOpen] = useState(false); // Estado para el modal de ayuda
    const { colorMode } = useColorMode(); // Hook para obtener el modo de color actual

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
            bg={colorMode === 'dark' ? 'gray.900' : 'white'} // Cambia el fondo según el modo de color
            px={6}
            py={4}
            boxShadow="10px 10px 30px rgba(0, 0, 0, 0.5), -10px -10px 30px rgba(255, 255, 255, 0.1)"
            position="sticky"
            top="0"
            zIndex="1000"
        >
            <Flex
                as="nav"
                justify="space-between" // Usa espacio entre los grupos
                align="center"
                maxW="1200px"
                mx="auto"
            >
                {/* Grupo de botones a la izquierda */}
                <Flex align="center">
                    {/* Botón de Inicio */}
                    <Button
                        onClick={handleHomeClick}
                        bg="transparent"
                        color={colorMode === 'dark' ? 'white' : 'black'} // Cambia el color del texto según el modo de color
                        _hover={{ bg: colorMode === 'dark' ? 'gray.800' : 'gray.200' }} // Cambia el hover según el modo de color
                        _focus={{ boxShadow: 'none' }}
                        {...buttonStyle} // Aplica el estilo con la animación
                        leftIcon={<Icon as={FaHome} />}
                        mr={4} // Margen a la derecha
                    >
                        Inicio
                    </Button>

                    {isAuthenticated && <NavigationButtons />} {/* Mostrar NavigationButtons solo si está autenticado */}
                </Flex>

                {/* Grupo de botones a la derecha */}
                <Flex align="center">
                    {isAuthenticated ? (
                        <Menu>
                            <MenuButton>
                                <Flex
                                    align="center"
                                    bg={colorMode === 'dark' ? 'gray.800' : 'gray.200'} // Cambia el fondo según el modo de color
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
                                    <Text fontSize="lg" fontWeight="bold" color={colorMode === 'dark' ? 'orange.100' : 'black'}>
                                        Hola, {user}
                                    </Text>
                                </Flex>
                            </MenuButton>

                            <MenuList bg={colorMode === 'dark' ? 'gray.800' : 'white'} borderColor="transparent">
                                <MenuItem
                                    onClick={() => navigate('/modificar_datos')}
                                    bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'} // Cambia el fondo según el modo de color
                                    color={colorMode === 'dark' ? 'white' : 'black'} // Cambia el color del texto
                                    _hover={{ bg: 'orange.500' }}
                                >
                                    Modificar datos de usuario
                                </MenuItem>

                                <MenuItem
                                    onClick={() => navigate('/modificar_password')}
                                    bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'} // Cambia el fondo según el modo de color
                                    color={colorMode === 'dark' ? 'white' : 'black'} // Cambia el color del texto
                                    _hover={{ bg: 'orange.500' }}
                                >
                                    Modificar password
                                </MenuItem>

                                <MenuItem
                                    onClick={() => setModalOpen(true)}
                                    bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'} // Cambia el fondo según el modo de color
                                    color={colorMode === 'dark' ? 'white' : 'black'} // Cambia el color del texto
                                    _hover={{ bg: 'orange.500' }}
                                >
                                    Eliminar usuario
                                </MenuItem>

                                <MenuItem 
                                    onClick={() => setHelpOpen(true)} // Cambiado aquí
                                    bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'} // Cambia el fondo según el modo de color
                                    color={colorMode === 'dark' ? 'white' : 'black'} // Cambia el color del texto
                                    _hover={{ bg: 'orange.500' }}
                                    leftIcon={<Icon as={FaQuestionCircle} boxSize={5} />}
                                >
                                    Ayuda
                                </MenuItem>

                                <MenuItem
                                    onClick={handleLogout}
                                    bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'} // Cambia el fondo según el modo de color
                                    color={colorMode === 'dark' ? 'white' : 'black'} // Cambia el color del texto
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
                            color={colorMode === 'dark' ? 'white' : 'black'} // Cambia el color del texto según el modo de color
                            _hover={{ bg: colorMode === 'dark' ? 'gray.800' : 'gray.200' }} // Cambia el hover según el modo de color
                            _focus={{ boxShadow: 'none' }}
                            {...buttonStyle} // Aplica el estilo con la animación
                            leftIcon={<Icon as={FaSignInAlt} />}
                        >
                            Iniciar sesión
                        </Button>
                    )}

                    {/* Botón para cambiar el tema */}
                    <ButtonTheme />
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
