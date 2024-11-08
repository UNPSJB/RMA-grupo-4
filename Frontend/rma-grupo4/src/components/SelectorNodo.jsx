import { Box, Select, useColorMode } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';

function SelectorNodo({ onChange }) {
  const { colorMode } = useColorMode(); // Obtener el estado del color mode
  const [nodos, setNodos] = useState([]); 
  const [selectedNode, setSelectedNode] = useState(0); 
  const { token } = useAuth();

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/clima/nodos', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        const nodos = response.data;  
        if (nodos.length > 0) {
          setNodos(nodos); 
          setSelectedNode(nodos[0]); 
        } else {
          console.error("No hay nodos disponibles.");
        }
      })
      .catch((error) => {
        console.error("Error fetching nodes from resumen", error);
      });
  }, []);

  const handleNodeChange = (e) => {
    const nodeId = parseInt(e.target.value);
    setSelectedNode(nodeId);
    onChange(nodeId); 
  };

  return (
  <Box>
    <Select
      value={selectedNode}
      onChange={handleNodeChange}
      placeholder="Seleccione un nodo"
      size="md"  
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      color={colorMode === 'light' ? 'black' : 'white'} 
      borderColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
      _hover={{ borderColor: 'teal.300' }}  
      _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}  
      borderRadius="md"  
      w="300px"
      sx={{
        option: {
          backgroundColor: colorMode === 'light' ? 'white' : 'gray.900',
          color: colorMode === 'light' ? 'black' : 'white',
        },
      }}
    >
      {nodos.map((nodo) => (
        <option
          key={nodo}
          value={nodo}
        >
          Nodo {nodo}
        </option>
      ))}
    </Select>
  </Box>
  );
}

export default SelectorNodo;