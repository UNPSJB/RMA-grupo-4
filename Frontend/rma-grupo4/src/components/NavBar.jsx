// NavBar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Button, Box, Icon, Text } from '@chakra-ui/react';
import { useAuth } from './AuthContext'; // Importa el contexto
import { FaHome, FaUserCircle, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

function NavBar() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

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

    return (
        <Box bg="gray.900" p={4} boxShadow="md" position="sticky" top="0" zIndex="1000">
            <Flex as="nav" justify="space-between" align="center" maxW="1200px" mx="auto">
                {/* Botón Home con icono */}
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
                            {/* Muestra el nombre de usuario con un ícono */}
                            <Flex align="center" bg="gray.700" px={4} py={2} borderRadius="md" boxShadow="sm" mr={4}>
                                <Icon as={FaUserCircle} color="teal.300" boxSize={6} mr={2} />
                                <Text fontSize="lg" fontWeight="bold" color="teal.100">
                                    Hola, {user}
                                </Text>
                            </Flex>
                            {/* Botón de logout */}
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
                        </>
                    ) : (
                        // Botón de login cuando no está autenticado
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
        </Box>
    );
}

export default NavBar;
