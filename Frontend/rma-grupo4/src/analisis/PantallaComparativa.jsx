import React, { useState, useEffect } from 'react';
import { Select, Box, Flex , Grid, GridItem, Heading, Button } from '@chakra-ui/react';
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
    
        // Fijar colores para el PDF según el modo actual
        const options = {
          margin: [10, 0],
          filename: 'vista_datos_mejorada.pdf',
          html2canvas: {
            scale: 4, 
            useCORS: true,
            logging: true,
          },
          jsPDF: { format: 'a2', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        };
    
        // Aplicar estilos temporales para mejorar la visibilidad en PDF
        const originalColor = element.style.color;
        const originalBackgroundColor = element.style.backgroundColor;
    
        // Cambiar el color del texto y del fondo para que sea legible según el modo de color
        //element.style.color = colorMode === 'light' ? '#000000' : '#ffffff';
        //element.style.backgroundColor = colorMode === 'light' ? '#ffffff' : '#1A202C';
    
        setTimeout(() => {
          html2pdf().from(element).set(options).save().then(() => {
            // Restaurar los estilos originales después de la exportación
            element.style.color = originalColor;
            element.style.backgroundColor = originalBackgroundColor;
          });
        }, 500); // Tiempo para que los gráficos se redibujen correctamente
      };
    
    return (
        <Box textAlign="center" maxWidth="auto" mx="auto" bg="gray.900" boxShadow="md">
            
            <Box id="viewToDownload">

                <Box p={{ base: 2, md: 4 }} >
                    <Heading as="h1" pt="2" textAlign="center">Análisis Avanzado</Heading>
                    <Flex justify="center" mb={4} mt={2} wrap="wrap" gap={4}>
                        <Select 
                            value={selectedNode1} 
                            onChange={e => setSelectedNode1(e.target.value)} 
                            mb={4} 
                            width="150px"
                            sx={{
                                option: {
                                backgroundColor: 'gray.900',
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
                            width="150px"
                            sx={{
                                option: {
                                backgroundColor: 'gray.900',
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
                    <Grid
                        templateColumns={{ base: '1fr', md: '1fr 1fr' }} 
                        gap={4}
                        maxWidth="100%"
                        bg="gray.900"
                        borderRadius="md"
                        mb="4"
                    >
                        <GridItem bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
                            <TemperaturaHumedadLineas nodeId1={selectedNode1} nodeId2={selectedNode2} />
                        </GridItem>
                        <GridItem bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
                            <TemperaturaPrecipitacionBarra  nodeId1={selectedNode1} nodeId2={selectedNode2} />
                        </GridItem>
                    </Grid>
                    <Grid
                        templateColumns={{ base: '1fr', md: '1fr 1fr' }} 
                        gap={4}
                        maxWidth="100%"
                        bg="gray.900"
                        borderRadius="md"
                        mb="4"
                    >
                        <GridItem bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
                            <PresionLineas nodeId1={selectedNode1} nodeId2={selectedNode2} />
                        </GridItem>
                        <GridItem bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
                            <HumedadPrecipitacionArea nodeId1={selectedNode1} nodeId2={selectedNode2} />
                        </GridItem>
                    </Grid>
                    <Grid
                        templateColumns={{ base: '1fr', md: '1fr 1fr' }} 
                        gap={4}
                        maxWidth="100%"
                        bg="gray.900"
                        borderRadius="md"
                        mb="4"
                    >
                        <GridItem bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
                            <TablaSummary  nodeId1={selectedNode1} nodeId2={selectedNode2} />
                        </GridItem>
                        <GridItem bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
                            <GridItem mb="4">
                                <VientoRosaPrecipitacionBarra  nodeId1={selectedNode1} nodeId2={selectedNode2} />
                            </GridItem>
                            <GridItem>
                                <Mapa></Mapa>
                            </GridItem>
                        </GridItem>
                    </Grid>
                </Box>
            </Box>
            {/* Botón para descargar la vista como PDF */}
            <Button colorScheme="blue" m={4} onClick={downloadPDF}>
                Descargar PDF
            </Button>  
        </Box>
    );
};

export default PantallaComparativa;