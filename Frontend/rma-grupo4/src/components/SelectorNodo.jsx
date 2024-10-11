import { Select } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function SelectorNodo({ onChange }) {
  const [nodos, setNodos] = useState([]); 
  const [selectedNode, setSelectedNode] = useState(0); 

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/clima/nodos/resumen')
      .then((response) => {
        const nodos = response.data.summary.map((item) => item.id_nodo);  
        
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
    <Select
      value={selectedNode}
      onChange={handleNodeChange}
      placeholder="Seleccione un nodo"
      size="md"  
      bg="gray.800" 
      color="white" 
      borderColor="gray.600"  
      _hover={{ borderColor: 'teal.300' }}  
      _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}  
      borderRadius="md"  
      ml={10}
      w="300px"
      sx={{
        option: {
          backgroundColor: 'gray.900',
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
  );
}

export default SelectorNodo;