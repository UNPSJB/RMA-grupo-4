import React, { useState, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import axios from 'axios';

const ResumenVariable = ({ title, url }) => {
  const [summary, setSummary] = useState({
    max_value: null,
    min_value: null,
    average_value: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        const resumenData = response.data.summary; // Asegúrate de que la respuesta tenga esta estructura
        setSummary(resumenData); // Guardar el resumen completo
      } catch (error) {
        console.error(`Error al obtener los datos del resumen de ${title}:`, error);
      }
    };
    fetchData();
  }, [url, title]);

  return (
    <Box
      p={6}
      bg="gray.800"
      borderRadius="md"
      textAlign="center"
      boxShadow="lg"
      transition="all 0.4s ease"
      _hover={{ boxShadow: 'xl', bg: 'gray.500', fontWeight: "bold" }} // Agregar efecto hover
    >
      <Text fontSize="1.25rem" fontWeight="bold" color="teal.300" mb={2}>
        {title}
      </Text>
      <Text fontSize="lm" color="white" mb="1" textAlign="center">
        Máximo: {summary.max_value !== null ? summary.max_value.toFixed(2) : 'N/A'}
      </Text>
      <Text fontSize="lm" color="white" mb="1" textAlign="center">
        Mínimo: {summary.min_value !== null ? summary.min_value.toFixed(2) : 'N/A'}
      </Text>
      <Text fontSize="lm" color="white" mb="1" textAlign="center">
        Promedio: {summary.average_value !== null ? summary.average_value.toFixed(2) : 'N/A'}
      </Text>
    </Box>
  );
};

export default ResumenVariable;
