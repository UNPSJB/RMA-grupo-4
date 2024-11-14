import React, { useEffect, useState } from 'react';
import { IconButton, Button, Table, Tbody, Tr, Th, Td, Thead, useColorMode, Box, Heading, VStack, useColorModeValue, useToast } from '@chakra-ui/react';
import { FaPen } from 'react-icons/fa';
import ModalEditarRangos from './ModalEditarRangos';
import { useNavigate } from 'react-router-dom';

const RangosVariables = () => {
    const [variables, setVariables] = useState([]);
    const [rangos, setRangos] = useState({});
    const [selectedVariable, setSelectedVariable] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { colorMode } = useColorMode();
    const buttonDefaultColor = useColorModeValue('gray.300', 'gray.600');
    const buttonHoverColor = useColorModeValue('rgb(0, 31, 63)', 'rgb(255, 130, 37)');
    const buttonShadow = useColorModeValue("5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff", "2px 2px 3px rgba(0, 0, 0, 0.3)");
    const navigate = useNavigate();
    const toast = useToast();

    // Fetch para obtener las variables
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerVariables = async () => {
            try {
                const response = await fetch('http://localhost:8000/obtener_variables');
                const data = await response.json();
                setVariables(data);
    
                const initialRangos = {};
                data.forEach(variable => {
                    if (variable.rangos && variable.rangos.length > 0) {
                        // Cargar rangos desde la base de datos si existen
                        const rangosExistentes = {};
                        variable.rangos.forEach(rango => {
                            rangosExistentes[`${rango.color}Min`] = rango.min_val;
                            rangosExistentes[`${rango.color}Max`] = rango.max_val;
                        });
                        initialRangos[variable.id] = rangosExistentes;
                    } else {
                        // Configuración inicial si no existen rangos en la base de datos
                        initialRangos[variable.id] = {
                            verdeMin: variable.minimo,
                            verdeMax: variable.minimo,
                            amarilloMin: variable.minimo + 1,
                            amarilloMax: variable.minimo + 5,
                            naranjaMin: variable.minimo + 6,
                            naranjaMax: variable.minimo + 10,
                            rojoMin: variable.minimo + 11,
                            rojoMax: variable.maximo
                        };
                    }
                });
                setRangos(initialRangos);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener las variables:", error);
                setLoading(false);
            }
        };
    
        obtenerVariables();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    // Manejo de cambios en los rangos dentro del modal
    const handleRangoChange = (color, value) => {
        if (!selectedVariable) return; 
    
        setRangos(prevRangos => ({
            ...prevRangos,
            [selectedVariable.id]: {
                ...prevRangos[selectedVariable.id],
                [color]: value
            }
        }));
    };
    

    // Abrir modal y seleccionar variable
    const handleEdit = (variable) => {
        setSelectedVariable(variable);
        setIsModalOpen(true);
    };

    // Guardar cambios y cerrar modal
    const handleSave = () => {
        if (!selectedVariable || !rangos[selectedVariable.id]) {
            console.error("No se han definido los rangos para esta variable.");
            return;
        }
    
        const variableRangos = rangos[selectedVariable.id];
    
        if (variableRangos.verdeMax >= variableRangos.amarilloMin ||
            variableRangos.amarilloMax >= variableRangos.naranjaMin ||
            variableRangos.naranjaMax >= variableRangos.rojoMin) {
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
                        Los rangos se están solapando, revisa los valores.
                        </Box>
                    ),
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            return;
        }
    
        setIsModalOpen(false);
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
        navigate('/gestionVariables');
    };    

    return (
        <VStack display="flex" justifyContent="center" alignItems="center" minHeight="20vh" spacing={4} p={4} bg={colorMode === 'light' ? 'white' : 'gray.900'} color={colorMode === 'light' ? 'black' : 'white'}>
            <Heading as="h1" m={7} textAlign="center">Gestión Rangos Variables</Heading>
            <VStack width="100%" spacing={2}>
                <Box width="100%" bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} p={2} borderRadius="md">
                    <Box width="100%" p={10} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderRadius="md" boxShadow="lg" overflowX="auto">
                        <Table variant="simple" colorScheme={colorMode === 'light' ? "blackAlpha" : "whiteAlpha"} mb={4}>
                            <Thead>
                                <Tr>
                                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Variable</Th>
                                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Unidad</Th>
                                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Rango Mínimo Verde</Th>
                                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Rango Máximo Verde</Th>
                                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Rango Mínimo Amarillo</Th>
                                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Rango Máximo Amarillo</Th>
                                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Rango Mínimo Naranja</Th>
                                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Rango Máximo Naranja</Th>
                                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Rango Mínimo Rojo</Th>
                                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Rango Máximo Rojo</Th>
                                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Acciones</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {variables.map(variable => (
                                    <Tr 
                                        key={variable.id}
                                        bg={colorMode === 'light' ? 'white' : 'gray.700'} 
                                        color={colorMode === 'light' ? 'black' : 'white'}
                                        _hover={{ backgroundColor: colorMode === 'light' ? "gray.100" : "gray.700" }}
                                    >
                                        <Td textAlign="center">{variable.nombre}</Td>
                                        <Td textAlign="center">{variable.unidad}</Td>
                                        <Td textAlign="center">{rangos[variable.id]?.verdeMin}</Td>
                                        <Td textAlign="center">{rangos[variable.id]?.verdeMax}</Td>
                                        <Td textAlign="center">{rangos[variable.id]?.amarilloMin}</Td>
                                        <Td textAlign="center">{rangos[variable.id]?.amarilloMax}</Td>
                                        <Td textAlign="center">{rangos[variable.id]?.naranjaMin}</Td>
                                        <Td textAlign="center">{rangos[variable.id]?.naranjaMax}</Td>
                                        <Td textAlign="center">{rangos[variable.id]?.rojoMin}</Td>
                                        <Td textAlign="center">{rangos[variable.id]?.rojoMax}</Td>
                                        <Td textAlign="center">
                                            <IconButton 
                                                title = "Editar Rangos"
                                                icon={<FaPen />} 
                                                onClick={() => handleEdit(variable)} 
                                                aria-label="Editar" 
                                                background={buttonDefaultColor}
                                                borderRadius="6px"
                                                boxShadow={buttonShadow}
                                                _hover={{ 
                                                    background: buttonHoverColor, 
                                                    color: "lightgray"
                                                }}
                                                mr={2}
                                            />
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                        <Box display="flex" justifyContent="center" mt={8}>
                            <Button 
                                onClick={enviarRangos}
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
                                onClick={() => navigate('/gestionVariables')} 
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
                        </Box>
                        {/* Modal para editar rangos */}
                        <ModalEditarRangos
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            variable={selectedVariable || {}}  // Asegúrate de que no sea null
                            rangos={rangos}
                            handleRangoChange={handleRangoChange}
                            handleSave={handleSave}
                        />
                    </Box>
                </Box>
            </VStack>
        </VStack>
    );
};

export default RangosVariables;
