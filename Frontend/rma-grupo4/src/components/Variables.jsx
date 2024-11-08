import React, { useState, useEffect } from 'react';
import {
  Box, FormControl, Heading, FormLabel, Input, Textarea, useToast, VStack, HStack, useColorMode, Table, Thead, Tbody, Tr, Th, Td, Button, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useColorModeValue
} from '@chakra-ui/react';
import { FaTrashAlt, FaPen } from "react-icons/fa";

const CrearVariable = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    numero: '',
    unidad: '',
  });
  const [variables, setVariables] = useState([]);
  const [editingVariableId, setEditingVariableId] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [variableToDelete, setVariableToDelete] = useState(null);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isLight = colorMode === 'light';
  const buttonDefaultColor = useColorModeValue('gray.300', 'gray.600');
  const buttonHoverColor = useColorModeValue('rgb(0, 31, 63)', 'rgb(255, 130, 37)');
  const buttonShadow = useColorModeValue("5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff", "2px 2px 3px rgba(0, 0, 0, 0.3)");

  // Fetch variables
  const fetchVariables = async () => {
    try {
      const response = await fetch('http://localhost:8000/obtener_variables');
      const data = await response.json();
      if (response.ok) {
        setVariables(data);
      } else {
        toast({
          title: 'Error al cargar variables.',
          description: data.message || 'No se pudieron cargar las variables.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error de conexión.',
        description: 'No se pudo conectar con la API.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchVariables();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleKeyDown = (e) => {
    const allowedCharacters = /[0-9.-]/;
    if (!allowedCharacters.test(e.key) && e.key !== "Backspace" && e.key !== "Enter" && e.key !== "Tab") {
      e.preventDefault();
    }
  };

  const handleAliasKeyDown = (e) => {
    const specialCharacters = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~¡]/;
    if (specialCharacters.test(e.key) && e.key !== "Backspace" && e.key !== "Enter" && e.key !== "Tab") {
      e.preventDefault();
    }
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación para evitar números duplicados
    const isDuplicate = variables.some(variable => parseInt(variable.numero) === parseInt(formData.numero));
    if (isDuplicate) {
      toast({
        title: 'Número duplicado.',
        description: 'Ya existe una variable con el mismo número. Ingrese un número único.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return; 
    }
    const esNegativo = formData.numero <= 0;
    if (esNegativo) {
        toast({
          title: 'Número negativo.',
          description: 'Ingrese un número mayor a 0.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return; 
    }

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
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: editingVariableId ? 'Variable modificada.' : 'Variable creada.',
          description: editingVariableId
            ? 'La variable se ha modificado correctamente.'
            : 'La variable se ha creado correctamente.',
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
    setFormData({ nombre: '', numero: '', unidad: '' });
  };

  const handleEdit = (variable) => {
    setEditingVariableId(variable.id);
    setFormData({
      nombre: variable.nombre,
      numero: variable.numero,
      unidad: variable.unidad,
    });
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
          title: 'Variable eliminada.',
          description: 'La variable ha sido eliminada correctamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setVariables(variables.filter((variable) => variable.nombre !== variableToDelete));
      } else {
        toast({
          title: 'Error.',
          description: 'No se pudo eliminar la variable.',
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
  };

  const handleCancelEdit = () => {
    setEditingVariableId(null);
    setFormData({ nombre: '', numero: '', unidad: '' });
  };
  

  return (
    <VStack display="flex" justifyContent="center" alignItems="center" minHeight="20vh" spacing={4} p={4} bg={colorMode === 'light' ? 'white' : 'gray.900'} color={colorMode === 'light' ? 'black' : 'white'}>
      <Heading as="h1" textAlign="center">Gestión Variables</Heading>
      
      
      <VStack width="100%" spacing={8}>
        {/* Formulario */}
        <Box width="50%" p={4} borderColor={isLight ? 'black' : 'gray.500'} borderWidth="1px" borderRadius="lg" bg={isLight ? 'white' : 'gray.800'}>
          <Heading as="h4" fontSize="1.2rem" textAlign="center">{editingVariableId ? 'Modificar Variable' : 'Crear Variable'}</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel color={isLight ? 'black' : 'white'}>Nombre</FormLabel>
              <Input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ingrese el nombre de la variable" color={isLight ? 'black' : 'white'} borderColor={isLight ? 'black' : 'white'} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color={isLight ? 'black' : 'white'}>Número</FormLabel>
              <Input name="numero" type="number" value={formData.numero} onChange={handleChange} placeholder="Ingrese el número" color={isLight ? 'black' : 'white'} borderColor={isLight ? 'black' : 'white'} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color={isLight ? 'black' : 'white'}>Unidad</FormLabel>
              <Input name="unidad" value={formData.unidad} onChange={handleChange} placeholder="Ingrese la unidad" color={isLight ? 'black' : 'white'} borderColor={isLight ? 'black' : 'white'} />
            </FormControl>
            <HStack justify="center" spacing={4} mt={4}>
              <Button colorScheme="blue" type="submit">{!editingVariableId ? 'Crear' : 'Guardar'}</Button>
              <Button colorScheme="gray" onClick={handleCancelEdit}>Cancelar</Button>
            </HStack>
          </form>
        </Box>

        {/* Tabla */}
        <Box width="100%" bg={colorMode === 'light' ? 'gray.300' : 'gray.600'} p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
          <Box width="100%" p={4} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} borderRadius="md" boxShadow="lg" overflowX="auto">
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Nombre</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Número</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Unidad</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {variables.map((variable) => (
                  <Tr 
                    key={variable.id}
                    bg={colorMode === 'light' ? 'white' : 'gray.700'} 
                    color={colorMode === 'light' ? 'black' : 'white'}
                  >
                    <Td textAlign="center">{variable.nombre}</Td>
                    <Td textAlign="center">{variable.numero}</Td>
                    <Td textAlign="center">{variable.unidad}</Td>
                    <Td textAlign="center">
                      <IconButton 
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
          </Box>
        </Box>
      </VStack>

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Eliminar Variable</ModalHeader>
          <ModalBody>¿Estás seguro de que deseas eliminar esta variable?</ModalBody>
          <ModalFooter >
            <HStack spacing={4}>
                <Button colorScheme="red" onClick={confirmDelete}>Eliminar</Button>
                <Button onClick={() => setDeleteModalOpen(false)} colorScheme="blue" >Cancelar</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default CrearVariable;

