import React, { useState, useEffect } from 'react';
import { Box, Text, useColorMode } from '@chakra-ui/react'; // Importar useColorMode
import axios from 'axios';

const ResumenVariable = ({ title, url, nodeId }) => {
  const { colorMode } = useColorMode();
  const [summary, setSummary] = useState({
    max_value: null,
    min_value: null,
    average_value: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const finalUrl = nodeId !== undefined ? `${url}?node_id=${nodeId}` : url;

        const response = await axios.get(finalUrl);
        const resumenData = response.data.summary; 
        setSummary(resumenData); 
      } catch (error) {
        console.error(`Error al obtener los datos del resumen de ${title}:`, error);
      }
    };
    fetchData();
  }, [url, title, nodeId]);

  return (
    <Box
      p={6}
      bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
      color={colorMode === 'light' ? 'black' : 'white'}
      borderRadius="md"
      textAlign="center"
      boxShadow="lg"
      transition="all 0.4s ease"
      _hover={{ boxShadow: 'xl', bg: colorMode === 'dark' ? 'gray.600' : 'gray.300', fontWeight: "bold" }}
    >
      <Text fontSize="1.25rem" fontWeight="bold" color="teal.300" mb={2}>
        {title}:
      </Text>
      <Text fontSize="lg" color={colorMode === 'dark' ? 'white' : 'black'} mb="1" textAlign="center">
        Máximo: {summary.max_value !== null ? summary.max_value.toFixed(2) : 'N/A'}
      </Text>
      <Text fontSize="lg" color={colorMode === 'dark' ? 'white' : 'black'} mb="1" textAlign="center">
        Mínimo: {summary.min_value !== null ? summary.min_value.toFixed(2) : 'N/A'}
      </Text>
      <Text fontSize="lg" color={colorMode === 'dark' ? 'white' : 'black'} mb="1" textAlign="center">
        Promedio: {summary.average_value !== null ? summary.average_value.toFixed(2) : 'N/A'}
      </Text>
    </Box>
  );
};

export default ResumenVariable;
