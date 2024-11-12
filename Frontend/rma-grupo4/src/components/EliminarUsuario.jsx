import React from 'react';
import { 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalFooter, 
    ModalBody, 
    Button, 
    useColorMode 
} from '@chakra-ui/react';

const EliminarUsuario = ({ isOpen, onClose, onConfirm }) => {
    const { colorMode } = useColorMode(); 

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
                    Eliminar Usuario
                </ModalHeader>
                <ModalBody>
                    ¿Está seguro que desea eliminar el usuario?
                </ModalBody>
                <ModalFooter>
                <Button 
                        onClick={onConfirm}
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
                        Eliminar
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

export default EliminarUsuario;
