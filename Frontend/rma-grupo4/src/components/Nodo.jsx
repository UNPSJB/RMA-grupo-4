import React, { useState, useEffect } from 'react';
import {
  Box, FormControl, Heading, FormLabel, Input, Textarea, useToast, VStack, HStack, useColorMode, Table, Thead, Tbody, Tr, Th, Td, Button, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter
} from '@chakra-ui/react';
import { FaTrashAlt, FaPen} from "react-icons/fa";
import MapaNodo from '../analisis/MapaNodo';

const CrearNodo = () => {
  const [formData, setFormData] = useState({
    id_nodo:'',
    alias: '',
    longitud: '',
    latitud: '',
    descripcion: '',
  });
  const [nodos, setNodos] = useState([]);
  const [editingNodeId, setEditingNodeId] = useState(null); // Nodo en edición
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // Estado del modal de eliminación
  const [nodeToDelete, setNodeToDelete] = useState(null); // Nodo a eliminar
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isLight = colorMode === 'light';

  // Fetch inicial para obtener todos los nodos
  const fetchNodos = async () => {
    try {
      const response = await fetch('http://localhost:8000/obtenerNodos');
      const data = await response.json();
      if (response.ok) {
        setNodos(data);
      } else {
        toast({
          title: 'Error al cargar nodos.',
          description: data.message || 'No se pudieron cargar los nodos.',
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
    fetchNodos();
  }, []);

  // Maneja los cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleKeyDown = (e) => {
    // Permitir solo números, punto decimal y el signo negativo
    const allowedCharacters = /[0-9.-]/;
    if (!allowedCharacters.test(e.key) && e.key !== "Backspace" && e.key !== "Enter" && e.key !== "Tab") {
      e.preventDefault(); // Evitar la entrada
    }
  };

  const handleAliasKeyDown = (e) => {
    // Lista de caracteres especiales que quieres bloquear
    const specialCharacters = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~¡]/;
  
    // Evitar caracteres especiales
    if (specialCharacters.test(e.key) && e.key !== "Backspace" && e.key !== "Enter" && e.key !== "Tab") {
      e.preventDefault(); // Evitar la entrada
    }
  };
  

  const handleMapClick = (lat, lng) => {
    setFormData((prevData) => ({
      ...prevData,
      latitud: lat,
      longitud: lng,
    }));
  };

  // Maneja el envío del formulario (crear/modificar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isDuplicate = nodos.some(nodo => parseInt(nodo.id_nodo) === parseInt(formData.id_nodo));
    if (isDuplicate) {
      toast({
        title: 'ID nodo duplicado.',
        description: 'Ya existe un nodo con el mismo id. Ingrese  otro id.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return; 
    }
    try {
      const method = editingNodeId ? 'PUT' : 'POST';
      const endpoint = editingNodeId
        ? `http://localhost:8000/modificar_datos_nodo/${editingNodeId}`
        : 'http://localhost:8000/CrearNodo';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Asegúrate de que formData contiene los campos correctos
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: editingNodeId ? 'Nodo modificado.' : 'Nodo creado.',
          description: editingNodeId
            ? 'El nodo se ha modificado correctamente.'
            : 'El nodo se ha creado correctamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchNodos();
        setEditingNodeId(null); // Resetear el estado de edición
      } else {
        toast({
          title: 'Error.',
          description: data.message || 'Hubo un error al procesar el nodo.',
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
    setFormData({ id_nodo:'',alias: '', longitud: '', latitud: '', descripcion: '' });
  };


  // Establece el nodo en edición
  const handleEdit = (nodo) => {
    setEditingNodeId(nodo.id); // Usa el ID del nodo para edición
    setFormData({
      id_nodo: nodo.id_nodo,
      alias: nodo.alias,
      longitud: nodo.longitud,
      latitud: nodo.latitud,
      descripcion: nodo.descripcion,
    });
  };

  // Maneja la eliminación de nodos
    // Maneja la eliminación de nodos
    const handleDelete = (alias) => {
      setNodeToDelete(alias);
      setDeleteModalOpen(true); // Abre el modal de confirmación
    };
  
    const confirmDelete = async () => {
      setDeleteModalOpen(false);
      try {
        const response = await fetch(`http://localhost:8000/eliminar_nodo/${nodeToDelete}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          toast({
            title: 'Nodo eliminado.',
            description: 'El nodo ha sido eliminado correctamente.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          setNodos(nodos.filter((nodo) => nodo.alias !== nodeToDelete));
        } else {
          toast({
            title: 'Error.',
            description: 'No se pudo eliminar el nodo.',
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
    setEditingNodeId(null);
    setFormData({ id_nodo:'',alias: '', longitud: '', latitud: '', descripcion: '' });
  };


  return (
    <VStack display="flex" justifyContent="center" alignItems="center" minHeight="20vh" spacing={4} p={4} bg={colorMode === 'light' ? 'white' : 'gray.900'} color={colorMode === 'light' ? 'black' : 'white'}>
      <Heading as="h1" textAlign="center">Gestión Nodos</Heading>
      <HStack spacing={4}>
        <Box height="550px" maxW="sm" p={4} borderColor={isLight ? 'black' : 'gray.500'} borderWidth="1px" borderRadius="lg" bg={isLight ? 'white' : 'gray.800'}>
          <Heading as="h4" fontSize="1.2rem" textAlign="center" >{editingNodeId ? 'Modificar Nodo' : 'Crear Nodo'}</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel color={isLight ? 'black' : 'white'}>Id Nodo</FormLabel>
              <Input
                name="id_nodo"
                type="number"
                step={1}
                value={formData.id_nodo}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Ingrese el Id del Nodo"
                color={isLight ? 'black' : 'white'}
                borderColor={isLight ? 'black' : 'white'}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color={isLight ? 'black' : 'white'}>Alias</FormLabel>
              <Input
                name="alias"
                value={formData.alias}
                onChange={handleChange}
                onKeyDown={handleAliasKeyDown}
                placeholder="Ingrese el alias"
                color={isLight ? 'black' : 'white'}
                borderColor={isLight ? 'black' : 'white'}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel color={isLight ? 'black' : 'white'}>Longitud</FormLabel>
              <Input
                name="longitud"
                type="number"
                step="any"
                value={formData.longitud}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Ingrese la longitud"
                color={isLight ? 'black' : 'white'}
                borderColor={isLight ? 'black' : 'white'}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel color={isLight ? 'black' : 'white'}>Latitud</FormLabel>
              <Input
                name="latitud"
                type="number"
                step="any"
                value={formData.latitud}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Ingrese la latitud"
                color={isLight ? 'black' : 'white'}
                borderColor={isLight ? 'black' : 'white'}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel color={isLight ? 'black' : 'white'}>Descripción</FormLabel>
              <Textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Ingrese una descripción"
                color={isLight ? 'black' : 'white'}
                borderColor={isLight ? 'black' : 'white'}
                resize="none"
              />
            </FormControl>
            <HStack mt={2} display="flex" justifyContent="center" alignItems="center">
              <Button
                type="submit"
                colorScheme="green"
              >
                {editingNodeId ? 'Guardar' : 'Crear Nodo'}
              </Button>
              {editingNodeId && (
                <Button
                  onClick={handleCancelEdit}
                  colorScheme="red"
                >
                  Cancelar
                </Button>
              )}
            </HStack>
          </form>
        </Box>
  
        {/* Componente de Mapa */}
        <Box height="550px" width="700px" p={2} borderColor={isLight ? 'black' : 'gray.500'} borderWidth="1px" borderRadius="lg" bg={isLight ? 'white' : 'gray.800'}>
          <MapaNodo onMapClick={handleMapClick}/>
        </Box>
      </HStack>
  
      {/* Tabla de Nodos Existentes */}
      <Box width={993} p={4} borderWidth="1px" borderColor={isLight ? 'black' : 'gray.500'} borderRadius="lg" bg={isLight ? 'white' : 'gray.800'} mb={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th textAlign={'center'} color={isLight ? 'black' : 'white'}>Nodo</Th>
              <Th textAlign={'center'} color={isLight ? 'black' : 'white'}>Alias</Th>
              <Th textAlign={'center'} color={isLight ? 'black' : 'white'}>Latitud</Th>
              <Th textAlign={'center'} color={isLight ? 'black' : 'white'}>Longitud</Th>
              <Th textAlign={'center'} color={isLight ? 'black' : 'white'}>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {nodos.map((nodo) => (
              <Tr key={nodo.id}>
                <Td textAlign={'center'} color={isLight ? 'black' : 'white'}>{nodo.id_nodo}</Td>
                <Td textAlign={'center'} color={isLight ? 'black' : 'white'}>{nodo.alias}</Td>
                <Td textAlign={'center'} color={isLight ? 'black' : 'white'}>{nodo.latitud}</Td>
                <Td textAlign={'center'} color={isLight ? 'black' : 'white'}>{nodo.longitud}</Td>
                <Td textAlign={'center'}>
                  <IconButton
                    aria-label="Ediar"
                    icon={<FaPen />}
                    onClick={() => handleEdit(nodo)}
                    mr={2}
                    colorScheme='blue'
                  />
                  <IconButton icon={<FaTrashAlt />} onClick={() => handleDelete(nodo.alias)} aria-label="Eliminar" colorScheme='red'/>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
      <ModalOverlay />
      <ModalContent 
        bg={colorMode === 'light' ? 'white' : 'gray.700'} 
        color={colorMode === 'light' ? 'black' : 'white'}
        maxWidth="500px" // Ajusta el ancho máximo según sea necesario
      >
        <ModalHeader bg={colorMode === 'light' ? 'gray.200' : 'gray.800'} color={colorMode === 'light' ? 'black' : 'white'}>
          Confirmar Eliminación
        </ModalHeader>
        <ModalBody>
          ¿Está seguro de que desea eliminar el nodo con el alias "{nodeToDelete}"?
        </ModalBody>
        <ModalFooter>
          <Button               
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
            onClick={confirmDelete}>
            Sí, eliminar
          </Button>
          <Button
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
            onClick={() => setDeleteModalOpen(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </VStack>
  );    
};

export default CrearNodo;
