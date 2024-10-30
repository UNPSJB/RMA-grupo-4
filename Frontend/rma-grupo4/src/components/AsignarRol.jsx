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
                    <Button onClick={handleConfirm} colorScheme="blue">Confirmar</Button>
                    <Button onClick={onClose} ml={3} colorScheme="red">Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
export default AsignarRol;