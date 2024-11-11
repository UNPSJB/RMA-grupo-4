import React, { useState, useEffect } from 'react';
import {
  Box, FormControl, Heading, FormLabel, Input, Textarea, useToast, VStack, HStack, useColorMode, Table, Thead, Tbody, Tr, Th, Td, Button, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useColorModeValue, Select
} from '@chakra-ui/react';
import { FaTrashAlt, FaPen, FaPencilAlt } from "react-icons/fa";

const CrearVariable = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    numero: '',
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
 
  
    // Asegurarte de que 'numero' es un valor numérico válido
    const numero = parseInt(selectedTipo, 10); // Eliminamos espacios innecesarios
    if (isNaN(numero)) {
      toast({
        title: 'Número inválido.',
        description: 'Por favor ingresa un número válido.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const isDuplicate = variables.some(variable => parseInt(variable.numero) === numero);

  if (isDuplicate) {
    toast({
      title: 'Número duplicado.',
      description: 'Ya existe una variable con el mismo número. Ingrese un número único.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    return; // Si el número es duplicado, no procedemos con la creación
  }
  
    // Crear el objeto con los datos que vas a enviar
    const formDataToSend = {
      ...formData,
      numero: numero, // Asegurarse de que 'numero' es un número entero
    };
  
    console.log(formDataToSend); // Verifica que 'numero' es un número y que el objeto está correcto
  
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
  <Select
    placeholder="Selecciona un tipo de mensaje"
    value={selectedTipo}
    onChange={(e) => setSelectedTipo(e.target.value)} // Asegúrate de que selectedTipo sea un número
  >
    {tiposMensaje.map((tipo) => (
      <option key={tipo.valor} value={tipo.valor}>
        {tipo.valor} - {tipo.nombre}
      </option>
    ))}
  </Select>
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
                        FaPencilAlt title='Editar'
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
                        FaPencilAlt title='Eliminar'
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

