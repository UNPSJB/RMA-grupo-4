import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input, FormControl, FormLabel, FormErrorMessage, useColorMode } from '@chakra-ui/react';

const ModalEditarRangos = ({ isOpen, onClose, variable, rangos, handleRangoChange, handleSave }) => {
    const [verdeMax, setVerdeMax] = useState(rangos[variable.id]?.verdeMax || '');
    const [amarilloMax, setAmarilloMax] = useState(rangos[variable.id]?.amarilloMax || '');
    const [naranjaMax, setNaranjaMax] = useState(rangos[variable.id]?.naranjaMax || '');
    const [error, setError] = useState('');
    const { colorMode } = useColorMode();
    const isLight = colorMode === 'light';

    useEffect(() => {
        // Actualiza los valores del estado al abrir el modal
        setVerdeMax(rangos[variable.id]?.verdeMax || '');
        setAmarilloMax(rangos[variable.id]?.amarilloMax || '');
        setNaranjaMax(rangos[variable.id]?.naranjaMax || '');
        setError('');
    }, [isOpen, variable, rangos]);

    const validateRanges = () => {
        if (
            parseFloat(verdeMax) >= parseFloat(amarilloMax) ||
            parseFloat(amarilloMax) >= parseFloat(naranjaMax)
        ) {
            setError("Los rangos no pueden solaparse, asegúrate de que cada máximo sea menor que el mínimo siguiente.");
            return false;
        }
        setError('');
        return true;
    };

    const handleSaveModal = () => {
        if (!validateRanges()) {
            return;
        }
    
        handleRangoChange('verdeMax', verdeMax);
        handleRangoChange('amarilloMax', amarilloMax);
        handleRangoChange('naranjaMax', naranjaMax);
    
        handleRangoChange('amarilloMin', parseFloat(verdeMax) + 1);
        handleRangoChange('naranjaMin', parseFloat(amarilloMax) + 1);
        handleRangoChange('rojoMin', parseFloat(naranjaMax) + 1);
    
        handleSave();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader
                    bg={colorMode === 'light' ? 'gray.200' : 'gray.800'}
                    color={colorMode === 'light' ? 'black' : 'white'}
                >Editar Rangos para {variable.nombre}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <p>Rango permitido: {variable.minimo} - {variable.maximo}</p>

                    <FormControl isInvalid={error}>
                        <FormLabel>Verde (máximo):</FormLabel>
                        <Input
                            type="number"
                            value={verdeMax}
                            onChange={(e) => setVerdeMax(e.target.value)}
                            min={variable.minimo}
                            max={variable.maximo}
                        />
                    </FormControl>

                    <FormControl isInvalid={error}>
                        <FormLabel>Amarillo (máximo):</FormLabel>
                        <Input
                            type="number"
                            value={amarilloMax}
                            onChange={(e) => setAmarilloMax(e.target.value)}
                            min={variable.minimo}
                            max={variable.maximo}
                        />
                    </FormControl>

                    <FormControl isInvalid={error}>
                        <FormLabel>Naranja (máximo):</FormLabel>
                        <Input
                            type="number"
                            value={naranjaMax}
                            onChange={(e) => setNaranjaMax(e.target.value)}
                            min={variable.minimo}
                            max={variable.maximo}
                        />
                    </FormControl>

                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                </ModalBody>

                <ModalFooter>
                    <Button 
                        onClick={handleSaveModal}
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
                    >Guardar</Button>
                    <Button 
                        onClick={onClose} // Cierra el modal sin guardar cambios
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
                    >Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalEditarRangos;
