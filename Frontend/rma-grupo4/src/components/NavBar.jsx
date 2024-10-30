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
    const { isAuthenticated, user, logout, userRole } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isHelpOpen, setHelpOpen] = useState(false);
    const { colorMode } = useColorMode();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleHomeClick = () => {
        if (isAuthenticated) {
            if (userRole === "admin"){
                navigate('/admin'); 
            }else if (userRole === "profesional" || userRole === "cooperativa"){
                navigate('/inicio');
            }else if (userRole === "universidad"){
                navigate('/historicos');
            }else{
                navigate('/historicos');
            }
        } else {
            navigate('/');
        }
    };

    const handleEliminarUsuario = async () => {
        try {
            await axios.delete(`http://localhost:8000/eliminar_usuario/${user}`);
            logout();
            navigate('/');
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        } finally {
            setModalOpen(false);
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
            background: colorMode === 'dark' ? 'linear-gradient(90deg, #ff7600, #ffa500)' : 'linear-gradient(90deg, rgb(0, 31, 63), rgb(0, 31, 63))', // Cambiado a rgb(0, 31, 63)
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            transition: 'width 0.3s ease-in-out',
        },
        _hover: {
            _after: {
                width: '100%',
            },
        },
    };

    return (
        <Box
            bg={colorMode === 'dark' ? 'gray.900' : 'white'}
            px={6}
            py={4}
            boxShadow="10px 10px 30px rgba(0, 0, 0, 0.5), -10px -10px 30px rgba(255, 255, 255, 0.1)"
            position="sticky"
            top="0"
            zIndex="1000"
        >
            <Flex
                as="nav"
                justify="space-between"
                align="center"
                maxW="1200px"
                mx="auto"
            >
                <Flex align="center">
                    {["admin", "profesional", "cooperativa", "invitado", "universidad"].includes(userRole) && (
                        <Button
                            onClick={handleHomeClick}
                            bg="transparent"
                            color={colorMode === 'dark' ? 'white' : 'black'}
                            _hover={{ bg: colorMode === 'dark' ? 'gray.800' : 'gray.200' }}
                            _focus={{ boxShadow: 'none' }}
                            {...buttonStyle}
                            leftIcon={<Icon as={FaHome} />}
                            mr={4}
                        >
                            Inicio
                        </Button>
                    )}

                    {isAuthenticated && <NavigationButtons />}
                </Flex>

                <Flex align="center">
                    {isAuthenticated ? (
                        <Menu>
                            <MenuButton>
                                <Flex
                                    align="center"
                                    bg={colorMode === 'dark' ? 'gray.800' : 'gray.200'}
                                    px={4}
                                    py={2}
                                    borderRadius="full"
                                    boxShadow="inset 8px 8px 16px rgba(0, 0, 0, 0.4), inset -8px -8px 16px rgba(255, 255, 255, 0.1)"
                                    mr={4}
                                    _hover={{
                                        boxShadow: 'inset 6px 6px 12px rgba(0, 0, 0, 0.3), inset -6px -6px 12px rgba(255, 255, 255, 0.1)',
                                    }}
                                >
                                    <Icon as={FaUserCircle} color={colorMode === 'dark' ? 'orange.400' : 'rgb(0, 31, 63)'} boxSize={6} mr={2} /> {/* Cambiado a rgb(0, 31, 63) */}
                                    <Text fontSize="lg" fontWeight="bold" color={colorMode === 'dark' ? 'orange.100' : 'black'}>
                                        Hola, {user}
                                    </Text>
                                </Flex>
                            </MenuButton>

                            <MenuList bg={colorMode === 'dark' ? 'gray.800' : 'white'} borderColor="transparent">
                                <MenuItem
                                    onClick={() => navigate('/modificar_datos')}
                                    bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'}
                                    color={colorMode === 'dark' ? 'white' : 'black'}
                                    _hover={{ bg: colorMode === 'dark' ? 'orange.500' : 'rgb(0, 31, 63)', color: 'gray.300' }} // Cambiar el color aquí
                                >
                                    Modificar datos de usuario
                                </MenuItem>

                                <MenuItem
                                    onClick={() => navigate('/modificar_password')}
                                    bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'}
                                    color={colorMode === 'dark' ? 'white' : 'black'}
                                    _hover={{ bg: colorMode === 'dark' ? 'orange.500' : 'rgb(0, 31, 63)', color: 'gray.300' }} // Cambiar el color aquí
                                >
                                    Modificar password
                                </MenuItem>

                                <MenuItem
                                    onClick={() => setModalOpen(true)}
                                    bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'}
                                    color={colorMode === 'dark' ? 'white' : 'black'}
                                    _hover={{ bg: colorMode === 'dark' ? 'orange.500' : 'rgb(0, 31, 63)', color: 'gray.300' }} // Cambiar el color aquí
                                >
                                    Eliminar usuario
                                </MenuItem>

                                <MenuItem 
                                    onClick={() => setHelpOpen(true)}
                                    bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'}
                                    color={colorMode === 'dark' ? 'white' : 'black'}
                                    _hover={{ bg: colorMode === 'dark' ? 'orange.500' : 'rgb(0, 31, 63)', color: 'gray.300' }} // Cambiar el color aquí
                                    leftIcon={<Icon as={FaQuestionCircle} boxSize={5} />}
                                >
                                    Ayuda
                                </MenuItem>

                                <MenuItem
                                    onClick={handleLogout}
                                    bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'}
                                    color={colorMode === 'dark' ? 'white' : 'black'}
                                    _hover={{ bg: colorMode === 'dark' ? 'orange.500' : 'rgb(0, 31, 63)', color: 'gray.300' }} // Cambiar el color aquí
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
                            color={colorMode === 'dark' ? 'white' : 'black'}
                            _hover={{ bg: colorMode === 'dark' ? 'gray.800' : 'gray.200' }}
                            _focus={{ boxShadow: 'none' }}
                            {...buttonStyle}
                            leftIcon={<Icon as={FaSignInAlt} />}
                        >
                            Iniciar sesión
                        </Button>
                    )}

                    <ButtonTheme />
                </Flex>
            </Flex>

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
