import React, { useEffect, useState } from 'react';
import {Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,Button,Select,useColorMode,} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const AsignarRol = ({ isOpen, onClose, onConfirm, usuario }) => {
    const { colorMode } = useColorMode();
    const [roles, setRoles] = useState([]);
    const [nuevoRolId, setNuevoRolId] = useState("");
    const { token } = useAuth();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                // console.log(token);
                const response = await axios.get('http://localhost:8000/rolesnombresId', {
                });
                setRoles(response.data);
            } catch (error) {
                console.error("Error al obtener los roles: ", error);
            }
        };
        fetchRoles();
    }, []);
    const handleConfirm = () => {
        onConfirm(nuevoRolId); // Pasa el ID del nuevo rol
        setNuevoRolId(""); // Reiniciar el rol seleccionado
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
                bg={colorMode === 'light' ? 'white' : 'gray.700'}
                color={colorMode === 'light' ? 'black' : 'white'}
            >
                <ModalHeader
                    bg={colorMode === 'light' ? 'gray.200' : 'gray.800'}
                    color={colorMode === 'light' ? 'black' : 'white'}
                >
                    Asignar Rol a {usuario}
                </ModalHeader>
                <ModalBody>
                    <Select placeholder="Selecciona un rol" value={nuevoRolId} onChange={(e) => setNuevoRolId(e.target.value)}>
                        {roles.map((rol) => (
                            <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                        ))}
                    </Select>
                </ModalBody>
                <ModalFooter>
                     <Button 
                        onClick={handleConfirm}
                        bg={colorMode === 'light' ? 'rgb(0, 31, 63)' : 'orange.500'}
                        color={colorMode === 'light' ? 'gray.200' : 'white'}
                        border="none"
                        p="6"
                        boxShadow="10px 10px 30px rgba(0, 0, 0, 0.4), -10px -10px 30px rgba(255, 255, 255, 0.1), 4px 4px 10px rgba(0,0,0,0.3), -4px -4px 10px rgba(255,255,255,0.1)"
                        _hover={{
                            bg: colorMode === 'light' ? 'rgb(0, 41, 83)' : 'orange.600',
                            boxShadow: '10px 10px 35px rgba(0, 0, 0, 0.5), -10px -10px 35px rgba(255, 255, 255, 0.1), 6px 6px 12px rgba(0,0,0,0.3), -6px -6px 12px rgba(255,255,255,0.1)',
                            transform: 'scale(1.05)',
                        }}
                        _active={{
                            bg: colorMode === 'light' ? 'rgb(0, 21, 43)' : 'orange.700',
                            transform: 'translateY(2px)',
                            boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.5), -10px -10px 30px rgba(255, 255, 255, 0.1), inset 6px 6px 12px rgba(0,0,0,0.2), inset -6px -6px 12px rgba(255,255,255,0.1)',
                        }}
                    >
                        Guardar
                    </Button>

                    <Button 
                        onClick={onClose} 
                        ml={3} 
                        bg="grey.500"
                        border="none"
                        p="6"
                        boxShadow="10px 10px 30px rgba(0, 0, 0, 0.4), -10px -10px 30px rgba(255, 255, 255, 0.1), 4px 4px 10px rgba(0,0,0,0.3), -4px -4px 10px rgba(255,255,255,0.1)"
                        _hover={{
                            bg: 'grey.600',
                            boxShadow: '10px 10px 35px rgba(0, 0, 0, 0.5), -10px -10px 35px rgba(255, 255, 255, 0.1), 6px 6px 12px rgba(0,0,0,0.3), -6px -6px 12px rgba(255,255,255,0.1)',
                            transform: 'scale(1.05)',
                        }}
                        _active={{
                            bg: 'grey.700',
                            transform: 'translateY(2px)',
                            boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.5), -10px -10px 30px rgba(255, 255, 255, 0.1), inset 6px 6px 12px rgba(0,0,0,0.2), inset -6px -6px 12px rgba(255,255,255,0.1)',
                        }}
                    >
                        Cancelar
                    </Button> 
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
export default AsignarRol;
