import React, { useState, useEffect } from 'react';
import { Select, Box, Flex , Grid, GridItem, Heading } from '@chakra-ui/react';
import TemperaturaHumedadLineas from './TemperaturaHumedadLineas';
import TemperaturaPrecipitacionBarra from './TemperaturaPrecipitacionBarra';
import HumedadPrecipitacionArea from './HumedadPrecipitacionArea';
import VientoRosaPrecipitacionBarra from './VientoRosa';
import PresionLineas from './PresionLineas';
import axios from 'axios';
import TablaSummary from './TablaSummary';
import Mapa from './Mapa';

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

    return (
        <Box textAlign="center" maxWidth="auto" mx="auto" bg="gray.900" boxShadow="md">
            <Heading pt="2" textAlign="center">Análisis Avanzado</Heading>
            <Box p={{ base: 2, md: 4 }}>
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
    );
};

export default PantallaComparativa;