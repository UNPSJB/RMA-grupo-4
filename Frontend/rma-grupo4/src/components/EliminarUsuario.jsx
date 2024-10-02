// EliminarUsuarioModal.js
import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button } from '@chakra-ui/react';

const EliminarUsuario = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="gray.700" color="white" >
                <ModalHeader>Eliminar Usuario</ModalHeader>
                <ModalBody>
                    ¿Está seguro que desea eliminar el usuario?
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" onClick={onConfirm} p="6" _hover={{ bg: 'red.700' ,  border: '2px solid red.300'}}>
                        Sí
                    </Button>
                    <Button onClick={onClose} ml={3} p="6" _hover={{ bg: 'gray.400', fontWeight:"bold", border: '2px solid gray.400' }} >
                        No
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EliminarUsuario;