import React, { useState, useEffect } from 'react';
import {
  Box, FormControl, FormLabel, Input, Button, Textarea, useToast, HStack, useColorMode, Table, Thead, Tbody, Tr, Th, Td, IconButton
} from '@chakra-ui/react';
import { FaTrashAlt, FaPen } from "react-icons/fa";
import Mapa from '../analisis/Mapa';

const CrearNodo = () => {
  const [formData, setFormData] = useState({
    alias: '',
    longitud: '',
    latitud: '',
    descripcion: '',
  });
  const [nodos, setNodos] = useState([]);
  const [editingNodeId, setEditingNodeId] = useState(null); // Nodo en edición
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

  // Maneja el envío del formulario (crear/modificar)
  const handleSubmit = async (e) => {
    e.preventDefault();
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
    setFormData({ alias: '', longitud: '', latitud: '', descripcion: '' });
  };


  // Establece el nodo en edición
  const handleEdit = (nodo) => {
    setEditingNodeId(nodo.id); // Usa el ID del nodo para edición
    setFormData({
      alias: nodo.alias,
      longitud: nodo.longitud,
      latitud: nodo.latitud,
      descripcion: nodo.descripcion,
    });
  };

  // Maneja la eliminación de nodos
  const handleDelete = async (alias) => {
    try {
      const response = await fetch(`http://localhost:8000/eliminar_nodo/${alias}`, {
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
        setNodos(nodos.filter((nodo) => nodo.alias !== alias));
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

  return (
    <HStack display="flex" justifyContent="center" alignItems="center" minHeight="100vh" spacing={10}>
      {/* Tabla de Nodos Existentes */}
      <Box maxW="sm" p={4} borderWidth="1px" borderRadius="lg" bg={isLight ? 'white' : 'gray.800'}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th color={isLight ? 'black' : 'white'}>Alias</Th>
              <Th color={isLight ? 'black' : 'white'}>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {nodos.map((nodo) => (
              <Tr key={nodo.id}>
                <Td color={isLight ? 'black' : 'white'}>{nodo.alias}</Td>
                <Td>
                  <IconButton
                    aria-label="Edit Node"
                    icon={<FaPen />}
                    onClick={() => handleEdit(nodo)}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Delete Node"
                    icon={<FaTrashAlt />}
                    onClick={() => handleDelete(nodo.alias)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Formulario para Crear/Modificar Nodo */}
      <Box maxW="sm" p={4} borderWidth="1px" borderRadius="lg" bg={isLight ? 'white' : 'gray.800'}>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel color={isLight ? 'black' : 'white'}>Alias</FormLabel>
            <Input
              name="alias"
              value={formData.alias}
              onChange={handleChange}
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
            />
          </FormControl>
          <Button mt={6} colorScheme="blue" type="submit">
            {editingNodeId ? 'Modificar Nodo' : 'Crear Nodo'}
          </Button>
        </form>
      </Box>
      <Box
        width="lg"
        maxW="md"
        p={2}
        borderWidth="1px"
        borderRadius="lg"
        bg={isLight ? 'white' : 'gray.800'}
      >
        <Mapa />
      </Box>
    </HStack>
  );
};

export default CrearNodo;
