import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  useToast,
  HStack,
  useColorMode,
} from '@chakra-ui/react';
import Mapa from '../analisis/Mapa';

const CrearNodo = () => {
  const [formData, setFormData] = useState({
    alias: '',
    longitud: '',
    latitud: '',
    descripcion: '',
  });

  const toast = useToast();
  const { colorMode } = useColorMode();
  const isLight = colorMode === 'light'; // Comprobamos si es modo claro

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/CrearNodo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: 'Nodo creado.',
          description: 'El nodo se ha creado correctamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error.',
          description: data.message || 'Hubo un error al crear el nodo.',
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

  return (
    <HStack display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Box
        maxW="sm"
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        margin={25}
        bg={isLight ? 'white' : 'gray.800'} // Fondo del formulario
        borderColor={isLight ? 'gray.700' : 'gray.200'}
      >
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel color={isLight ? 'black' : 'white'}>Alias</FormLabel>
            <Input
              name="alias"
              value={formData.alias}
              onChange={handleChange}
              placeholder="Ingrese el alias"
              color={isLight ? 'black' : 'white'} // Color del texto en Input
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
              color={isLight ? 'black' : 'white'} // Color del texto en Input
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
              color={isLight ? 'black' : 'white'} // Color del texto en Input
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
              color={isLight ? 'black' : 'white'} // Color del texto en Textarea
              borderColor={isLight ? 'black' : 'white'}
            />
          </FormControl>

          <Button mt={6} colorScheme="blue" type="submit">
            Crear Nodo
          </Button>
        </form>
      </Box>

      <Box
        width="lg"
        maxW="md"
        p={2}
        borderWidth="1px"
        borderRadius="lg"
        bg={isLight ? 'white' : 'gray.800'} // Fondo del mapa
        borderColor={isLight ? 'black' : 'gray.100'}
      >
        <Mapa />
      </Box>
    </HStack>
  );
};

export default CrearNodo;
