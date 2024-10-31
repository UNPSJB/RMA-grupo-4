import React, { useState, useEffect } from 'react';
import { Box, Text, useColorMode } from '@chakra-ui/react'; // Importar useColorMode
import axios from 'axios';
import { useAuth } from '../components/AuthContext';

const ResumenVariable = ({ title, url, nodeId, unidad }) => {
  const { colorMode } = useColorMode();
  const [summary, setSummary] = useState({
    max_value: null,
    min_value: null,
    average_value: null
  });
  const { token } = useAuth();

  useEffect(() => {
    let timeoutId;
    const fetchData = async () => {
      try {
        const finalUrl = nodeId !== undefined ? `${url}?node_id=${nodeId}` : url;

        const response = await axios.get(finalUrl , {headers: { Authorization: `Bearer ${token}`}});
        const resumenData = response.data.summary; 
        setSummary(resumenData); 
      } catch (error) {
        console.error(`Error al obtener los datos del resumen de ${title}:`, error);
      }
    };
    fetchData();
    const setupTimeout = () => {
      timeoutId = setTimeout(() => {
        fetchData();
        setupTimeout(); 
      }, 10000); 
    };

    setupTimeout();

    return () => clearTimeout(timeoutId);
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
        Máximo: {summary.max_value !== null ? summary.max_value.toFixed(2) : '--'}
        {summary.average_value !== null ? ` ${unidad}` : ''}
      </Text>
      <Text fontSize="lg" color={colorMode === 'dark' ? 'white' : 'black'} mb="1" textAlign="center">
        Mínimo: {summary.min_value !== null ? summary.min_value.toFixed(2) : '--'}
        {summary.average_value !== null ? ` ${unidad}` : ''}
      </Text>
      <Text fontSize="lg" color={colorMode === 'dark' ? 'white' : 'black'} mb="1" textAlign="center">
        Media: {summary.average_value !== null ? summary.average_value.toFixed(2) : '--'}
        {summary.average_value !== null ? ` ${unidad}` : ''}
      </Text>
    </Box>
  );
};

export default ResumenVariable;
