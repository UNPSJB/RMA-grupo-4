import React, { useState, useEffect } from 'react';
import { Select, Box, Flex , Grid, GridItem, Heading, Button, useColorMode } from '@chakra-ui/react';
import TemperaturaHumedadLineas from './TemperaturaHumedadLineas';
import TemperaturaPrecipitacionBarra from './TemperaturaPrecipitacionBarra';
import HumedadPrecipitacionArea from './HumedadPrecipitacionArea';
import VientoRosaPrecipitacionBarra from './VientoRosa';
import PresionLineas from './PresionLineas';
import axios from 'axios';
import TablaSummary from './TablaSummary';
import Mapa from './Mapa';
import html2pdf from 'html2pdf.js';

const PantallaComparativa = () => {
    const [availableNodes, setAvailableNodes] = useState([]);
    const [selectedNode1, setSelectedNode1] = useState('0');
    const [selectedNode2, setSelectedNode2] = useState('1');
    const { colorMode } = useColorMode(); // Usar hook para manejar modos de color

    useEffect(() => {
        const fetchAvailableNodes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/clima/nodos/resumen');
                setAvailableNodes(response.data.summary.map(node => node.id_nodo));
            } catch (error) {
                console.error('Error fetching nodes:', error);
            }
        };

        fetchAvailableNodes();
    }, []);

    useEffect(() => {
        if (availableNodes.length > 0) {
            setSelectedNode1(availableNodes[0]);
            setSelectedNode2(availableNodes[1]);
        }
    }, [availableNodes]);

    const downloadPDF = () => {
        const element = document.getElementById('viewToDownload');
    
        const options = {
          margin: [10, 0],
          filename: 'vista_datos_mejorada.pdf',
          html2canvas: {
            scale: 4, 
            useCORS: true,
            logging: true,
            backgroundColor: '#ffffff', // Fondo siempre blanco
          },
          jsPDF: { format: 'a2', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        };
    
        // Aplicar estilos temporales
        const originalBackgroundColor = element.style.backgroundColor;
        const originalColor = element.style.color;
    
        // Obtener todos los gráficos
        const graphs = element.querySelectorAll('canvas');
    
        graphs.forEach((graph) => {
          const chart = graph.getContext('2d');
          chart.fillStyle = '#000000'; // Color de los gráficos a negro forzados
        });
    
        // Cambia el color de fondo y el color del texto para el PDF
        element.style.backgroundColor = '#ffffff'; 
        element.style.color = '#000000'; 
    
        setTimeout(() => {
          html2pdf().from(element).set(options).save().then(() => {
            // Restaurar los estilos originales después de la exportación
            element.style.backgroundColor = originalBackgroundColor;
            element.style.color = originalColor;
            
            // Restaurar los estilos de los gráficos
            graphs.forEach((graph) => {
              const chart = graph.getContext('2d');
              chart.fillStyle = ''; 
            });
          });
        }, 500); 
      };

    return (
        <Box textAlign="center" maxWidth="auto" mx="auto" bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'} boxShadow="md" color={colorMode === 'light' ? 'black' : 'white'}>
            <Box id="viewToDownload">
                <Box p={{ base: 2, md: 4 }}>
                    <Heading as="h1" pt="2" textAlign="center">Análisis Avanzado</Heading>
                    <Flex justify="center" mb={4} mt={2} wrap="wrap" gap={4}>
                        <Select 
                            value={selectedNode1} 
                            onChange={e => setSelectedNode1(e.target.value)} 
                            bg={colorMode === 'light' ? 'white' : 'gray.800'}
                            color={colorMode === 'light' ? 'black' : 'white'} 
                            borderColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
                            _hover={{ borderColor: 'teal.300' }}  
                            _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}  
                            borderRadius="md"   
                            width="150px"
                            sx={{
                                option: {
                                    backgroundColor: colorMode === 'light' ? 'white' : 'gray.900',
                                    color: colorMode === 'light' ? 'black' : 'white',
                                  },
                            }}
                        >
                            {availableNodes.map(node => (
                                <option key={node} value={node}>
                                    Nodo {node}
                                </option>
                            ))}
                        </Select>

                        <Select 
                            value={selectedNode2} 
                            onChange={e => setSelectedNode2(e.target.value)} 
                            mb={4} 
                            bg={colorMode === 'light' ? 'white' : 'gray.800'}
                            color={colorMode === 'light' ? 'black' : 'white'} 
                            borderColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
                            _hover={{ borderColor: 'teal.300' }}  
                            _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}  
                            borderRadius="md"   
                            width="150px"
                            sx={{
                                option: {
                                    backgroundColor: colorMode === 'light' ? 'white' : 'gray.900',
                                    color: colorMode === 'light' ? 'black' : 'white',
                                  },
                            }}
                        >
                            {availableNodes.map(node => (
                                <option key={node} value={node}>
                                    Nodo {node}
                                </option>
                            ))}
                        </Select>
                    </Flex>

                    {/* Gráficos */}
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} maxWidth="100%" bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'} borderRadius="md" mb="4">
                        <GridItem bg={colorMode === 'dark' ? 'gray.800' : 'gray.300'} p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
                            <TemperaturaHumedadLineas nodeId1={selectedNode1} nodeId2={selectedNode2} />
                        </GridItem>
                        <GridItem bg={colorMode === 'dark' ? 'gray.800' : 'gray.300'} p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
                            <TemperaturaPrecipitacionBarra nodeId1={selectedNode1} nodeId2={selectedNode2} />
                        </GridItem>
                    </Grid>

                    {/* Más Gráficos */}
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} maxWidth="100%" bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'} borderRadius="md" mb="4">
                        <GridItem bg={colorMode === 'dark' ? 'gray.800' : 'gray.300'} p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
                            <PresionLineas nodeId1={selectedNode1} nodeId2={selectedNode2} />
                        </GridItem>
                        <GridItem bg={colorMode === 'dark' ? 'gray.800' : 'gray.300'} p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
                            <HumedadPrecipitacionArea nodeId1={selectedNode1} nodeId2={selectedNode2} />
                        </GridItem>
                    </Grid>

                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} maxWidth="100%" bg={colorMode === 'dark' ? 'gray.900' : 'gray.100'} borderRadius="md" mb="4">
                        <GridItem bg={colorMode === 'dark' ? 'gray.800' : 'gray.300'} p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
                            <TablaSummary nodeId1={selectedNode1} nodeId2={selectedNode2} />
                        </GridItem>
                        <GridItem bg={colorMode === 'dark' ? 'gray.800' : 'gray.300'} p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
                            <GridItem mb="4">
                                <VientoRosaPrecipitacionBarra nodeId1={selectedNode1} nodeId2={selectedNode2} />
                            </GridItem>
                            <GridItem>
                                <Mapa />
                            </GridItem>
                        </GridItem>
                    </Grid>
                </Box>
            </Box>

            <Button colorScheme="blue" m={4} onClick={downloadPDF}>
                Descargar PDF
            </Button>
        </Box>
    );
};

export default PantallaComparativa;
