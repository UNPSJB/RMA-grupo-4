import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input, FormControl, FormLabel, FormErrorMessage, useColorMode, VStack, Box, Text, HStack,
    useToast } from '@chakra-ui/react';

const ModalEditarRangos = ({ isOpen, onClose, variable, rangos, handleRangoChange, handleSave }) => {
    const [rangeValues, setRangeValues] = useState({
        verdeMin: '',
        verdeMax: '',
        amarilloMin: '',
        amarilloMax: '',
        naranjaMin: '',
        naranjaMax: '',
        rojoMin: '',
        rojoMax: ''
    });
    const [error, setError] = useState('');
    const { colorMode } = useColorMode();
    const toast = useToast();

    useEffect(() => {
        if (variable.id && rangos[variable.id]) {
            setRangeValues({
                verdeMin: variable.minimo,
                verdeMax: rangos[variable.id].verdeMax,
                amarilloMin: parseFloat(rangos[variable.id].verdeMax) + 1,
                amarilloMax: rangos[variable.id].amarilloMax,
                naranjaMin: parseFloat(rangos[variable.id].amarilloMax) + 1,
                naranjaMax: rangos[variable.id].naranjaMax,
                rojoMin: parseFloat(rangos[variable.id].naranjaMax) + 1,
                rojoMax: variable.maximo
            });
        }
        setError('');
    }, [isOpen, variable, rangos]);

    const validateRanges = () => {
        const { verdeMax, amarilloMax, naranjaMax } = rangeValues;
        
        if (!verdeMax || !amarilloMax || !naranjaMax) {
            setError("Todos los campos son requeridos");
            return false;
        }

        if (parseFloat(verdeMax) >= parseFloat(rangeValues.amarilloMin) ||
            parseFloat(amarilloMax) >= parseFloat(rangeValues.naranjaMin) ||
            parseFloat(naranjaMax) >= parseFloat(rangeValues.rojoMin)) {
            setError("Los rangos no pueden solaparse. Asegúrate de que cada máximo sea menor que el siguiente mínimo.");
            return false;
        }

        if (parseFloat(verdeMax) < variable.minimo || 
            parseFloat(naranjaMax) > variable.maximo) {
            setError(`Los valores deben estar entre ${variable.minimo} y ${variable.maximo}`);
            return false;
        }

        setError('');
        return true;
    };

    const handleValueChange = (color, value) => {
        const newValue = parseFloat(value);
        
        setRangeValues(prev => {
            const updated = { ...prev };
            
            updated[`${color}Max`] = value;
            
            if (color === 'verde') {
                updated.amarilloMin = newValue + 1;
            } else if (color === 'amarillo') {
                updated.naranjaMin = newValue + 1;
            } else if (color === 'naranja') {
                updated.rojoMin = newValue + 1;
            }
            
            return updated;
        });
    };

    const handleSaveModal = async () => {
        if (!validateRanges()) {
            return;
        }

        // Actualizar todos los valores
        handleRangoChange('verdeMin', rangeValues.verdeMin);
        handleRangoChange('verdeMax', rangeValues.verdeMax);
        handleRangoChange('amarilloMin', rangeValues.amarilloMin);
        handleRangoChange('amarilloMax', rangeValues.amarilloMax);
        handleRangoChange('naranjaMin', rangeValues.naranjaMin);
        handleRangoChange('naranjaMax', rangeValues.naranjaMax);
        handleRangoChange('rojoMin', rangeValues.rojoMin);
        handleRangoChange('rojoMax', rangeValues.rojoMax);

        await enviarRangos(); 

        handleSave();
        onClose();
    };

    const enviarRangos = async () => {
        const rangosArray = Object.keys(rangos).flatMap(id => {
            const variableRangos = rangos[id];
            return [
                {
                    variable_id: parseInt(id),
                    color: 'verde',
                    min_val: variableRangos.verdeMin,
                    max_val: parseFloat(variableRangos.verdeMax),
                    activo: true, 
                },
                {
                    variable_id: parseInt(id),
                    color: 'amarillo',
                    min_val: variableRangos.amarilloMin,
                    max_val: parseFloat(variableRangos.amarilloMax),
                    activo: true,
                },
                {
                    variable_id: parseInt(id),
                    color: 'naranja',
                    min_val: variableRangos.naranjaMin,
                    max_val: parseFloat(variableRangos.naranjaMax),
                    activo: true,
                },
                {
                    variable_id: parseInt(id),
                    color: 'rojo',
                    min_val: variableRangos.rojoMin,
                    max_val: variableRangos.rojoMax,
                    activo: true,
                }
            ];
        });
        try {
            const response = await fetch('http://localhost:8000/guardar_rangos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rangosArray) 
            });
            if (response.ok) {
                toast({
                    render: () => (
                      <Box 
                        color="white" 
                        bg="green.600" 
                        borderRadius="md" 
                        p={5} 
                        mb={4}
                        boxShadow="md"
                        fontSize="lg" 
                      >
                        Rangos guardados exitosamente
                      </Box>
                    ),
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    render: () => (
                        <Box 
                        color="white" 
                        bg="red.600" 
                        borderRadius="md" 
                        p={5} 
                        mb={4}
                        boxShadow="md"
                        fontSize="lg" 
                        >
                        Error al guardar los rangos.
                        </Box>
                    ),
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Error al enviar los rangos:", error);
        }
    }; 

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader
                    bg={colorMode === 'light' ? 'gray.200' : 'gray.800'}
                    color={colorMode === 'light' ? 'black' : 'white'}
                >
                    Editar Rangos para {variable.nombre}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={2} align="stretch">
                        <Box>
                            <Text fontWeight="bold">Rango permitido: {variable.minimo} - {variable.maximo}</Text>
                        </Box>

                        <FormControl isInvalid={error}>
                            <Box borderRadius="md">
                                <FormLabel fontWeight="bold" color="green.800">Rango Verde</FormLabel>
                                <Text fontSize="sm">Mínimo: {rangeValues.verdeMin}</Text>
                                <HStack spacing={2}>
                                    <Text fontSize="sm">Máximo:</Text>
                                    <Input
                                        type="number"
                                        value={rangeValues.verdeMax}
                                        onChange={(e) => handleValueChange('verde', e.target.value)}
                                        placeholder="Máximo"
                                        min={variable.minimo}
                                        max={variable.maximo}
                                    />
                                </HStack>
                            </Box>
                        </FormControl>

                        <FormControl isInvalid={error}>
                            <Box borderRadius="md">
                                <FormLabel fontWeight="bold" color="yellow.800">Rango Amarillo</FormLabel>
                                <Text fontSize="sm">Mínimo: {rangeValues.amarilloMin}</Text>
                                <HStack spacing={2}>
                                    <Text fontSize="sm">Máximo:</Text>
                                    <Input
                                        type="number"
                                        value={rangeValues.amarilloMax}
                                        onChange={(e) => handleValueChange('amarillo', e.target.value)}
                                        placeholder="Máximo"
                                        min={rangeValues.amarilloMin}
                                        max={variable.maximo}
                                    />
                                </HStack>
                            </Box>
                        </FormControl>

                        <FormControl isInvalid={error}>
                            <Box borderRadius="md">
                                <FormLabel fontWeight="bold" color="orange.800">Rango Naranja</FormLabel>
                                <Text fontSize="sm">Mínimo: {rangeValues.naranjaMin}</Text>
                                <HStack spacing={2}>
                                    <Text fontSize="sm">Máximo:</Text>
                                    <Input
                                        type="number"
                                    value={rangeValues.naranjaMax}
                                    onChange={(e) => handleValueChange('naranja', e.target.value)}
                                    placeholder="Máximo"
                                    min={rangeValues.naranjaMin}
                                    max={variable.maximo}
                                    />
                                </HStack>
                            </Box>
                        </FormControl>

                        <Box borderRadius="md">
                            <FormLabel fontWeight="bold" color="red.800">Rango Rojo</FormLabel>
                            <Text fontSize="sm">Mínimo: {rangeValues.rojoMin}</Text>
                            <Text fontSize="sm">Máximo: {rangeValues.rojoMax}</Text>
                        </Box>

                        {error && <FormErrorMessage>{error}</FormErrorMessage>}
                    </VStack>
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

export default ModalEditarRangos;