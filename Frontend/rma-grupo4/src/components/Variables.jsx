import React, { useState, useEffect } from 'react';
import {
  Box, FormControl, Heading, FormLabel, Input, useToast, VStack, HStack, useColorMode, Table, Thead, Tbody, Tr, Th, Td, Button, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useColorModeValue, Select, TableContainer
} from '@chakra-ui/react';
import { FaTrashAlt, FaPen, FaPlus, FaCogs } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const CrearVariable = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    numero: '',
    minimo: '',
    maximo: '',
    unidad: '',
  });
  const [variables, setVariables] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState("");
  const [editingVariableId, setEditingVariableId] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [variableToDelete, setVariableToDelete] = useState(null);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isLight = colorMode === 'light';
  const buttonDefaultColor = useColorModeValue('gray.300', 'gray.600');
  const buttonHoverColor = useColorModeValue('rgb(0, 31, 63)', 'rgb(255, 130, 37)');
  const buttonShadow = useColorModeValue("5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff", "2px 2px 3px rgba(0, 0, 0, 0.3)");
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const navigate = useNavigate();

  const tiposMensaje = [
    { nombre: "TEMP_T", valor: 1 },
    { nombre: "TEMP2_T", valor: 2 },
    { nombre: "HUMIDITY_T", valor: 3 },
    { nombre: "PRESSURE_T", valor: 4 },
    { nombre: "LIGHT_T", valor: 5 },
    { nombre: "SOIL_T", valor: 6 },
    { nombre: "SOIL2_T", valor: 7 },
    { nombre: "SOILR_T", valor: 8 },
    { nombre: "SOILR2_T", valor: 9 },
    { nombre: "OXYGEN_T", valor: 10 },
    { nombre: "CO2_T", valor: 11 },
    { nombre: "WINDSPD_T", valor: 12 },
    { nombre: "WINDHDG_T", valor: 13 },
    { nombre: "RAINFALL_T", valor: 14 },
    { nombre: "MOTION_T", valor: 15 },
    { nombre: "VOLTAGE_T", valor: 16 },
    { nombre: "VOLTAGE2_T", valor: 17 },
    { nombre: "CURRENT_T", valor: 18 },
    { nombre: "CURRENT2_T", valor: 19 },
    { nombre: "IT_T", valor: 20 },
    { nombre: "LATITUDE_T", valor: 21 },
    { nombre: "LONGITUDE_T", valor: 22 },
    { nombre: "ALTITUDE_T", valor: 23 },
    { nombre: "HDOP_T", valor: 24 },
    { nombre: "LEVEL_T", valor: 25 },
  ];

  // Fetch variables
  const fetchVariables = async () => {
    try {
      const response = await fetch('http://localhost:8000/obtener_variables');
      const data = await response.json();
      if (response.ok) {
        setVariables(data);
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
              Error al cargar variables: No se pudieron cargar las variables.
            </Box>
          ),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
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
            Error de conexión.: No se pudo conectar con la API.
          </Box>
        ),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchVariables();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const numero = parseInt(selectedTipo, 10); 
    const { nombre, minimo, maximo, unidad } = formData;
  
    if (!/^[a-zA-Z\s]+$/.test(nombre)) {
      toast({
        render: () => (
          <Box color="white" bg="red.600" borderRadius="md" p={5} mb={4} boxShadow="md" fontSize="lg">
            Nombre inválido: Solo se permiten letras y espacios.
          </Box>
        ),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    if (isNaN(numero) || numero <= 0) {
      toast({
        render: () => (
          <Box color="white" bg="red.600" borderRadius="md" p={5} mb={4} boxShadow="md" fontSize="lg">
            Número inválido: Seleccione un tipo de mensaje válido.
          </Box>
        ),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    const minimoNum = parseFloat(minimo);
    const maximoNum = parseFloat(maximo);
    if (isNaN(minimoNum) || isNaN(maximoNum) || minimoNum >= maximoNum) {
      toast({
        render: () => (
          <Box color="white" bg="red.600" borderRadius="md" p={5} mb={4} boxShadow="md" fontSize="lg">
            Rango inválido: Ingrese valores numéricos donde el mínimo sea menor al máximo.
          </Box>
        ),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    if (!/^[a-zA-Z0-9°%/]+$/.test(unidad)) {
      toast({
        render: () => (
          <Box color="white" bg="red.600" borderRadius="md" p={5} mb={4} boxShadow="md" fontSize="lg">
            Unidad inválida: Use solo letras, números o caracteres como ° y %.
          </Box>
        ),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (isNaN(numero)) {
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
            Número negativo: Ingrese un número mayor a 0.
          </Box>
        ),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const isDuplicate = variables.some(variable => parseInt(variable.numero) === numero && variable.id !== editingVariableId);

    if (isDuplicate) {
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
            Número duplicado: Ya existe una variable con el mismo número.
          </Box>
        ),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return; 
    }

    const formDataToSend = {
      ...formData,
      numero: numero, 
    };

    try {
      const method = editingVariableId ? 'PUT' : 'POST';
      const endpoint = editingVariableId
        ? `http://localhost:8000/modificar_variable/${editingVariableId}`
        : 'http://localhost:8000/crear_variable';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend), // Enviar formDataToSend
      });

      const data = await response.json();
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
              {editingVariableId
                ? 'La variable se ha modificado correctamente.'
                : 'La variable se ha creado correctamente.'}
            </Box>
          ),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchVariables();
        setEditingVariableId(null);
      } else {
        toast({
          title: 'Error.',
          description: data.message || 'Hubo un error al procesar la variable.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error.',
        description: 'No se pudo conectar con la API.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setFormData({ nombre: '', numero: '', minimo: '', maximo: '', unidad: '' });
    setFormModalOpen(false); 
  };

  const handleEdit = (variable) => {
    setEditingVariableId(variable.id);
    setFormData({
      nombre: variable.nombre,
      numero: variable.numero,
      minimo: variable.minimo,
      maximo: variable.maximo,
      unidad: variable.unidad,
    });
    setFormModalOpen(true); 
  };

  const handleDelete = (nombre) => {
    setVariableToDelete(nombre);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteModalOpen(false);
    try {
      const response = await fetch(`http://localhost:8000/eliminar_variable/${variableToDelete}`, {
        method: 'DELETE',
      });
      if (response.ok) {
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
              La variable ha sido eliminada correctamente.
            </Box>
          ),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setVariables(variables.filter((variable) => variable.nombre !== variableToDelete));
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
              Error: No se pudo eliminar la variable.
            </Box>
          ),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
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
            Error: No se pudo conectar con la API.
          </Box>
        ),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingVariableId(null);
    setFormData({ nombre: '', numero: '', minimo: '', maximo: '', unidad: '' });
    setFormModalOpen(false);
  };
  
  const handleRangosNotificaciones = () => {
    navigate(`/gestionRangosVariables`);
};

  return (
    <VStack display="flex" justifyContent="center" alignItems="center" minHeight="20vh" spacing={4} p={4} bg={colorMode === 'light' ? 'white' : 'gray.900'} color={colorMode === 'light' ? 'black' : 'white'}>
      <Heading as="h1" m={7} textAlign="center">Gestión Variables</Heading>
      <VStack width="100%" spacing={2}>
        {/* Tabla */}
        <Box width="100%" bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} p={2} borderRadius="md">
          <Box width="100%" p={10} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderRadius="md" boxShadow="lg" overflowX="auto">
            <Box textAlign="right" mb={4} mr={16}>
              <IconButton 
                FaPencilAlt title = "Agregar Variable"
                icon={<FaPlus />} 
                aria-label="Agregar Variable"
                onClick={() => { 
                  setFormModalOpen(true); 
                  setEditingVariableId(null); 
                  setFormData({ nombre: '', numero: '', unidad: '' }); 
                }}
                background={buttonDefaultColor}
                borderRadius="6px"
                boxShadow={buttonShadow}
                _hover={{ 
                    background: buttonHoverColor, 
                    color: "lightgray"
                }}
                mr={2}
              />
              <IconButton
                title="Configurar rangos"
                icon={<FaCogs />}
                aria-label="Agregar Nodo"
                background={buttonDefaultColor}
                borderRadius="6px"
                boxShadow={buttonShadow}
                _hover={{
                    background: buttonHoverColor,
                    color: "lightgray",
                }}
                onClick={handleRangosNotificaciones}
              />
            </Box>

            <TableContainer overflowX="auto">
              <Table variant="simple" colorScheme={colorMode === 'light' ? "blackAlpha" : "whiteAlpha"}>
                <Thead>
                  <Tr>
                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Nombre</Th>
                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Número</Th>
                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Rango Minimo</Th>
                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Rango Maximo</Th>
                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Unidad</Th>
                    <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {variables
                  .slice()
                  .sort((a, b) => a.numero - b.numero)
                  .map((variable) => (
                    <Tr 
                      key={variable.id}
                      bg={colorMode === 'light' ? 'white' : 'gray.700'} 
                      color={colorMode === 'light' ? 'black' : 'white'}
                      _hover={{ backgroundColor: colorMode === 'light' ? "gray.100" : "gray.700" }}
                    >
                      <Td textAlign="center">{variable.nombre}</Td>
                      <Td textAlign="center">{variable.numero}</Td>
                      <Td textAlign="center">{variable.minimo}</Td>
                      <Td textAlign="center">{variable.maximo}</Td>
                      <Td textAlign="center">{variable.unidad}</Td>
                      <Td textAlign="center">
                        <IconButton 
                          FaPencilAlt title = "Editar Variable"
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
                        <IconButton 
                          FaPencilAlt title = "Eliminar Variable"
                          icon={<FaTrashAlt />} 
                          onClick={() => handleDelete(variable.nombre)} 
                          aria-label="Eliminar"
                          background={buttonDefaultColor}
                          borderRadius="6px"
                          boxShadow={buttonShadow}
                          _hover={{ 
                            background: buttonHoverColor, 
                            color: "lightgray"
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </VStack>

      {/* Modal de Formulario para Crear/Modificar Variable */}
      <Modal isOpen={isFormModalOpen} onClose={handleCancelEdit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bg={colorMode === 'light' ? 'gray.200' : 'gray.800'}
            color={colorMode === 'light' ? 'black' : 'white'}
          >{editingVariableId ? 'Modificar Variable' : 'Crear Variable'}</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Nombre</FormLabel>
                <Input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ingrese el nombre de la variable" />
              </FormControl>
              <FormControl isRequired>
              <FormLabel color={isLight ? 'black' : 'white'}>Número</FormLabel>
                <Select
                  placeholder="Selecciona un tipo de mensaje"
                  value={selectedTipo}
                  onChange={(e) => setSelectedTipo(e.target.value)} 
                >
                  {tiposMensaje.map((tipo) => (
                    <option key={tipo.valor} value={tipo.valor}>
                      {tipo.valor} - {tipo.nombre}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Minimo</FormLabel>
                <Input name="minimo" value={formData.minimo} onChange={handleChange} placeholder="Ingrese el rango minimo de la variable" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Maximo</FormLabel>
                <Input name="maximo" value={formData.maximo} onChange={handleChange} placeholder="Ingrese el rango maximo de la variable" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Unidad</FormLabel>
                <Input name="unidad" value={formData.unidad} onChange={handleChange} placeholder="Ingrese la unidad" />
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Button 
                type="submit" 
                onClick={handleSubmit}
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
              >{!editingVariableId ? 'Crear' : 'Guardar'}</Button>
              <Button 
                onClick={handleCancelEdit}
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
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bg={colorMode === 'light' ? 'gray.200' : 'gray.800'}
            color={colorMode === 'light' ? 'black' : 'white'}
          >Eliminar Variable</ModalHeader>
          <ModalBody>¿Estás seguro de que deseas eliminar esta variable?</ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Button 
                onClick={confirmDelete}
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
              >Eliminar</Button>
              <Button 
                onClick={() => setDeleteModalOpen(false)} 
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
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default CrearVariable;