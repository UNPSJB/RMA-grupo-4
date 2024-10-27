import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    Select,
    useColorMode,
} from '@chakra-ui/react';
import axios from 'axios';

const AsignarRol = ({ isOpen, onClose, onConfirm, usuario }) => {
    const { colorMode } = useColorMode();
    const [roles, setRoles] = useState([]);
    const [nuevoRolId, setNuevoRolId] = useState("");

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:8000/rolesnombresId', {
                    headers: {
                        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbCI6ImFkbWluIiwiZXhwIjoxNzMwMDcyNTYyfQ.a4WdNwC0RWsz2CLbCXZnuqYHqpNsnFcGeNi4MC5A0ao",
                        "accept": "application/json"
                    }
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
