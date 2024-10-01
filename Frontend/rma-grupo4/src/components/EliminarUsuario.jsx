// EliminarUsuarioModal.js
import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button } from '@chakra-ui/react';

const EliminarUsuario = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Eliminar Usuario</ModalHeader>
                <ModalBody>
                    ¿Está seguro que desea eliminar el usuario?
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" onClick={onConfirm}>
                        Sí
                    </Button>
                    <Button onClick={onClose} ml={3}>
                        No
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EliminarUsuario;